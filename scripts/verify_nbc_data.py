"""Validate the read-only NBC snapshot and record original/local asset provenance."""
import json
import re
from collections import Counter
from urllib.parse import quote, unquote, urlsplit, urlunsplit
import unicodedata
import ingest_nbc as m

report_file=m.DATA/'source-import-report.json'
report=json.loads(report_file.read_text(encoding='utf-8'))
# Retry the transient timeout and harmless NFC URL spelling variations once.
retry=[]
for item in report['imageErrors']:
    url=item['Url']
    parts=urlsplit(url)
    if 'timed out' in item['Error']:
        retry.append({'Url':url,'File':item['File']})
    elif parts.hostname=='nbc.gov.vn' and '404' in item['Error']:
        path=quote(unicodedata.normalize('NFC',unquote(parts.path)),safe='/()')
        candidate=urlunsplit(parts._replace(path=path))
        if candidate!=url:retry.append({'Url':candidate,'File':item['File']})
if retry:
    import subprocess
    manifest=m.CACHE/'retry-manifest.json'; results=m.CACHE/'retry-results.json'
    manifest.write_text(json.dumps(retry,ensure_ascii=False),encoding='utf-8')
    subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(m.ROOT/'scripts'/'download-nbc.ps1'),'-Manifest',str(manifest),'-Results',str(results)],check=True)

articles=json.loads((m.DATA/'source-articles.json').read_text(encoding='utf-8'))
home=json.loads((m.DATA/'source-home.json').read_text(encoding='utf-8'))
for article in articles:m.parse_article(article['sourceUrl'])
assets={m.imgpath(url):url for url in list(m.image_urls)}
# Archive cards sometimes use a distinct cover image absent from article bodies.
for cached in m.CACHE.glob('*.html'):
    tree=m.Tree(cached.read_text(encoding='utf-8-sig',errors='replace')).root
    for node in tree.walk():
        if node.tag=='img' and node.attrs.get('src'):
            source=node.attrs['src']
        else:
            match=re.search(r'background-image\s*:\s*url\([\s\"\x27]*([^\)\"\x27]+)',node.attrs.get('style',''),re.I)
            source=match[1] if match else ''
        if source:
            local=m.imgpath(source)
            if local and (m.ROOT/'public'/local.lstrip('/')).is_file():assets[local]=m.urljoin(m.BASE,source)
# Priority home and archive cover downloads provide mappings for cover-only files.
for manifest in m.CACHE.glob('*manifest.json'):
    entries=json.loads(manifest.read_text(encoding='utf-8-sig'))
    for entry in entries:
        path=m.Path(entry['File'])
        if path.parent==m.PUBLIC/'images':assets['/nbc/images/'+path.name]=entry['Url']
for item in report['imageErrors']:
    path=m.Path(item['File']);assets['/nbc/images/'+path.name]=item['Url']
records=[]
for local,url in sorted(assets.items()):
    path=m.ROOT/'public'/local.lstrip('/')
    records.append({'sourceUrl':url,'localUrl':local,'success':path.exists() and path.stat().st_size>0,'bytes':path.stat().st_size if path.exists() else 0})
(m.DATA/'source-assets.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
references=set(home['heroImages'])
for article in articles:
    references.add(article['thumbnail'])
    references.update(re.findall(r'src="(/nbc/images/[^"]+)"',article['content']))
missing=sorted(local for local in references if not (m.ROOT/'public'/local.lstrip('/')).is_file())
known={item['localUrl']:item for item in records}
report['assetVerification']={
    'referencedAssets':len(references),
    'missingAssets':[known.get(local,{'localUrl':local}) for local in missing],
    'missingArticleThumbnails':sum(a['thumbnail'] in missing for a in articles),
    'missingHomeHero':any(p in missing for p in home['heroImages']),
    'totalLocalImageFiles':len(list((m.PUBLIC/'images').glob('*'))),
    'localImageBytes':sum(p.stat().st_size for p in (m.PUBLIC/'images').glob('*')),
    'categoryCounts':dict(Counter(a['category'] for a in articles)),
    'duplicateSlugs':len(articles)-len({a['slug'] for a in articles}),
    'emptyFields':{key:sum(not a.get(key) for a in articles) for key in ['title','date','content','thumbnail']},
}
report_file.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report['assetVerification'],ensure_ascii=False,indent=2))

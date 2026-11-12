import json,subprocess
from pathlib import Path
from urllib.parse import urljoin
import ingest_nbc as m

home=m.Tree(m.HOME_FILE.read_text(encoding='utf-8-sig')).root
m.home_data(home)
for n in home.walk():
 if n.tag=='img' and n.attrs.get('src'):m.imgpath(n.attrs['src'])
 if 'background-image' in n.attrs.get('style',''):
  u=m.bgimage(n)
  if u:m.imgpath(u)
for f in list(m.CACHE.glob('*.html'))[:8]:
 try:
  t=m.Tree(f.read_text(encoding='utf-8-sig')).root.find(cls='single-article')
  if t:
   for n in t.all('img'):
    if n.attrs.get('src'):m.imgpath(n.attrs['src'])
 except Exception:pass
entries=[{'Url':u,'File':str(m.ROOT/'public'/m.imgpath(u).lstrip('/'))} for u in sorted(m.image_urls)]
manifest=m.CACHE/'priority-manifest.json';results=m.CACHE/'priority-results.json'
manifest.write_text(json.dumps(entries,ensure_ascii=False),encoding='utf-8')
cp=subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(m.ROOT/'scripts'/'download-nbc.ps1'),'-Manifest',str(manifest),'-Results',str(results)],capture_output=True,text=True,encoding='utf-8',errors='replace')
print(cp.stdout,cp.stderr,flush=True)
print('PRIORITY_IMAGES',len(entries),flush=True)

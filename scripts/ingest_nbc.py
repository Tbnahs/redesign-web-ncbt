from pathlib import Path
from html.parser import HTMLParser
from html import escape, unescape
from urllib.parse import urljoin, urlparse, urlunparse
import hashlib, json, re, subprocess, sys, time

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'scripts'/'nbc-cache'
CACHE.mkdir(parents=True,exist_ok=True)
PUBLIC=ROOT/'public'/'nbc'
PUBLIC.mkdir(parents=True,exist_ok=True)
DATA=ROOT/'src'/'data'
BASE='https://nbc.gov.vn/'
HOME_FILE=ROOT.parent/'reference-nbc-home.html'
CATEGORIES=['tin-tuc-su-kien','hoat-dong-tai-dia-phuong','ma-so-ma-vach','truy-xuat-nguon-goc','ma-lei','ma-udi','dao-tao']

class Node:
 def __init__(self,tag='',attrs=None,parent=None,text=''):
  self.tag=tag;self.attrs=dict(attrs or []);self.parent=parent;self.children=[];self.raw=text
 def has(self,cls):return cls in self.attrs.get('class','').split()
 def text(self):return re.sub(r'\s+',' ',unescape(self.raw if self.tag=='#text' else ' '.join(c.text() for c in self.children))).strip()
 def walk(self):
  yield self
  for child in self.children:yield from child.walk()
 def find(self,tag=None,cls=None):return next((x for x in self.walk() if (tag is None or x.tag==tag) and (cls is None or x.has(cls))),None)
 def all(self,tag=None,cls=None):return [x for x in self.walk() if (tag is None or x.tag==tag) and (cls is None or x.has(cls))]

class Tree(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=False);self.root=Node('root');self.stack=[self.root];self.feed(text)
 def handle_starttag(self,tag,attrs):
  node=Node(tag,attrs,self.stack[-1]);self.stack[-1].children.append(node)
  if tag not in {'img','input','br','hr','meta','link','source','area','embed','wbr'}:self.stack.append(node)
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if self.stack[-1].tag==tag:self.stack.pop()
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):self.stack[-1].children.append(Node('#text',parent=self.stack[-1],text=data))
 def handle_entityref(self,name):self.handle_data('&'+name+';')
 def handle_charref(self,name):self.handle_data('&#'+name+';')

def canonical(url):
 u=urlparse(urljoin(BASE,url));path=re.sub('/+','/',u.path).rstrip('/') or '/'
 if u.hostname not in {'nbc.gov.vn','www.nbc.gov.vn'}:return url
 return urlunparse(('https','nbc.gov.vn',path,'',u.query,''))
def article_url(url):return '/tintuc/' in urlparse(urljoin(BASE,url)).path
def cachefile(url):return CACHE/(hashlib.sha1(url.encode()).hexdigest()+'.html')
def fetch(urls):
 urls=list(dict.fromkeys(canonical(u) for u in urls))
 entries=[{'Url':u,'File':str(cachefile(u))} for u in urls]
 manifest=CACHE/'manifest.json';result=CACHE/'results.json'
 manifest.write_text(json.dumps(entries,ensure_ascii=False),encoding='utf-8')
 cp=subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(ROOT/'scripts'/'download-nbc.ps1'),'-Manifest',str(manifest),'-Results',str(result)],capture_output=True,text=True,encoding='utf-8',errors='replace')
 if cp.returncode:raise RuntimeError(cp.stdout+'\n'+cp.stderr)
 data=json.loads(result.read_text(encoding='utf-8-sig'))
 return data if isinstance(data,list) else [data]
def tree(url):return Tree(cachefile(canonical(url)).read_text(encoding='utf-8-sig',errors='replace')).root
def links(node):return [canonical(n.attrs.get('href','')) for n in node.all('a') if article_url(n.attrs.get('href',''))]
def slug(url):return urlparse(url).path.rstrip('/').split('/')[-1]
def bgimage(node):
 for n in node.walk():
  match=re.search(r'background-image\s*:\s*url\([\s\"\x27]*([^\)\"\x27]+)',n.attrs.get('style',''),re.I)
  if match:return urljoin(BASE,unescape(match.group(1)))
  if n.tag=='img' and n.attrs.get('src'):return urljoin(BASE,n.attrs['src'])
 return ''

image_urls=set()
def imgpath(url):
 url=urljoin(BASE,unescape(url)).replace('http://nbc.gov.vn/','https://nbc.gov.vn/')
 if urlparse(url).scheme not in {'http','https'}:return ''
 ext=Path(urlparse(url).path).suffix.lower()
 if ext not in ['.jpg','.jpeg','.png','.webp','.gif','.svg','.avif']:ext='.jpg'
 image_urls.add(url)
 return '/nbc/images/'+hashlib.sha1(url.encode()).hexdigest()[:20]+ext

ALLOWED={'p','div','span','h1','h2','h3','h4','h5','h6','strong','b','em','i','u','s','blockquote','ul','ol','li','a','img','br','hr','table','thead','tbody','tfoot','tr','td','th','figure','figcaption','sup','sub','video','source','iframe'}
def clean(node):
 if node.tag=='#text':return escape(unescape(node.raw))
 if node.tag in {'script','style','form','input','button'} or node.has('share-post') or node.has('post-intro'):return ''
 inside=''.join(clean(c) for c in node.children)
 if node.tag not in ALLOWED:return inside
 attrs={}
 if node.tag=='img':
  src=node.attrs.get('src','')
  if urlparse(src).scheme=='file':return escape(node.attrs.get('alt',''))
  local=imgpath(src)
  if not local:return ''
  attrs={'src':local,'alt':node.attrs.get('alt',''),'loading':'lazy'}
 elif node.tag=='a':
  href=urljoin(BASE,node.attrs.get('href',''))
  if urlparse(href).scheme not in {'http','https','mailto','tel'}:return inside
  if article_url(href):href='/tin-tuc/'+slug(href)
  attrs={'href':href}
  if href.startswith('http'):attrs.update({'target':'_blank','rel':'noopener noreferrer'})
 elif node.tag=='iframe':
  src=urljoin(BASE,node.attrs.get('src',''))
  if not any(host in (urlparse(src).hostname or '') for host in ['youtube.com','youtube-nocookie.com','youtu.be','vimeo.com']):return ''
  attrs={'src':src,'title':'Video bài viết','loading':'lazy','allowfullscreen':''}
 elif node.tag in {'td','th'}:
  attrs={k:v for k,v in node.attrs.items() if k in ['colspan','rowspan']}
 elif node.tag in {'video','source'}:
  src=node.attrs.get('src','')
  attrs={'src':urljoin(BASE,src)} if src else {}
  if node.tag=='video':attrs['controls']=''
  if node.tag=='source' and node.attrs.get('type'):attrs['type']=node.attrs['type']
 attrstr=''.join(' '+k+'="'+escape(v,quote=True)+'"' for k,v in attrs.items())
 if node.tag in {'img','br','hr','source'}:return '<'+node.tag+attrstr+'>'
 return '<'+node.tag+attrstr+'>'+inside+'</'+node.tag+'>'

url_categories={};listing_metadata={};errors=[]
def scan_listing(url,category):
 t=tree(url)
 main=t.find(cls='newspost-blog') or t
 for link in links(main):url_categories.setdefault(link,set()).add(category)
 for n in main.all('a'):
  href=n.attrs.get('href','')
  if not article_url(href):continue
  u=canonical(href);im=bgimage(n)
  if im:listing_metadata.setdefault(u,{})['thumbnail']=im
 return t
def parse_article(url):
 t=tree(url);single=t.find(cls='single-article')
 if single is None:return None
 parent=single.parent
 title=next((n.text() for n in parent.children if n.tag in {'h1','h2','h3'} and n.text()),'')
 if not title:
  meta=next((n for n in t.all('meta') if n.attrs.get('property')=='og:title'),None)
  title=meta.attrs.get('content','') if meta else ''
 date_match=re.search(r'Ngày đăng\s*:\s*(\d{1,2})[-/](\d{1,2})[-/](\d{4})',parent.text())
 date_value='-'.join([date_match[3],date_match[2].zfill(2),date_match[1].zfill(2)]) if date_match else ''
 summary_node=parent.find(cls='block_quote');summary=summary_node.text() if summary_node else ''
 img=single.find('img');cover=listing_metadata.get(url,{}).get('thumbnail','') or (urljoin(BASE,img.attrs['src']) if img and img.attrs.get('src') else '')
 cats=set(url_categories.get(url,[]));breadcrumb_categories=[]
 crumbs=t.find(cls='breadcrumbs')
 if crumbs:
  for link in crumbs.all('a'):
   path=urlparse(urljoin(BASE,link.attrs.get('href',''))).path.strip('/')
   if path.startswith('category/'):
    cat=path.split('/')[-1]
    if cat not in ['tin-tuc','news-event']:
     breadcrumb_categories.append(cat)
 if breadcrumb_categories:cats=set(breadcrumb_categories)
 preferred=breadcrumb_categories[-1] if breadcrumb_categories else next((c for c in CATEGORIES if c in cats),'tin-tuc-su-kien')
 content=''.join(clean(c) for c in single.children)
 fid=next((n.attrs.get('value') for n in t.all('input') if n.attrs.get('id')=='id_news'),None)
 return {'id':'nbc-'+str(fid or hashlib.sha1(url.encode()).hexdigest()[:10]),'title':title,'slug':slug(url),'date':date_value,'category':preferred,'categories':sorted(cats),'thumbnail':imgpath(cover) if cover else '', 'summary':summary,'content':content,'sourceUrl':url}

def home_data(home):
 heroes=[]
 # Banner carousel sits before header closes in this original template.
 for img in home.all('img'):
  src=img.attrs.get('src','')
  if any(x in src.lower() for x in ['slide','banner']):
   local=imgpath(src)
   if local and local not in heroes:heroes.append(local)
 feature=home.find(cls='section0-5')
 featured=list(dict.fromkeys(slug(u) for u in links(feature))) if feature else []
 sections=[]
 for block in home.all(cls='block'):
  h2=block.find('h2');title=h2.text() if h2 else ''
  unique=list(dict.fromkeys(slug(u) for u in links(block)))
  if title and unique:
   cat=next((urlparse(urljoin(BASE,n.attrs.get('href',''))).path.rstrip('/').split('/')[-1] for n in block.all('a') if '/category/' in urljoin(BASE,n.attrs.get('href',''))),'')
   sections.append({'title':title,'category':cat,'slugs':unique})
 latest=next((s['slugs'] for s in sections if 'Tin mới' in s['title']),[])
 labels=['Doanh nghiệp đã cấp mã số mã vạch','Sản phẩm đã được cấp mã quản lý sản phẩm','Chuỗi truy xuất nguồn gốc sản phẩm nông sản rau củ quả tươi','Lượt quét mỗi ngày trên toàn thế giới']
 numbers=[n for n in home.walk() if 'data-number' in n.attrs]
 stats=[{'value':int(n.attrs['data-number']),'label':labels[i] if i<len(labels) else n.parent.parent.text()} for i,n in enumerate(numbers)]
 sections=[s for s in sections if s['category'] in CATEGORIES and s['title']!='Tin mới nhất']
 return {'heroImages':heroes,'featuredSlugs':featured,'latestSlugs':latest,'sections':sections,'stats':stats}

def export(articles,home):
 articles.sort(key=lambda a:(a['date'],a['id']),reverse=True)
 (DATA/'source-articles.json').write_text(json.dumps(articles,ensure_ascii=False,indent=2),encoding='utf-8')
 (DATA/'source-home.json').write_text(json.dumps(home,ensure_ascii=False,indent=2),encoding='utf-8')

def main():
 start=time.time()
 home=Tree(HOME_FILE.read_text(encoding='utf-8-sig')).root
 hd=home_data(home)
 for u in links(home):url_categories.setdefault(u,set())
 # Seed quick results from a few articles before collecting archive pages.
 seed=list(url_categories)[:8]
 fetch(seed)
 articles=[]
 for u in seed:
  try:
   article=parse_article(u)
   if article:articles.append(article)
  except Exception as e:errors.append({'url':u,'error':str(e)})
 export(articles,hd)
 print('EARLY_SAMPLE',len(articles),flush=True)
 roots=[BASE+'category/'+c+'/' for c in CATEGORIES]
 result=fetch(roots);pages=[]
 for result in result:
  if not result['Success']:errors.append(result);continue
  u=result['Url'];category=urlparse(u).path.rstrip('/').split('/')[-1]
  t=scan_listing(u,category)
  maxpage=max([int(n) for n in re.findall(r'[?&]page=(\d+)',cachefile(u).read_text(encoding='utf-8-sig',errors='replace'))] or [1])
  for i in range(2,maxpage+1):pages.append((BASE+'category/'+category+'?page='+str(i),category))
 print('LISTING_PAGES',len(pages)+len(roots),flush=True)
 for offset in range(0,len(pages),24):
  batch=pages[offset:offset+24];results=fetch([u for u,c in batch]);cats=dict(batch)
  for result in results:
   if result['Success']:scan_listing(result['Url'],cats[result['Url']])
   else:errors.append(result)
  print('LISTINGS_DONE',min(offset+24,len(pages)),'ARTICLES_FOUND',len(url_categories),flush=True)
 remaining=[u for u in url_categories if u not in set(seed)]
 for offset in range(0,len(remaining),32):
  batch=remaining[offset:offset+32];results=fetch(batch)
  for result in results:
   if not result['Success']:errors.append(result);continue
   try:
    article=parse_article(result['Url'])
    if article:articles.append(article)
    else:errors.append({'url':result['Url'],'error':'No article container'})
   except Exception as e:errors.append({'url':result['Url'],'error':str(e)})
  export(articles,hd)
  print('ARTICLES_PARSED',len(articles),'OF',len(url_categories),flush=True)
 # Covers and inline images use a shared deduplicated local cache.
 image_entries=[]
 for u in sorted(image_urls):
  local=imgpath(u)
  image_entries.append({'Url':u,'File':str(ROOT/'public'/local.lstrip('/'))})
 image_results=[]
 for offset in range(0,len(image_entries),40):
  batch=image_entries[offset:offset+40]
  manifest=CACHE/'manifest.json';results=CACHE/'results.json';manifest.write_text(json.dumps(batch,ensure_ascii=False),encoding='utf-8')
  cp=subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(ROOT/'scripts'/'download-nbc.ps1'),'-Manifest',str(manifest),'-Results',str(results)],capture_output=True,text=True,encoding='utf-8',errors='replace')
  if cp.returncode:errors.append({'phase':'images','error':cp.stderr});continue
  rs=json.loads(results.read_text(encoding='utf-8-sig'));image_results.extend(rs if isinstance(rs,list) else [rs])
  print('IMAGES_DONE',min(offset+40,len(image_entries)),'OF',len(image_entries),flush=True)
 report={'articlesDiscovered':len(url_categories),'articlesImported':len(articles),'listingPages':len(pages)+len(roots),'imageUrls':len(image_entries),'imagesDownloaded':sum(bool(r['Success']) for r in image_results),'imageErrors':[r for r in image_results if not r['Success']],'errors':errors,'seconds':round(time.time()-start,1)}
 (DATA/'source-import-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print('COMPLETE',json.dumps({k:v for k,v in report.items() if k not in ['errors','imageErrors']}),flush=True)

if __name__=='__main__':main()

from html.parser import HTMLParser
from html import escape, unescape
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import hashlib, json, re

ROOT=Path(__file__).resolve().parents[1]
REF=ROOT/'scripts'/'static-reference'
BASE='https://nbc.gov.vn/'
pages=[
 ('about','/gioi-thieu/lich-su-hinh-thanh','Giới thiệu chung','category/gioi-thieu-chung/'),
 ('organization','/gioi-thieu/co-cau-to-chuc','Sơ đồ tổ chức','category/so-do-to-chuc/'),
 ('faq','/hoi-dap/cau-hoi-thuong-gap','Câu hỏi thường gặp','category/cau-hoi-thuong-gap/'),
 ('elearning','/e-learning','E-Learning','e-learning/'),
 ('contact','/lien-he','Liên hệ','category/lien-he/'),
 ('questions','/hoi-dap/danh-sach-cau-hoi','Danh sách câu hỏi','category/danh-sach-cau-hoi/'),
 ('create-question','/hoi-dap/tao-cau-hoi','Tạo câu hỏi','category/tao-cau-hoi/'),
]

def extract_element(raw,pattern,tag='div',start=0):
    m=re.search(pattern,raw[start:],re.I)
    if not m:return ''
    pos=start+m.start(); token=re.compile(r'</?'+re.escape(tag)+r'\b[^>]*>',re.I)
    depth=0
    for match in token.finditer(raw,pos):
        depth+=-1 if match.group().startswith('</') else 1
        if depth==0:return raw[pos:match.end()]
    return ''

allowed={'div','p','span','strong','em','b','i','u','s','br','hr','h1','h2','h3','h4','h5','h6','ul','ol','li','table','thead','tbody','tfoot','tr','th','td','a','img','blockquote','section','label','input','select','option','textarea','button'}
void={'br','hr','img','input'}
skip={'script','style','noscript'}
images={}
class Sanitizer(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.out=[];self.skipping=0;self.form_fields=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag in skip:self.skipping+=1;return
        if self.skipping:return
        if tag=='input' and (d.get('type')=='hidden' or d.get('name')=='_token'):return
        if tag=='form':self.out.append('<div class="reference-form">');return
        if tag not in allowed:return
        if tag in {'input','textarea','select'}:
            self.form_fields.append({k:v for k,v in d.items() if k in {'name','type','placeholder','required'}})
        clean=[]
        for key,val in attrs:
            if val is None:
                if key=='required':clean.append('required')
                continue
            if key in {'title','alt','colspan','rowspan','width','height','name','type','placeholder','value'}:
                clean.append(key+'="'+escape(val,quote=True)+'"')
            elif key=='class':
                if tag in {'table','tr','td','th'}:clean.append('class="'+escape(val,quote=True)+'"')
            elif key in {'href','src'}:
                absolute=urljoin(BASE,val)
                if urlsplit(absolute).scheme not in {'http','https','mailto','tel'}:continue
                if key=='href':
                    # Keep original public destination; parent can map the source routes.
                    clean.append('href="'+escape(absolute,quote=True)+'"')
                    clean.append('rel="noopener noreferrer"')
                else:
                    parsed=urlsplit(absolute)
                    if parsed.hostname in {'nbc.gov.vn','www.nbc.gov.vn'}:
                        absolute=absolute.replace('http://','https://',1)
                        ext=Path(parsed.path).suffix.lower()
                        if ext not in {'.jpg','.jpeg','.png','.gif','.svg','.webp'}:ext='.jpg'
                        image_path='/nbc/static-pages/'+hashlib.sha1(absolute.encode()).hexdigest()[:18]+ext
                        images[absolute]={'url':absolute,'path':str(ROOT/'public'/image_path.lstrip('/')),'publicPath':image_path}
                        if (ROOT/'public'/image_path.lstrip('/')).exists():absolute=image_path
                    clean.append('src="'+escape(absolute,quote=True)+'"')
                    clean.append('loading="lazy"')
            elif key=='style':
                properties=[]
                for pair in val.split(';'):
                    if ':' not in pair:continue
                    k,v=pair.split(':',1)
                    if k.strip().lower() in {'text-align','font-weight','font-style','text-decoration','width','max-width'} and 'url(' not in v.lower():properties.append(k.strip()+':'+v.strip())
                if properties:clean.append('style="'+escape(';'.join(properties),quote=True)+'"')
        self.out.append('<'+tag+(' '+' '.join(clean) if clean else '')+'>')
    def handle_endtag(self,tag):
        if tag in skip:self.skipping=max(0,self.skipping-1);return
        if self.skipping:return
        if tag=='form':self.out.append('</div>');return
        if tag in allowed and tag not in void:self.out.append('</'+tag+'>')
    def handle_data(self,data):
        if not self.skipping:self.out.append(escape(data))

result={}
for key,path,title,source_path in pages:
    raw=(REF/(key+'.html')).read_text(encoding='utf-8-sig')
    available='OOPS! ERROR 404 NOT FOUND.' not in raw[raw.find('</header>'):raw.find('<footer>')]
    body=''
    if available:
        body=extract_element(raw,r'<div\b[^>]*class=["\'][^"\']*field-item\s+even[^"\']*["\'][^>]*>')
        if not body:
            main_index=raw.find('id="block-system-main"')
            if main_index<0:main_index=raw.find('</header>')
            body=extract_element(raw,r'<div\b[^>]*class=["\']col-md-8["\'][^>]*>',start=main_index)
        if not body and key=='contact':body=extract_element(raw,r'<form\b[^>]*action=["\']sendmail-contact["\'][^>]*>',tag='form')
    sanitizer=Sanitizer();sanitizer.feed(body)
    content=''.join(sanitizer.out)
    content=re.sub(r'(<th\b[^>]*>[^<]*)</td>',r'\1</th>',content)
    # Remove excessive source-indent whitespace, while retaining the actual text.
    content=re.sub(r'\s+',' ',content).strip()
    result[path]={'title':title,'path':path,'sourceUrl':urljoin(BASE,source_path),'available':available,'content':content,'formFields':sanitizer.form_fields}
out=ROOT/'src'/'data'/'source-pages.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
(REF/'image-manifest.json').write_text(json.dumps(list(images.values()),ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':[{k:v for k,v in page.items() if k not in {'content','formFields'}}|{'contentChars':len(page['content']),'formFields':page['formFields']} for page in result.values()],'images':len(images)},ensure_ascii=False,indent=2))

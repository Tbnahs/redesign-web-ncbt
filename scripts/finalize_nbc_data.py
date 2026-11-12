import json
import ingest_nbc as m

articles=json.loads((m.DATA/'source-articles.json').read_text(encoding='utf-8'))
fixed=[]
for article in articles:
 item=m.parse_article(article['sourceUrl'])
 if item:
  # Keep thumbnail from the full archive scan, where small cover images were discovered.
  item['thumbnail']=article['thumbnail']
  fixed.append(item)
home=m.home_data(m.Tree(m.HOME_FILE.read_text(encoding='utf-8-sig')).root)
m.export(fixed,home)
print('FINALIZED',len(fixed),'articles; sections:',[(s['title'],s['category']) for s in home['sections']],'stats:',home['stats'])

import fs from 'node:fs/promises';
const tabs=await (await fetch('http://127.0.0.1:9225/json')).json();
const tab=tabs.find(t=>t.type==='page');const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map();ws.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){pending.get(d.id)?.(d);pending.delete(d.id);}});const cmd=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,d=>d.error?reject(d.error):resolve(d.result));ws.send(JSON.stringify({id:n,method,params}));});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const js=async expression=>(await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
await cmd('Page.enable');await cmd('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});await cmd('Page.navigate',{url:'http://127.0.0.1:5173/'});await pause(5000);await js('document.fonts.ready');
async function shot(name){const s=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await fs.writeFile(name,Buffer.from(s.data,'base64'));}
await shot('preview-ncbt-desktop.png');
console.log('desktop',await js(`JSON.stringify({title:document.title,width:document.documentElement.scrollWidth,viewport:innerWidth,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),font:getComputedStyle(document.body).fontFamily,stories:document.querySelectorAll('.source-featured-row').length})`));
await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await pause(700);await shot('preview-ncbt-mobile.png');console.log('mobile',await js('JSON.stringify({width:document.documentElement.scrollWidth,viewport:innerWidth})'));
ws.close();

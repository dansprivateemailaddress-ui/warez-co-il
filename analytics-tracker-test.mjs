import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const code=readFileSync('analytics-tracker.js','utf8');
const data=new Map();const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v))};
let now=Date.now(),calls=[];
function visit({url='https://warez.co.il/',referrer='',dnt='',gpc=false}={}){
 calls=[];const u=new URL(url);const FakeDate=class extends Date{static now(){return now}};
 const context={location:u,document:{referrer,visibilityState:'visible',addEventListener(){}},navigator:{doNotTrack:dnt,globalPrivacyControl:gpc},sessionStorage:storage,localStorage:{getItem:()=>null},crypto:{randomUUID},URL,URLSearchParams,Date:FakeDate,addEventListener(){},fetch:(path,init)=>{calls.push(JSON.parse(init.body));return Promise.resolve({})}};
 vm.runInNewContext(code,context);return calls[0];
}
const first=visit({referrer:'https://forum.example/deals?secret=private'});assert.equal(first.referrer,'https://forum.example/deals');assert(!JSON.stringify(first).includes('private'));
now+=60000;const second=visit({url:'https://warez.co.il/tools/notion.html',referrer:'https://warez.co.il/'});assert.equal(second.referrer,first.referrer);assert.equal(second.session,first.session);
now+=31*60000;const expired=visit();assert.equal(expired.referrer,'');assert.notEqual(expired.session,first.session);
const tagged=visit({url:'https://warez.co.il/?utm_source=instagram&utm_medium=social&utm_campaign=november'});assert.equal(tagged.source,'instagram');assert.equal(tagged.campaign,'november');assert.notEqual(tagged.session,expired.session);
const changed=visit({url:'https://warez.co.il/?utm_source=instagram&utm_medium=social&utm_campaign=december'});assert.notEqual(changed.session,tagged.session);assert.equal(changed.campaign,'december');
const click=visit({url:'https://warez.co.il/?gclid=sensitive-click-id'});assert.equal(click.source,'Google');assert.equal(click.medium,'cpc');assert(!JSON.stringify(click).includes('sensitive-click-id'));
const social=visit({url:'https://warez.co.il/?fbclid=another-sensitive-click'});assert.equal(social.source,'Facebook');assert.equal(social.medium,'social');
assert.equal(visit({dnt:'1'}),undefined);assert.equal(visit({gpc:true}),undefined);
console.log('PASS: external referrer retention across internal navigation, session expiry, campaign session changes, click-source detection without IDs, DNT/GPC');

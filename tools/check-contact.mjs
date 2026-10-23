import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('docs/contact-form.js', 'utf8');
function mount(fetchImpl, {valid = true, token = 'test-challenge'} = {}) {
  let onSubmit;
  let resetCount = 0;
  let captchaResets = 0;
  const service = {value:'general', selectedIndex:0, options:[{text:'Website design or refresh'}]};
  const form = {action:'https://api.web3forms.com/submit', reportValidity:()=>valid,
    addEventListener:(type, handler)=>{ if (type === 'submit') onSubmit = handler; },
    setAttribute(){}, reset(){resetCount++;}};
  const nodes = {'inquiry-form':form,'contact-fields':{disabled:false},'send-inquiry':{textContent:'Send message'},'inquiry-status':{dataset:{}},'inquiry-service':service};
  const data = {access_key:'public-key',name:'Sample Visitor',email:'visitor@example.com',message:'Please help with a website refresh.',service:'website','h-captcha-response':token};
  const context = vm.createContext({document:{getElementById:id=>nodes[id]},location:{search:'?service=website'},
    window:{hcaptcha:{reset(){captchaResets++;}}},URLSearchParams,AbortController,setTimeout,clearTimeout,
    FormData:class {constructor(){return Object.entries(data);}},fetch:fetchImpl});
  vm.runInContext(source, context);
  return {nodes,data,submit:()=>onSubmit({preventDefault(){}}),resets:()=>resetCount,captchaResets:()=>captchaResets};
}
let requests = 0;
for (const options of [{valid:false},{token:''}]) {
  const screen = mount(()=>{requests++;}, options);
  await screen.submit();
  assert.equal(requests, 0, 'invalid input or absent challenge must not transmit');
}
let resolveRequest;
let submitted;
const success = mount(async (url, options)=>{requests++;submitted={url,options};return new Promise(resolve=>{resolveRequest=resolve;});});
const pending = success.submit();
assert.equal(success.nodes['contact-fields'].disabled, true);
await success.submit();
assert.equal(requests, 1, 'double submit must send just one request');
const body = JSON.parse(submitted.options.body);
assert.equal(submitted.url, 'https://api.web3forms.com/submit');
assert.equal(body.subject, 'Website Design or Refresh Inquiry');
assert.equal(body.email, 'visitor@example.com');
assert.equal(body.service, 'Website design or refresh');
resolveRequest({ok:true,json:async()=>({success:true})});
await pending;
assert.equal(success.resets(), 1);
assert.equal(success.nodes['inquiry-status'].dataset.state, 'success');
assert.equal(success.nodes['contact-fields'].disabled, false);
assert.equal(success.captchaResets(), 1);
for (const response of [
  async()=>({ok:false,json:async()=>({success:false})}),
  async()=>({ok:true,json:async()=>({success:false})}),
  async()=>{throw new TypeError('Network offline');},
  async()=>{const error=new Error('Timeout');error.name='AbortError';throw error;}
]) {
  const screen = mount(response);
  await screen.submit();
  assert.equal(screen.resets(), 0, 'failed delivery must preserve input');
  assert.equal(screen.nodes['inquiry-status'].dataset.state, 'error');
  assert.equal(screen.nodes['contact-fields'].disabled, false);
  assert.equal(screen.nodes['send-inquiry'].textContent, 'Send message');
}
console.log('Contact checks passed: validation, captcha gate, payload, duplicate prevention, success, API rejection, network failure, and timeout. No email sent.');

const headers={'Content-Type':'application/json','Cache-Control':'no-store'};
const recent=new Map();
const MAX_BODY=75000;
const clean=(value,max=500)=>String(value||'').trim().replace(/\s+/g,' ').slice(0,max);
const escapeHtml=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asArray=value=>Array.isArray(value)?value:[];

function validate(payload){
 const submissionId=clean(payload.submissionId,100),name=clean(payload.contact?.name,120),email=clean(payload.contact?.email,254);
 if(!submissionId||!name||!/^\S+@\S+\.\S+$/.test(email))throw new Error('Valid submission, name, and email are required');
 if(!payload.answers||!payload.result||payload.result.version!=='2.1.0')throw new Error('Assessment answers and current result are required');
 return{submissionId,name,email,marketingConsent:payload.contact?.marketingConsent===true,answers:payload.answers,result:payload.result};
}
function rows(result){
 return [
  ['How much you manage vs. how much you do',result.placement?.label],['What you told us',result.placement?.evidence],
  ['Best first job to hand off',result.bestResponsibility?.title],['Why it ranked highest',result.bestResponsibility?.rationale],
  ['Readiness',result.readiness?.band],['Readiness evidence',`${result.readiness?.explanation||''} Yellow: ${result.readiness?.yellowEvidence||''} Green: ${result.readiness?.greenEvidence||''}`],
  ['Room to grow',`${result.targetRichness?.label||''}. ${result.targetRichness?.line||''}`]
 ];
}
function emailDocument(data){
 const r=data.result,blueprint=Object.entries(r.blueprint||{}),prompts=asArray(r.prompts);
 const htmlRows=rows(r).map(([label,value])=>`<h2 style="margin:24px 0 6px">${escapeHtml(label)}</h2><p style="margin:0;color:#3f4650">${escapeHtml(value)}</p>`).join('');
 const promptHtml=prompts.map((p,i)=>`<h3>Prompt ${i+1}</h3><div style="padding:16px;background:#f3f5f7;border-radius:8px;white-space:pre-wrap">${escapeHtml(p)}</div>`).join('');
 const blueprintHtml=blueprint.map(([key,value])=>`<tr><th align="left" style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(key.replace(/([A-Z])/g,' $1'))}</th><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join('');
 const separateOptIn=data.marketingConsent?'':`<p style="margin-top:28px">Getting this assessment did not sign you up for marketing. If you want YourOS articles and practical AI tips later, <a href="https://www.youros.app/contact/?source=assessment-email-opt-in">you can sign up separately here</a>.</p>`;
 const html=`<!doctype html><html><body style="font-family:Arial,sans-serif;color:#202126;line-height:1.5;max-width:720px;margin:auto;padding:24px"><p style="color:#f97316;font-weight:bold">YOUR AI OPPORTUNITY ASSESSMENT</p><h1>Hi ${escapeHtml(data.name)}, here is your full assessment.</h1>${htmlRows}<h2 style="margin-top:32px">Three ready-to-use prompts</h2>${promptHtml}<h2 style="margin-top:32px">Full AI Employee Blueprint</h2><table style="border-collapse:collapse;width:100%">${blueprintHtml}</table>${separateOptIn}<hr style="margin-top:32px"><p style="font-size:13px;color:#68707c">YourOS stored your answers and contact details to deliver this assessment. <a href="https://www.youros.app/privacy-policy">Privacy Policy</a> · <a href="https://www.youros.app/contact/">Contact YourOS</a></p></body></html>`;
 const text=[`Hi ${data.name}, here is your full AI Opportunity Assessment.`,'',...rows(r).flatMap(([k,v])=>[`${k}: ${v}`,'']),'THREE READY-TO-USE PROMPTS','',...prompts.flatMap((p,i)=>[`Prompt ${i+1}`,p,'']),'FULL AI EMPLOYEE BLUEPRINT','',...blueprint.map(([k,v])=>`${k}: ${v}`),data.marketingConsent?'':'','Getting this assessment did not sign you up for marketing. You can sign up separately at https://www.youros.app/contact/?source=assessment-email-opt-in','','Privacy: https://www.youros.app/privacy-policy'].join('\n');
 return{html,text};
}
async function storeLead(data,requestUrl){
 const captureUrl=process.env.QUIZ_LEAD_CAPTURE_URL||requestUrl||process.env.DEPLOY_PRIME_URL||process.env.URL;
 if(!captureUrl)return{stored:false,reason:'No lead capture URL configured'};
 const body=new URLSearchParams({'form-name':'ai-employee-assessment',name:data.name,email:data.email,marketing_consent:String(data.marketingConsent),submission_id:data.submissionId,quiz_answers:JSON.stringify(data.answers),quiz_result:JSON.stringify(data.result),source:'ai-opportunity-assessment'});
 const response=await fetch(new URL('/ai-employee-quiz/',captureUrl),{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});
 return{stored:response.ok,reason:response.ok?'':`Lead capture returned ${response.status}`};
}
async function sendEmail(data){
 const apiKey=process.env.RESEND_API_KEY,from=process.env.ASSESSMENT_FROM_EMAIL;
 if(!apiKey||!from)return{sent:false,reason:'Transactional email is not configured'};
 const document=emailDocument(data);
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':data.submissionId},body:JSON.stringify({from,to:[data.email],reply_to:process.env.ASSESSMENT_REPLY_TO||undefined,subject:'Your AI Opportunity Assessment and Blueprint',html:document.html,text:document.text})});
 return{sent:response.ok,reason:response.ok?'':`Email provider returned ${response.status}`};
}
exports.handler=async event=>{
 if(event.httpMethod!=='POST')return{statusCode:405,headers,body:JSON.stringify({error:'Method not allowed'})};
 if((event.body||'').length>MAX_BODY)return{statusCode:413,headers,body:JSON.stringify({error:'Request too large'})};
 let data;try{data=validate(JSON.parse(event.body||'{}'))}catch(error){return{statusCode:400,headers,body:JSON.stringify({error:error.message})}}
 const seen=recent.get(data.submissionId);if(seen&&Date.now()-seen.at<10*60*1000)return{statusCode:200,headers,body:JSON.stringify({...seen.response,duplicate:true})};recent.set(data.submissionId,{at:Date.now(),response:{accepted:true,stored:false,emailSent:false,emailStatus:'processing'}});
 try{
  const requestOrigin=event.rawUrl?new URL(event.rawUrl).origin:'';
  const stored=await storeLead(data,requestOrigin);
  if(!stored.stored){recent.delete(data.submissionId);return{statusCode:502,headers,body:JSON.stringify({error:'Assessment could not be recorded',detail:stored.reason})}}
  const email=await sendEmail(data);
  const response={accepted:true,stored:true,emailSent:email.sent,emailStatus:email.sent?'sent':'unavailable'};recent.set(data.submissionId,{at:Date.now(),response});
  return{statusCode:200,headers,body:JSON.stringify(response)};
 }catch(error){recent.delete(data.submissionId);return{statusCode:502,headers,body:JSON.stringify({error:'Assessment delivery is temporarily unavailable'})}}
};
exports._internals={validate,emailDocument,storeLead};

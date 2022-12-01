class API{static Send(url){return new APIRequest(url);}}
class APIRequest{XHR=null;constructor(url,success,error){this.Url=url;this.Headers={};this.Body={};this.Method="GET";this.fnOnProgress=()=>{};this.fnOnSuccess=()=>{};this.fnOnError=()=>{};}
WithMethod(method){this.Method=method;return this;}
WithHeader(header,value){this.Headers[header.toLowerCase()]=value;return this;}
WithParam(name,value){this.Body[name]=value;return this;}
WithBody(body){this.Body=body;return this;}
AsQueryString(){delete this.Headers["content-type"];return this;}
AsFormBody(){this.Headers["content-type"]="application/x-www-form-urlencoded";return this;}
AsJson(){this.Headers["content-type"]="application/json";return this;}
OnProgress(fn){this.fnOnProgress=fn;return this;}
OnSuccess(fn){this.fnOnSuccess=fn;return this;}
OnError(fn){this.fnOnError=fn;return this;}
Abort(){if(this.XHR){this.XHR.abort();this.XHR=null;}}
Send(){let options={};let contentType=this.Headers["content-type"];switch(contentType){case "application/x-www-form-urlencoded":let form=new FormData();for(let key in this.Body){form.append(key,this.Body[key]);}
options.body=form;break;case "application/json":options.body=JSON.stringify(this.Body);break;default:let searchParams=new URLSearchParams(this.Body);let sQuery=searchParams.toString();if(sQuery.length>0){let sGlue="";if(this.Url.includes("?")){sGlue="&";}else{sGlue="?";}
this.Url+=`${sGlue}${sQuery}`;}
break;}
options.method=this.Method;options.headers=this.Headers;const xhr=new XMLHttpRequest();this.XHR=xhr;xhr.onload=()=>{let resp=new APIResponse();resp.Status=xhr.status;resp.Url=xhr.responseURL;resp.Body=xhr.response;this.fnOnSuccess(resp);}
xhr.open(options.method,this.Url);xhr.send(options.body);return this;}}
class APIResponse{Status=0;Url="";Body="";toJSON(){return JSON.parse(this.Body);}}
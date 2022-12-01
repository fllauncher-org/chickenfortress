class AjaxDocLoad{static LastURl=null;static Enabled=false;static Selector="";static CacheLifetime=0;static DocCache={};static fnPreCallbacks=[];static fnCallbacks=[];static fnPostCallbacks=[];static get Element(){if(!this.Enabled)return null;return document.querySelector(this.Selector);}
static Register(selector,cache=30){this.Enabled=true;this.Selector=selector;this.RegisterTime=Date.now();this.CacheLifetime=cache*1000;this.LastURl=location.href;this.HookLinks(document);this.HookPopState();this.execCallbacks(this.fnCallbacks);}
static Cache(requrl,resurl,title,html){let cache=new AjaxDocLoadResponse();cache.RequestUrl=requrl;cache.ResponseUrl=resurl;cache.Document=html;cache.Title=title;cache.Created=Date.now();this.DocCache[requrl]=cache;return cache;}
static IsCached(url){if(!this.DocCache[url])return false;return(Date.now()-this.DocCache[url].Created)<this.CacheLifetime;}
static GetFromCache(url){if(!this.IsCached(url))return null;return this.DocCache[url];}
static Redirect(url,push=true){console.trace();if(this.LastURl==url)return;if(!this.Enabled)return;this.Element.classList.add("loading");var cache=this.GetFromCache(url);if(cache){setTimeout(()=>{this.ApplyAjaxResponse(cache,push);},50);}else{API.Send(url).OnSuccess(r=>{let html=r.Body;let resurl=r.Url;let parser=new DOMParser();let doc=parser.parseFromString(html,"text/html");let cache=this.Cache(url,resurl,doc.title,doc);this.ApplyAjaxResponse(cache,push);}).Send();}}
static ApplyAjaxResponse(res,push=true){this.execCallbacks(this.fnPreCallbacks);let sTitle=res.Document.title;if(document.location.href==res.ResponseUrl)push=false;if(push){window.history.pushState({},"",res.ResponseUrl);}
document.title=sTitle;let el=res.Document.querySelector(this.Selector);if(el){this.ReplacePageContent(el.innerHTML);this.HookLinks(this.Element);}
this.execCallbacks(this.fnCallbacks);this.LastURl=res.ResponseUrl;window.scrollTo(0,0);setTimeout(()=>{this.Element.classList.remove("loading");this.execCallbacks(this.fnPostCallbacks);},100);}
static execCallbacks(arr){for(let fn of arr)
fn();}
static ReplacePageContent(html){if(!this.Enabled)return;this.Element.innerHTML=html;for(let oldScript of this.Element.querySelectorAll("script")){let newScript=document.createElement("script");for(let attr of oldScript.attributes){newScript.setAttribute(attr.name,attr.value);}
newScript.appendChild(document.createTextNode(oldScript.innerHTML));oldScript.parentNode.replaceChild(newScript,oldScript);}}
static HookLinks(parent){let Links=parent.querySelectorAll("a");for(let Link of Links){Link.addEventListener("click",(e)=>{let link=null;for(let el of e.path){if(el.tagName=="A"){link=el;break;}}
if(link==null)return;let bUseAjax=true;let bMoveToLink=false;let bPreventDefault=true;if(link.origin!=location.origin){bUseAjax=false;bPreventDefault=false;}
if(link.pathname==location.pathname){bUseAjax=false;if(link.hash!=location.hash){bMoveToLink=true;}}
if(bMoveToLink){let anchor=document.querySelector(link.hash);if(anchor){anchor.scrollIntoView();}
window.history.pushState({},"",link.origin+link.pathname+link.hash);}
if(bUseAjax){AjaxDocLoad.Redirect(link.href);}
if(bPreventDefault){e.preventDefault();}});}}
static HookPopState(){window.onpopstate=(e)=>{console.log(e);this.Redirect(location.href,false);}}
static onchange(fn){this.fnCallbacks.push(fn);}
static onprechange(fn){this.fnPreCallbacks.push(fn);}
static onpostchange(fn){this.fnPostCallbacks.push(fn);}}
class AjaxDocLoadResponse{}
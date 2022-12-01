class PopupPreview{Popup=null;PreviewContainer=null;CaptionContainer=null;Element=null;constructor(options={})
{this.Popup=document.querySelector(options.popup);if(!this.Popup)return;this.PreviewContainer=this.Popup.querySelector(options.container);if(!this.PreviewContainer)return;this.Popup.addEventListener("click",(e)=>{if(e.target==this.Target)return;this.Close();});document.body.addEventListener("click",(e)=>{let target=e.target;if(["IMG","VIDEO"].includes(target.tagName))
{if(e.path.filter(r=>r.classList&&r.classList.contains("popuppreview")).length<=0)return;e.preventDefault();this.Preview(e.target);}});document.body.addEventListener("keyup",(e)=>{if(!["ArrowRight","ArrowLeft"].includes(e.key))return;if(!this.Element)return;let els=document.querySelectorAll(`.popuppreview ${this.Element.tagName}`);els=[...els];let dir=(e.key=="ArrowRight")?1:-1;let index=els.indexOf(this.Element);let newindex=(index+dir)%els.length;if(newindex<0)newindex+=els.length;let newel=els[newindex];this.Close();this.Preview(newel);});this.CaptionContainer=this.Popup.querySelector(options.caption);}
Preview(el)
{this.Element=el;this.Popup.classList.add("active");this.PreviewContainer.innerHTML=el.outerHTML;this.Target=this.PreviewContainer.querySelector("*");if(this.Target)
{if(this.Target.tagName=="VIDEO")
{this.Target.removeAttribute("loop");this.Target.removeAttribute("muted");this.Target.setAttribute("controls","");this.Target.setAttribute("autoplay","");}
if(this.Target.hasAttribute("data-caption"))
{this.CaptionContainer.style.display="block";this.CaptionContainer.innerText=this.Target.getAttribute("data-caption");}else{this.CaptionContainer.style.display="none";}}}
Close()
{this.Element=null;this.Popup.classList.remove("active");this.PreviewContainer.innerHTML="";this.CaptionContainer.style.display="none";}}
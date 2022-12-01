class Parallax
{Height=0;Element=null;Multiplier=1;constructor(options={})
{this.Element=document.querySelector(options.selector);if(!this.Element)return;this.Multiplier=options.multiplier||0.5;document.addEventListener("scroll",(e)=>{this.UpdateBackground();});}
UpdateBackground()
{let screenWidth=document.documentElement.scrollWidth;if(screenWidth<800)return;let scrollTop=document.documentElement.scrollTop;let scrollHeight=this.Element.scrollHeight;let offsetTop=this.Element.offsetTop;let max=offsetTop+scrollHeight;if(scrollTop>max)return;let offset=document.documentElement.scrollTop;this.Element.style.backgroundPositionY=`${offset*this.Multiplier}px`;}}
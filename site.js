document.getElementById("y").textContent=new Date().getFullYear();
const esc=t=>String(t||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// fill contact details from site-config.js
if(window.SITE){
  const S=SITE;
  document.querySelectorAll("[data-site]").forEach(e=>{
    const k=e.dataset.site;
    if(k==="hours")e.innerHTML=S.hours.map(esc).join("<br>");else e.textContent=S[k];
    if(k==="phone")e.href="tel:+1"+S.phone.replace(/\D/g,"");
    if(k==="email")e.href="mailto:"+S.email;
  });
  const f=document.querySelector("form");if(f)f.action="mailto:"+S.email;
}
// render project cards from projects-data.js
function card(p,label,done){
  const img=p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`:`<div class="pimg ph" style="position:absolute;inset:0"><img src="photos/logo.png" alt=""></div>`;
  return `<article class="pcard reveal"><div class="pimg">${img}<span class="badge${done?" done":""}">${label}</span></div>
    <div class="pbody"><span class="ploc">${esc(p.location)}</span><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div></article>`;
}
const fill=(id,list,label,done)=>{const el=document.getElementById(id);if(el)el.innerHTML=list.map(p=>card(p,label,done)).join("")};
if(window.PROJECTS){
  fill("current-projects",PROJECTS.current,"In progress",false);
  fill("completed-projects",PROJECTS.completed,"Completed",true);
}
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
// stagger siblings; reveal once (toggling on enter/leave made items flicker at the edge)
document.querySelectorAll(".grid,.proj-grid,.checks").forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=i*90+"ms"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.01,rootMargin:"0px 0px -6% 0px"});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
const raf=new WeakMap();
function count(el){
  const to=+el.dataset.count,suf=el.dataset.suffix||"";
  cancelAnimationFrame(raf.get(el));
  if(reduce){el.textContent=to+suf;return}
  const t0=performance.now(),d=1400;
  (function f(t){const p=Math.min((t-t0)/d,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)raf.set(el,requestAnimationFrame(f))})(t0);
}
// replay count-up each time the stats strip scrolls into view
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.querySelectorAll("[data-count]").forEach(count)}),{threshold:.5})
  .observe(document.querySelector(".stats")||document.body);

// hide the nav on scroll down, show on scroll up
{const h=document.querySelector("header");let last=scrollY;
addEventListener("scroll",()=>{const y=scrollY;if(Math.abs(y-last)<8)return;h.classList.toggle("hide",y>last&&y>120);last=y},{passive:true});}

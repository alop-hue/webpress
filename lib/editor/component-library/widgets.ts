/**
 * Component library — widgets: counters, progress, toasts, modals, countdown, typing, carousel.
 */
import type { LibraryComponent } from "./types";
import { c } from "./types";

export const WIDGETS: LibraryComponent[] = [
  c(
    "counter",
    "Counter — animated",
    "widgets",
    "Counts up to a target on scroll (js).",
    `<div class="wc-counter"><span class="wc-counter-val" data-target="12840" data-prefix="" data-suffix="">0</span><span class="wc-counter-lbl">Downloads</span></div>`,
    `.wc-counter{text-align:center;padding:20px}.wc-counter-val{display:block;font-size:44px;font-weight:800;letter-spacing:-.02em;color:#0f172a}.wc-counter-lbl{display:block;margin-top:6px;font-size:13px;color:#64748b}`,
    `const els=document.querySelectorAll(".wc-counter-val");const io=new IntersectionObserver((es)=>es.forEach((e)=>{if(!e.isIntersecting)return;io.unobserve(e.target);const t=+e.target.dataset.target||0;const p=e.target.dataset.prefix||"";const s=e.target.dataset.suffix||"";const dur=1400;const st=performance.now();const step=(now)=>{const k=Math.min(1,(now-st)/dur);e.target.textContent=p+Math.round(t*(1-Math.pow(1-k,3))).toLocaleString()+s;if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);}),{threshold:.4});els.forEach((el)=>io.observe(el));`
  ),
  c(
    "progress-bar",
    "Progress — bar",
    "widgets",
    "Animated determinate bar (js).",
    `<div class="wc-pbar"><div class="wc-pbar-track"><div class="wc-pbar-fill" data-val="72"></div></div><span class="wc-pbar-lbl">72% complete</span></div>`,
    `.wc-pbar{max-width:420px;display:grid;gap:8px}.wc-pbar-track{height:10px;border-radius:999px;background:#e2e8f0;overflow:hidden}.wc-pbar-fill{height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width 1.2s cubic-bezier(.2,.8,.2,1)}.wc-pbar-lbl{font-size:12.5px;font-weight:700;color:#64748b}`,
    `const io=new IntersectionObserver((es)=>es.forEach((e)=>{if(!e.isIntersecting)return;io.unobserve(e.target);const f=e.target.querySelector(".wc-pbar-fill");const v=f.dataset.val||"0";f.style.width=v+"%";const l=e.target.querySelector(".wc-pbar-lbl");l.textContent=v+"% complete";}),{threshold:.4});document.querySelectorAll(".wc-pbar").forEach((el)=>io.observe(el));`
  ),
  c(
    "progress-circle",
    "Progress — circle",
    "widgets",
    "SVG ring with animated fill (js).",
    `<div class="wc-pcircle"><svg viewBox="0 0 120 120"><circle class="wc-pcircle-bg" cx="60" cy="60" r="52"/><circle class="wc-pcircle-fg" cx="60" cy="60" r="52" data-val="64"/></svg><span class="wc-pcircle-lbl">64%</span></div>`,
    `.wc-pcircle{position:relative;width:130px;height:130px}.wc-pcircle svg{width:100%;height:100%;transform:rotate(-90deg)}.wc-pcircle-bg{fill:none;stroke:#e2e8f0;stroke-width:10}.wc-pcircle-fg{fill:none;stroke:#6366f1;stroke-width:10;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:326.7;transition:stroke-dashoffset 1.2s ease}.wc-pcircle-lbl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#0f172a}`,
    `const io=new IntersectionObserver((es)=>es.forEach((e)=>{if(!e.isIntersecting)return;io.unobserve(e.target);const f=e.target.querySelector(".wc-pcircle-fg");const v=+f.dataset.val||0;f.style.strokeDashoffset=String(326.7*(1-v/100));}),{threshold:.4});document.querySelectorAll(".wc-pcircle").forEach((el)=>io.observe(el));`
  ),
  c(
    "toast-stack",
    "Toast — stack",
    "widgets",
    "Notification toasts with close (js).",
    `<div class="wc-toasts"><div class="wc-toast ok"><b>✓ Saved</b><p>Your changes are on the server.</p><button aria-label="Dismiss">×</button></div><div class="wc-toast info"><b>ℹ New feature</b><p>Component library is live.</p><button aria-label="Dismiss">×</button></div></div>`,
    `.wc-toasts{display:grid;gap:10px;max-width:340px}.wc-toast{display:grid;grid-template-columns:1fr auto;gap:2px 12px;padding:13px 14px;border-radius:13px;background:#fff;border:1px solid #e2e8f0;box-shadow:0 12px 30px rgba(15,23,42,.1);animation:wc-in .25s ease}.wc-toast b{font-size:13.5px;color:#0f172a}.wc-toast p{margin:0;font-size:12.5px;color:#64748b}.wc-toast button{border:0;background:none;color:#94a3b8;font-size:16px;cursor:pointer;grid-row:1;grid-column:2}.wc-toast.ok{border-left:3px solid #16a34a}.wc-toast.info{border-left:3px solid #6366f1}@keyframes wc-in{from{opacity:0;transform:translateY(6px)}to{opacity:1}}`,
    `document.querySelectorAll(".wc-toast button").forEach((b)=>b.addEventListener("click",()=>b.closest(".wc-toast").remove()));`
  ),
  c(
    "tooltip",
    "Tooltip",
    "widgets",
    "Hover tooltip on an element (css).",
    `<span class="wc-tip">Hover me<span class="wc-tip-bubble" role="tooltip">This is a tooltip — pure CSS, no JS.</span></span>`,
    `.wc-tip{position:relative;display:inline-block;padding:9px 14px;border:1px solid #e2e8f0;border-radius:9px;background:#fff;font-size:13.5px;font-weight:600;color:#334155;cursor:default}.wc-tip-bubble{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(4px);padding:8px 12px;border-radius:9px;background:#0f172a;color:#fff;font-size:12px;font-weight:500;white-space:nowrap;opacity:0;pointer-events:none;transition:all .18s;z-index:10}.wc-tip-bubble::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#0f172a}.wc-tip:hover .wc-tip-bubble{opacity:1;transform:translateX(-50%) translateY(0)}`,
    ``
  ),
  c(
    "modal-dialog",
    "Modal — dialog",
    "widgets",
    "Centered modal with backdrop (js).",
    `<div class="wc-modal"><div class="wc-modal-card"><div class="wc-modal-head"><h3>Delete project?</h3><button class="wc-modal-x" aria-label="Close">×</button></div><p>This permanently removes the project and its deployment. This action cannot be undone.</p><div class="wc-modal-actions"><button class="wc-modal-ghost">Cancel</button><button class="wc-modal-danger">Delete</button></div></div></div>`,
    `.wc-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.5);backdrop-filter:blur(3px);z-index:60;padding:20px;animation:wc-fadein .2s ease}.wc-modal-card{width:100%;max-width:420px;background:#fff;border-radius:18px;box-shadow:0 30px 80px rgba(15,23,42,.3);animation:wc-pop .22s cubic-bezier(.2,.9,.3,1.2)}.wc-modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 0}.wc-modal-head h3{margin:0;font-size:17px;font-weight:800;color:#0f172a}.wc-modal-x{border:0;background:none;font-size:20px;color:#94a3b8;cursor:pointer;padding:2px 6px;border-radius:6px}.wc-modal-x:hover{background:#f1f5f9;color:#0f172a}.wc-modal-card>p{padding:8px 20px 0;margin:0;font-size:13.5px;line-height:1.6;color:#64748b}.wc-modal-actions{display:flex;justify-content:flex-end;gap:10px;padding:18px 20px}.wc-modal-ghost{padding:10px 16px;border:1px solid #e2e8f0;border-radius:9px;background:#fff;font-weight:700;font-size:13.5px;color:#334155;cursor:pointer}.wc-modal-danger{padding:10px 16px;border:0;border-radius:9px;background:#dc2626;color:#fff;font-weight:700;font-size:13.5px;cursor:pointer}.wc-modal-danger:hover{background:#b91c1c}@keyframes wc-fadein{from{opacity:0}}@keyframes wc-pop{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1}}`,
    `document.querySelectorAll(".wc-modal-x,.wc-modal-ghost").forEach((b)=>b.addEventListener("click",()=>b.closest(".wc-modal").remove()));`
  ),
  c(
    "countdown",
    "Countdown — timer",
    "widgets",
    "Live countdown to a target (js).",
    `<div class="wc-count" data-target="+2d"><div class="wc-count-unit"><b class="wc-count-d">00</b><span>days</span></div><i>:</i><div class="wc-count-unit"><b class="wc-count-h">00</b><span>hrs</span></div><i>:</i><div class="wc-count-unit"><b class="wc-count-m">00</b><span>min</span></div><i>:</i><div class="wc-count-unit"><b class="wc-count-s">00</b><span>sec</span></div></div>`,
    `.wc-count{display:flex;align-items:center;gap:8px;justify-content:center;padding:26px;border:1px solid #e2e8f0;border-radius:18px;background:#fff}.wc-count-unit{display:grid;gap:2px;text-align:center}.wc-count-unit b{font-size:34px;font-weight:800;letter-spacing:-.02em;color:#0f172a;font-variant-numeric:tabular-nums}.wc-count-unit span{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8}.wc-count>i{font-style:normal;font-size:28px;color:#cbd5e1;font-weight:300}`,
    `document.querySelectorAll(".wc-count").forEach((el)=>{const pad=(n)=>String(n).padStart(2,"0");let target=Date.now()+2*24*3600e3;const raw=el.dataset.target;if(/^\\+\\d+[dmh]/.test(raw||"")){const n=+raw.slice(1,-1);const u=raw.slice(-1);target=Date.now()+(u==="d"?n*24:u==="h"?n:u==="m"?n/60:u==="s"?n/3600)*3600e3;}const d=el.querySelector(".wc-count-d"),h=el.querySelector(".wc-count-h"),m=el.querySelector(".wc-count-m"),s=el.querySelector(".wc-count-s");const tick=()=>{let diff=Math.max(0,Math.floor((target-Date.now())/1000));d.textContent=pad(Math.floor(diff/86400));h.textContent=pad(Math.floor(diff/3600)%24);m.textContent=pad(Math.floor(diff/60)%60);s.textContent=pad(diff%60);};tick();setInterval(tick,1000);});`
  ),
  c(
    "typing-effect",
    "Typing — effect",
    "widgets",
    "Rotating typed words (js).",
    `<p class="wc-type">We build <span class="wc-type-word" data-words='["websites","landing pages","portfolios","web apps"]'>websites</span><span class="wc-type-caret"></span></p>`,
    `.wc-type{font-size:26px;font-weight:700;color:#0f172a;display:inline-flex;align-items:center;gap:2px;padding:20px 8px}.wc-type-word{color:#4f46e5}.wc-type-caret{display:inline-block;width:3px;height:1.1em;background:#6366f1;margin-left:3px;animation:wc-blink .8s steps(1) infinite}@keyframes wc-blink{50%{opacity:0}}@media (prefers-reduced-motion:reduce){.wc-type-caret{animation:none}}`,
    `document.querySelectorAll(".wc-type-word").forEach((el)=>{const words=JSON.parse(el.dataset.words||"[]");if(!words.length)return;let wi=0,ci=0,del=false;const tick=()=>{const w=words[wi];el.textContent=w.slice(0,ci);if(!del&&ci<w.length){ci++;setTimeout(tick,90);}else if(!del){del=true;setTimeout(tick,1600);}else if(ci>0){ci--;setTimeout(tick,38);}else{del=false;wi=(wi+1)%words.length;setTimeout(tick,300);}};tick();});`
  ),
  c(
    "reveal-scroll",
    "Reveal — on scroll",
    "widgets",
    "Fades content in as it scrolls into view (js).",
    `<div class="wc-reveal"><h3>Scroll to reveal</h3><p>Items fade and slide up as they enter the viewport — respects reduced motion.</p></div>`,
    `.wc-reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;padding:30px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;max-width:420px}.wc-reveal.show{opacity:1;transform:none}.wc-reveal h3{margin:0 0 8px;font-size:19px;font-weight:800;color:#0f172a}.wc-reveal p{margin:0;font-size:14px;line-height:1.6;color:#64748b}@media (prefers-reduced-motion:reduce){.wc-reveal{transition:none;opacity:1;transform:none}}`,
    `const io=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target);}}),{threshold:.2});document.querySelectorAll(".wc-reveal").forEach((el)=>io.observe(el));`
  ),
  c(
    "live-clock",
    "Clock — live",
    "widgets",
    "Live date/time display (js).",
    `<div class="wc-clock"><span class="wc-clock-t">--:--:--</span><span class="wc-clock-d">—</span></div>`,
    `.wc-clock{display:grid;gap:2px;text-align:center;padding:26px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;max-width:260px}.wc-clock-t{font-size:38px;font-weight:800;letter-spacing:.02em;color:#0f172a;font-variant-numeric:tabular-nums}.wc-clock-d{font-size:12.5px;color:#64748b}`,
    `document.querySelectorAll(".wc-clock").forEach((el)=>{const t=el.querySelector(".wc-clock-t");const d=el.querySelector(".wc-clock-d");const pad=(n)=>String(n).padStart(2,"0");const tick=()=>{const now=new Date();t.textContent=[pad(now.getHours()),pad(now.getMinutes()),pad(now.getSeconds())].join(":");d.textContent=now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});};tick();setInterval(tick,1000);});`
  ),
  c(
    "notification-badge",
    "Badge — notifications",
    "widgets",
    "Bell icon with count bubble.",
    `<span class="wc-nbell"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><i>3</i></span>`,
    `.wc-nbell{position:relative;display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#334155;cursor:pointer;transition:all .15s}.wc-nbell:hover{border-color:#c7d2fe;color:#4f46e5}.wc-nbell i{position:absolute;top:-5px;right:-5px;min-width:19px;height:19px;padding:0 5px;border-radius:999px;background:#ef4444;color:#fff;font-size:11px;font-weight:800;font-style:normal;display:flex;align-items:center;justify-content:center;border:2px solid #fff}`,
    ``
  ),
  c(
    "cookie-banner",
    "Cookie — banner",
    "widgets",
    "Consent bar with accept/dismiss (js).",
    `<div class="wc-cookie"><p>We use cookies to improve your experience. Read our <a href="#">privacy policy</a>.</p><div><button class="wc-cookie-ok">Accept all</button><button class="wc-cookie-x">Decline</button></div></div>`,
    `.wc-cookie{position:fixed;left:16px;right:16px;bottom:16px;margin:0 auto;max-width:720px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;padding:16px 20px;border-radius:16px;background:#0f172a;color:#e2e8f0;box-shadow:0 20px 50px rgba(15,23,42,.35);z-index:50;animation:wc-up .3s ease}.wc-cookie p{margin:0;font-size:13px;line-height:1.5}.wc-cookie a{color:#a5b4fc}.wc-cookie>div{display:flex;gap:8px}.wc-cookie-ok{padding:9px 16px;border:0;border-radius:9px;background:#6366f1;color:#fff;font-weight:700;font-size:12.5px;cursor:pointer}.wc-cookie-x{padding:9px 14px;border:1px solid #334155;border-radius:9px;background:transparent;color:#cbd5e1;font-size:12.5px;cursor:pointer}@keyframes wc-up{from{opacity:0;transform:translateY(14px)}}`,
    `document.querySelectorAll(".wc-cookie").forEach((b)=>{b.querySelectorAll("button").forEach((btn)=>btn.addEventListener("click",()=>b.remove()));});`
  ),
  c(
    "carousel",
    "Carousel — slides",
    "widgets",
    "Simple auto-advancing slides (js).",
    `<div class="wc-car"><div class="wc-car-track"><div class="wc-car-slide active"><h3>Slide 1</h3><p>First message in the carousel.</p></div><div class="wc-car-slide"><h3>Slide 2</h3><p>Second message here.</p></div><div class="wc-car-slide"><h3>Slide 3</h3><p>Third and final slide.</p></div></div><div class="wc-car-dots"><i class="active"></i><i></i><i></i></div></div>`,
    `.wc-car{max-width:520px;overflow:hidden;border-radius:18px;border:1px solid #e2e8f0;background:#fff;position:relative}.wc-car-track{display:flex;transition:transform .45s cubic-bezier(.3,.8,.3,1)}.wc-car-slide{min-width:100%;padding:38px 30px;text-align:center}.wc-car-slide h3{margin:0 0 8px;font-size:21px;font-weight:800;color:#0f172a}.wc-car-slide p{margin:0;font-size:14px;color:#64748b}.wc-car-dots{display:flex;justify-content:center;gap:7px;padding:0 0 18px}.wc-car-dots i{width:8px;height:8px;border-radius:50%;background:#cbd5e1;cursor:pointer;transition:background .2s}.wc-car-dots i.active{background:#6366f1;width:22px;border-radius:99px}`,
    `document.querySelectorAll(".wc-car").forEach((el)=>{const track=el.querySelector(".wc-car-track");const slides=track.children.length;const dots=[...el.querySelectorAll(".wc-car-dots i")];let cur=0;const go=(i)=>{cur=(i+slides)%slides;track.style.transform="translateX(-"+(cur*100)+"%)";dots.forEach((d,x)=>d.classList.toggle("active",x===cur));};dots.forEach((d,i)=>d.addEventListener("click",()=>go(i)));setInterval(()=>go(cur+1),4000);});`
  ),
  c(
    "code-block",
    "Code — block",
    "widgets",
    "Terminal-style code card with copy (js).",
    `<div class="wc-code"><div class="wc-code-bar"><span>npm create webpress</span><button class="wc-code-copy" aria-label="Copy">Copy</button></div><pre><code>$ npm create webpress@latest\n✔ What to build? › a landing page\n✔ Template · hero + pricing + footer\n✔ Done! Run <b>npm run dev</b> to start</code></pre></div>`,
    `.wc-code{max-width:520px;border-radius:14px;overflow:hidden;background:#0f172a;color:#e2e8f0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7}.wc-code-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#1e293b;border-bottom:1px solid #334155}.wc-code-bar span{font-size:11px;color:#94a3b8}.wc-code-copy{padding:5px 10px;border:1px solid #334155;border-radius:7px;background:transparent;color:#cbd5e1;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s}.wc-code-copy:hover{border-color:#6366f1;color:#a5b4fc}.wc-code pre{margin:0;padding:16px;overflow-x:auto;white-space:pre}.wc-code b{color:#a5b4fc;font-weight:600}`,
    `document.querySelectorAll(".wc-code-copy").forEach((b)=>b.addEventListener("click",async()=>{const code=b.closest(".wc-code").querySelector("code").innerText;try{await navigator.clipboard.writeText(code);}catch{}const t=b.textContent;b.textContent="Copied ✓";setTimeout(()=>b.textContent=t,1500);}));`
  ),
  c(
    "scroll-progress",
    "Scroll — progress bar",
    "widgets",
    "Top reading-progress bar (js).",
    `<div class="wc-scrollbar"><div class="wc-scrollbar-fill"></div></div>`,
    `.wc-scrollbar{position:fixed;top:0;left:0;right:0;height:3px;background:transparent;z-index:80}.wc-scrollbar-fill{height:100%;width:0;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width .1s linear}`,
    `const onScroll=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;const p=max>0?h.scrollTop/max*100:0;document.querySelectorAll(".wc-scrollbar-fill").forEach((f)=>f.style.width=p+"%");};window.addEventListener("scroll",onScroll,{passive:true});onScroll();`
  ),
  c(
    "skeleton-loaders",
    "Skeleton — loaders",
    "widgets",
    "Animated loading placeholders.",
    `<div class="wc-skel"><div class="wc-skel-img"></div><div class="wc-skel-lines"><span style="width:80%"></span><span style="width:55%"></span><span style="width:70%"></span></div></div>`,
    `.wc-skel{display:flex;gap:14px;max-width:400px;padding:18px;border:1px solid #e2e8f0;border-radius:16px;background:#fff}.wc-skel-img{width:72px;height:72px;border-radius:12px;background:#e2e8f0;animation:wc-shine 1.4s ease infinite}.wc-skel-lines{flex:1;display:grid;gap:10px;align-content:center}.wc-skel-lines span{height:11px;border-radius:6px;background:#e2e8f0;animation:wc-shine 1.4s ease infinite}@keyframes wc-shine{0%{opacity:1}50%{opacity:.55}100%{opacity:1}}@media (prefers-reduced-motion:reduce){.wc-skel-img,.wc-skel-lines span{animation:none}}`,
    ``
  ),
  c(
    "flip-card",
    "Flip — card",
    "widgets",
    "3D flip on hover (css).",
    `<div class="wc-flip"><div class="wc-flip-inner"><div class="wc-flip-front"><h3>Hover me</h3><p>Front side</p></div><div class="wc-flip-back"><h3>Surprise!</h3><p>Back side revealed</p></div></div></div>`,
    `.wc-flip{perspective:900px;width:260px;height:170px}.wc-flip-inner{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.4,.1,.2,1);transform-style:preserve-3d}.wc-flip:hover .wc-flip-inner{transform:rotateY(180deg)}.wc-flip-front,.wc-flip-back{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-radius:18px;backface-visibility:hidden}.wc-flip-front{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff}.wc-flip-back{background:#0f172a;color:#fff;transform:rotateY(180deg)}.wc-flip h3{margin:0;font-size:18px;font-weight:800}.wc-flip p{margin:0;font-size:13px;opacity:.85}@media (prefers-reduced-motion:reduce){.wc-flip-inner{transition:none}.wc-flip:hover .wc-flip-inner{transform:none}}`,
    ``
  ),
  c(
    "parallax-hero",
    "Hero — parallax",
    "widgets",
    "Background shifts on scroll (js).",
    `<div class="wc-parallax"><div class="wc-parallax-bg" style="background-image:linear-gradient(rgba(15,23,42,.45),rgba(15,23,42,.45)),url(https://picsum.photos/1400/700)"></div><div class="wc-parallax-content"><h2>Make an entrance</h2><p>A parallax hero that responds to scrolling.</p><a href="#">Explore</a></div></div>`,
    `.wc-parallax{position:relative;height:420px;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:20px}.wc-parallax-bg{position:absolute;inset:-20% 0;background-size:cover;background-position:center;will-change:transform}.wc-parallax-content{position:relative;color:#fff;padding:24px}.wc-parallax h2{margin:0 0 10px;font-size:38px;font-weight:800;letter-spacing:-.02em;text-shadow:0 4px 24px rgba(0,0,0,.35)}.wc-parallax p{margin:0 0 22px;font-size:16px;opacity:.9}.wc-parallax a{padding:12px 22px;border-radius:11px;background:#fff;color:#0f172a;font-weight:800;font-size:14px;text-decoration:none}@media (prefers-reduced-motion:reduce){.wc-parallax-bg{position:absolute;inset:0}}`,
    `const els=document.querySelectorAll(".wc-parallax");const mq=window.matchMedia("(prefers-reduced-motion: reduce)");const onScroll=()=>{els.forEach((el)=>{const r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){const p=(innerHeight/2-(r.top+r.height/2))/innerHeight;el.querySelector(".wc-parallax-bg").style.transform="translateY("+(p*14)+"%)";}});};if(mq.matches){els.forEach((el)=>(el.querySelector(".wc-parallax-bg").style.transform="none"));}else{window.addEventListener("scroll",onScroll,{passive:true});onScroll();}`
  ),
];

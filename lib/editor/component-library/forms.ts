/**
 * Component library — forms: contact, newsletter, login, search, rating, steppers, upload.
 */
import type { LibraryComponent } from "./types";
import { c } from "./types";

export const FORMS: LibraryComponent[] = [
  c(
    "form-contact",
    "Form — contact",
    "forms",
    "Full contact form with labels (js submit).",
    `<form class="wc-fc">
  <div class="wc-fc-row"><label>Name<input type="text" placeholder="Jane Doe" required /></label><label>Email<input type="email" placeholder="jane@site.com" required /></label></div>
  <label>Subject<input type="text" placeholder="How can we help?" /></label>
  <label>Message<textarea rows="4" placeholder="Tell us more…" required></textarea></label>
  <button type="submit">Send message</button>
</form>`,
    `.wc-fc{display:grid;gap:14px;max-width:560px}.wc-fc-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:560px){.wc-fc-row{grid-template-columns:1fr}}.wc-fc label{display:grid;gap:6px;font-size:13px;font-weight:700;color:#334155}.wc-fc input,.wc-fc textarea{padding:11px 13px;border:1px solid #e2e8f0;border-radius:11px;font-size:14px;font-family:inherit;resize:vertical}.wc-fc input:focus,.wc-fc textarea:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-fc button{padding:13px;border:0;border-radius:11px;background:#0f172a;color:#fff;font-weight:700;font-size:14.5px;cursor:pointer;transition:background .15s}.wc-fc button:hover{background:#4f46e5}`,
    `document.querySelectorAll(".wc-fc").forEach((f)=>f.addEventListener("submit",(e)=>{e.preventDefault();const b=f.querySelector("button");const t=b.textContent;b.textContent="Message sent ✓";setTimeout(()=>{b.textContent=t;f.reset();},2000);}));`
  ),
  c(
    "form-newsletter",
    "Form — newsletter",
    "forms",
    "Compact email capture.",
    `<form class="wc-fnl"><input type="email" required placeholder="Enter your email" /><button type="submit">Subscribe</button></form>`,
    `.wc-fnl{display:flex;gap:10px;max-width:420px}.wc-fnl input{flex:1;padding:12px 14px;border:1px solid #e2e8f0;border-radius:11px;font-size:14px}.wc-fnl input:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-fnl button{padding:12px 20px;border:0;border-radius:11px;background:#6366f1;color:#fff;font-weight:700;font-size:14px;cursor:pointer;transition:background .15s}.wc-fnl button:hover{background:#4f46e5}`,
    `document.querySelectorAll(".wc-fnl").forEach((f)=>f.addEventListener("submit",(e)=>{e.preventDefault();const b=f.querySelector("button");b.textContent="Subscribed ✓";b.style.background="#16a34a";f.querySelector("input").value="";setTimeout(()=>{b.textContent="Subscribe";b.style.background="";},2000);}));`
  ),
  c(
    "form-login",
    "Form — login card",
    "forms",
    "Auth card with social buttons.",
    `<div class="wc-flc">
  <h3>Welcome back</h3>
  <div class="wc-flc-social"><button>G · Google</button><button>⌘ · Apple</button></div>
  <div class="wc-flc-or"><span>or</span></div>
  <form class="wc-flc-form"><input type="email" placeholder="Email" required /><input type="password" placeholder="Password" required /><button type="submit">Sign in</button></form>
  <p class="wc-flc-alt">Don't have an account? <a href="#">Sign up</a></p>
</div>`,
    `.wc-flc{max-width:380px;margin:0 auto;padding:32px;border:1px solid #e2e8f0;border-radius:20px;background:#fff;box-shadow:0 20px 50px rgba(15,23,42,.08)}.wc-flc h3{margin:0 0 20px;font-size:22px;font-weight:800;color:#0f172a;text-align:center}.wc-flc-social{display:grid;grid-template-columns:1fr 1fr;gap:10px}.wc-flc-social button{padding:11px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;font-size:13.5px;font-weight:600;color:#334155;cursor:pointer;transition:background .15s}.wc-flc-social button:hover{background:#f8fafc}.wc-flc-or{display:flex;align-items:center;gap:12px;margin:16px 0;color:#94a3b8;font-size:12px}.wc-flc-or::before,.wc-flc-or::after{content:"";flex:1;height:1px;background:#e2e8f0}.wc-flc-form{display:grid;gap:10px}.wc-flc-form input{padding:12px 13px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px}.wc-flc-form input:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-flc-form button{padding:12px;border:0;border-radius:10px;background:#0f172a;color:#fff;font-weight:700;font-size:14.5px;cursor:pointer}.wc-flc-form button:hover{background:#4f46e5}.wc-flc-alt{margin:16px 0 0;font-size:13px;color:#64748b;text-align:center}.wc-flc-alt a{color:#4f46e5;font-weight:700;text-decoration:none}`,
    ``
  ),
  c(
    "form-search",
    "Search — input",
    "forms",
    "Search field with icon and shortcut.",
    `<div class="wc-search"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search projects…" /><kbd>⌘K</kbd></div>`,
    `.wc-search{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;color:#94a3b8;max-width:360px;transition:border-color .15s,box-shadow .15s}.wc-search:focus-within{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-search input{flex:1;border:0;outline:0;font-size:14px;background:transparent;color:#0f172a}.wc-search kbd{font-size:11px;padding:3px 7px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;color:#94a3b8;font-family:inherit}`,
    ``
  ),
  c(
    "rating-stars",
    "Rating — stars",
    "forms",
    "Interactive 5-star rating (js).",
    `<div class="wc-rating"><button aria-label="1 star">★</button><button aria-label="2 stars">★</button><button aria-label="3 stars">★</button><button aria-label="4 stars">★</button><button aria-label="5 stars">★</button><span>0 / 5</span></div>`,
    `.wc-rating{display:flex;align-items:center;gap:4px}.wc-rating button{border:0;background:none;font-size:26px;color:#e2e8f0;cursor:pointer;transition:color .1s,transform .1s;padding:0}.wc-rating button:hover{transform:scale(1.15)}.wc-rating button.on{color:#f59e0b}.wc-rating span{margin-left:8px;font-size:13px;font-weight:700;color:#64748b}`,
    `document.querySelectorAll(".wc-rating").forEach((r)=>{const btns=[...r.querySelectorAll("button")];const lbl=r.querySelector("span");btns.forEach((b,i)=>b.addEventListener("click",()=>{btns.forEach((x,xi)=>x.classList.toggle("on",xi<=i));lbl.textContent=(i+1)+" / 5";}));});`
  ),
  c(
    "quantity-stepper",
    "Quantity — stepper",
    "forms",
    "Number input with +/- buttons (js).",
    `<div class="wc-qty"><button aria-label="Decrease">−</button><input type="number" value="1" min="1" max="99" /><button aria-label="Increase">+</button></div>`,
    `.wc-qty{display:inline-flex;align-items:center;border:1px solid #e2e8f0;border-radius:11px;overflow:hidden;background:#fff}.wc-qty button{width:40px;height:42px;border:0;background:none;font-size:19px;color:#475569;cursor:pointer;transition:background .12s}.wc-qty button:hover{background:#f1f5f9}.wc-qty input{width:52px;height:42px;border:0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;text-align:center;font-size:15px;font-weight:700;outline:none;color:#0f172a;-moz-appearance:textfield}.wc-qty input::-webkit-outer-spin-button,.wc-qty input::-webkit-inner-spin-button{-webkit-appearance:none}`,
    `document.querySelectorAll(".wc-qty").forEach((q)=>{const inp=q.querySelector("input");q.querySelectorAll("button").forEach((b,i)=>b.addEventListener("click",()=>{let v=parseInt(inp.value||"1",10);v=i===0?Math.max(1,v-1):Math.min(99,v+1);inp.value=String(v);inp.dispatchEvent(new Event("change"));}));});`
  ),
  c(
    "toggle-switch",
    "Toggle — switch",
    "forms",
    "On/off switch with label (js).",
    `<label class="wc-toggle"><input type="checkbox" checked /><span class="wc-toggle-track"></span><span class="wc-toggle-lbl">Email notifications</span></label>`,
    `.wc-toggle{display:inline-flex;align-items:center;gap:10px;cursor:pointer}.wc-toggle input{position:absolute;opacity:0;pointer-events:none}.wc-toggle-track{position:relative;width:44px;height:24px;border-radius:999px;background:#cbd5e1;transition:background .2s}.wc-toggle-track::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s}.wc-toggle input:checked+.wc-toggle-track{background:#6366f1}.wc-toggle input:checked+.wc-toggle-track::after{transform:translateX(20px)}.wc-toggle input:focus-visible+.wc-toggle-track{box-shadow:0 0 0 3px rgba(99,102,241,.3)}.wc-toggle-lbl{font-size:14px;font-weight:600;color:#334155}`,
    ``
  ),
  c(
    "checkbox-list",
    "Checklist",
    "forms",
    "Group of checkboxes (js).",
    `<div class="wc-check"><label><input type="checkbox" checked /><span>Essential</span></label><label><input type="checkbox" /><span>Marketing</span></label><label><input type="checkbox" /><span>Analytics</span></label></div>`,
    `.wc-check{display:grid;gap:10px}.wc-check label{display:flex;align-items:center;gap:10px;font-size:14px;color:#334155;cursor:pointer}.wc-check input{width:18px;height:18px;accent-color:#6366f1;cursor:pointer}.wc-check input:checked+.wc-check span{font-weight:700;color:#0f172a}`,
    ``
  ),
  c(
    "upload-dropzone",
    "Upload — dropzone",
    "forms",
    "Drag-and-drop file area (js).",
    `<div class="wc-upload"><input type="file" multiple hidden /><button class="wc-upload-btn">Click or drag files here</button><p>PNG, JPG, SVG up to 10 MB</p></div>`,
    `.wc-upload{display:grid;gap:8px;place-items:center;padding:40px 20px;border:2px dashed #cbd5e1;border-radius:16px;background:#f8fafc;text-align:center;transition:border-color .15s,background .15s}.wc-upload:hover,.wc-upload.drag{border-color:#6366f1;background:#eef2ff}.wc-upload-btn{border:0;background:#6366f1;color:#fff;font-weight:700;font-size:14px;padding:11px 20px;border-radius:11px;cursor:pointer;transition:background .15s}.wc-upload-btn:hover{background:#4f46e5}.wc-upload p{margin:0;font-size:12.5px;color:#94a3b8}`,
    `document.querySelectorAll(".wc-upload").forEach((u)=>{const input=u.querySelector("input");const btn=u.querySelector(".wc-upload-btn");btn.addEventListener("click",()=>input.click());["dragover","dragleave","drop"].forEach((ev)=>u.addEventListener(ev,(e)=>{e.preventDefault();u.classList.toggle("drag",ev==="dragover");}));u.addEventListener("drop",()=>{u.classList.remove("drag");const t=btn.textContent;btn.textContent="Uploaded ✓";setTimeout(()=>btn.textContent=t,1800);});});`
  ),
  c(
    "form-signup",
    "Form — signup card",
    "forms",
    "Two-field signup with terms note.",
    `<div class="wc-fsu"><h3>Create your account</h3><form class="wc-fsu-form"><input placeholder="Name" required /><input type="email" placeholder="Email" required /><input type="password" placeholder="Password (min 8 chars)" minlength="8" required /><button type="submit">Create account</button></form><p class="wc-fsu-note">By signing up you agree to our <a href="#">Terms</a>.</p></div>`,
    `.wc-fsu{max-width:400px;margin:0 auto;padding:30px;border:1px solid #e2e8f0;border-radius:20px;background:#fff}.wc-fsu h3{margin:0 0 18px;font-size:21px;font-weight:800;color:#0f172a}.wc-fsu-form{display:grid;gap:10px}.wc-fsu-form input{padding:12px 13px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px}.wc-fsu-form input:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-fsu-form button{padding:13px;border:0;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-weight:800;font-size:14.5px;cursor:pointer;margin-top:4px}.wc-fsu-form button:hover{filter:brightness(1.06)}.wc-fsu-note{margin:14px 0 0;font-size:12px;color:#94a3b8;text-align:center}.wc-fsu-note a{color:#4f46e5;text-decoration:none;font-weight:700}`,
    ``
  ),
  c(
    "search-command",
    "Command — palette",
    "forms",
    "Fake command palette search.",
    `<div class="wc-cmd"><div class="wc-cmd-input"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span>Search commands…</span></div><div class="wc-cmd-list"><span>→ Create new page</span><span>→ Publish site</span><span>→ Run tests</span></div></div>`,
    `.wc-cmd{max-width:440px;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 24px 60px rgba(15,23,42,.14)}.wc-cmd-input{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #e2e8f0;color:#94a3b8}.wc-cmd-input span{font-size:14px;color:#64748b}.wc-cmd-list{display:grid;padding:6px}.wc-cmd-list span{padding:10px 12px;font-size:13.5px;font-weight:600;color:#334155;border-radius:9px}.wc-cmd-list span:nth-child(2){background:rgba(99,102,241,.08);color:#4f46e5}`,
    ``
  ),
  c(
    "form-comment",
    "Form — comment",
    "forms",
    "Comment box with avatar (js submit).",
    `<form class="wc-cmt"><img src="https://i.pravatar.cc/48?img=12" alt="You" /><div><textarea rows="3" placeholder="Add a comment…" required></textarea><button type="submit">Post comment</button></div></form>`,
    `.wc-cmt{display:flex;gap:12px;max-width:520px}.wc-cmt>img{width:40px;height:40px;border-radius:50%;object-fit:cover}.wc-cmt>div{flex:1;display:grid;gap:10px}.wc-cmt textarea{padding:12px 14px;border:1px solid #e2e8f0;border-radius:12px;font-size:14px;font-family:inherit;resize:vertical}.wc-cmt textarea:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-cmt button{justify-self:end;padding:9px 18px;border:0;border-radius:9px;background:#0f172a;color:#fff;font-weight:700;font-size:13.5px;cursor:pointer}.wc-cmt button:hover{background:#4f46e5}`,
    `document.querySelectorAll(".wc-cmt").forEach((f)=>f.addEventListener("submit",(e)=>{e.preventDefault();const b=f.querySelector("button");const t=b.textContent;b.textContent="Posted ✓";f.querySelector("textarea").value="";setTimeout(()=>b.textContent=t,1800);}));`
  ),
];

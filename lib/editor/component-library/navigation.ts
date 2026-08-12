/**
 * Component library — navigation: navbars, tabs, accordion, pagination, dropdown.
 */
import type { LibraryComponent } from "./types";
import { c } from "./types";

export const NAVIGATION: LibraryComponent[] = [
  c(
    "navbar-simple",
    "Navbar — simple",
    "navigation",
    "Logo + links + CTA, sticky.",
    `<header class="wc-nav"><a class="wc-nav-logo" href="#">◈ Webpress</a><nav><a href="#">Features</a><a href="#">Pricing</a><a href="#">Docs</a><a href="#">Blog</a></nav><a class="wc-nav-cta" href="#">Get started</a></header>`,
    `.wc-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;background:rgba(255,255,255,.85);backdrop-filter:blur(10px);border-bottom:1px solid #e2e8f0}.wc-nav-logo{font-size:16px;font-weight:800;color:#0f172a;text-decoration:none}.wc-nav nav{display:flex;gap:22px}.wc-nav nav a{font-size:14px;color:#475569;text-decoration:none;transition:color .15s}.wc-nav nav a:hover{color:#4f46e5}.wc-nav-cta{padding:9px 16px;border-radius:9px;background:#0f172a;color:#fff;font-size:13.5px;font-weight:700;text-decoration:none;transition:background .15s}.wc-nav-cta:hover{background:#4f46e5}@media (max-width:640px){.wc-nav nav{display:none}}`,
    ``
  ),
  c(
    "navbar-centered",
    "Navbar — centered",
    "navigation",
    "Centered logo with links on both sides.",
    `<header class="wc-nav2"><div class="wc-nav2-side"><a href="#">Sign in</a></div><a class="wc-nav2-logo" href="#">◆ WEBPRESS</a><div class="wc-nav2-side"><a class="wc-nav2-btn" href="#">Get started</a></div></header>`,
    `.wc-nav2{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:14px 24px;border-bottom:1px solid #e2e8f0;background:#fff}.wc-nav2-logo{font-size:15px;font-weight:800;letter-spacing:.12em;color:#0f172a;text-decoration:none}.wc-nav2-side{display:flex;justify-content:flex-end;gap:18px}.wc-nav2-side a{font-size:14px;color:#475569;text-decoration:none}.wc-nav2-side a:hover{color:#4f46e5}.wc-nav2-btn{padding:9px 16px;border-radius:9px;background:#6366f1;color:#fff!important;font-weight:700;transition:background .15s}.wc-nav2-btn:hover{background:#4f46e5}`,
    ``
  ),
  c(
    "tabs",
    "Tabs",
    "navigation",
    "Switchable tab panels (js).",
    `<div class="wc-tabs">
  <div class="wc-tabs-bar" role="tablist"><button class="active" role="tab">Overview</button><button role="tab">Features</button><button role="tab">Pricing</button></div>
  <div class="wc-tabs-panels"><div class="wc-tab-panel active"><p>Overview content — a quick glance at everything the product does in one place.</p></div><div class="wc-tab-panel"><p>Features content — deep dives, screenshots and comparisons live here.</p></div><div class="wc-tab-panel"><p>Pricing content — plans, limits and add-ons explained clearly.</p></div></div>
</div>`,
    `.wc-tabs{max-width:640px}.wc-tabs-bar{display:flex;gap:4px;border-bottom:2px solid #e2e8f0}.wc-tabs-bar button{border:0;background:none;padding:11px 16px;font-size:14px;font-weight:600;color:#64748b;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .15s}.wc-tabs-bar button:hover{color:#0f172a}.wc-tabs-bar button.active{color:#4f46e5;border-bottom-color:#6366f1}.wc-tabs-panels{padding:18px 2px}.wc-tab-panel{display:none}.wc-tab-panel.active{display:block;animation:wc-fade .2s ease}.wc-tab-panel p{margin:0;font-size:14.5px;line-height:1.65;color:#475569}@keyframes wc-fade{from{opacity:0;transform:translateY(3px)}to{opacity:1}}`,
    `document.querySelectorAll(".wc-tabs-bar").forEach((bar)=>{const buttons=[...bar.children];const panels=[...bar.closest(".wc-tabs").querySelectorAll(".wc-tab-panel")];buttons.forEach((b,i)=>b.addEventListener("click",()=>{buttons.forEach((x)=>x.classList.remove("active"));panels.forEach((p)=>p.classList.remove("active"));b.classList.add("active");panels[i]?.classList.add("active");}));});`
  ),
  c(
    "accordion-simple",
    "Accordion — simple",
    "navigation",
    "Minimal collapsible list (js).",
    `<div class="wc-acc">
  <div class="wc-acc-item"><button class="wc-acc-q">What's included?<span>+</span></button><div class="wc-acc-a"><p>Everything in the editor, plus 100 pre-made components and version history.</p></div></div>
  <div class="wc-acc-item"><button class="wc-acc-q">Can I cancel?<span>+</span></button><div class="wc-acc-a"><p>Yes — cancel anytime from settings; your projects stay exportable.</p></div></div>
</div>`,
    `.wc-acc{max-width:640px}.wc-acc-item{border:1px solid #e2e8f0;border-radius:12px;margin-bottom:10px;overflow:hidden;background:#fff}.wc-acc-q{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 16px;background:none;border:0;font-size:15px;font-weight:700;color:#0f172a;cursor:pointer;text-align:left}.wc-acc-q span{color:#94a3b8;font-size:18px;font-weight:400;transition:transform .2s}.wc-acc-item.open .wc-acc-q span{transform:rotate(45deg)}.wc-acc-a{max-height:0;overflow:hidden;transition:max-height .25s ease}.wc-acc-item.open .wc-acc-a{max-height:160px}.wc-acc-a p{margin:0;padding:0 16px 16px;font-size:14px;line-height:1.6;color:#64748b}`,
    `document.querySelectorAll(".wc-acc-q").forEach((q)=>q.addEventListener("click",()=>{q.closest(".wc-acc-item").classList.toggle("open");}));`
  ),
  c(
    "pagination",
    "Pagination",
    "navigation",
    "Numbered page controls.",
    `<nav class="wc-pager" aria-label="Pagination"><a href="#" class="disabled">‹</a><a href="#" class="active">1</a><a href="#">2</a><a href="#">3</a><a href="#">…</a><a href="#">12</a><a href="#">›</a></nav>`,
    `.wc-pager{display:flex;align-items:center;gap:6px}.wc-pager a{display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:36px;padding:0 8px;border:1px solid #e2e8f0;border-radius:10px;font-size:13.5px;font-weight:600;color:#475569;text-decoration:none;transition:all .15s}.wc-pager a:hover{border-color:#c7d2fe;color:#4f46e5}.wc-pager a.active{background:#6366f1;border-color:#6366f1;color:#fff}.wc-pager a.disabled{opacity:.4;pointer-events:none}`,
    ``
  ),
  c(
    "sidebar-nav",
    "Sidebar — nav",
    "navigation",
    "Vertical menu with active item.",
    `<nav class="wc-side"><div class="wc-side-h"><b>Project</b></div><a href="#">Dashboard</a><a href="#" class="active">Pages</a><a href="#">Components</a><a href="#">Assets</a><a href="#">Deployments</a><div class="wc-side-h"><b>Settings</b></div><a href="#">General</a><a href="#">Team</a></nav>`,
    `.wc-side{width:230px;display:grid;gap:2px;padding:10px}.wc-side-h{margin:12px 10px 4px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8}.wc-side a{padding:9px 12px;border-radius:9px;font-size:13.5px;font-weight:600;color:#475569;text-decoration:none;transition:all .15s}.wc-side a:hover{background:#f1f5f9;color:#0f172a}.wc-side a.active{background:rgba(99,102,241,.1);color:#4f46e5}`,
    ``
  ),
  c(
    "breadcrumb",
    "Breadcrumbs",
    "navigation",
    "Trail of parent links.",
    `<nav class="wc-crumb" aria-label="Breadcrumb"><a href="#">Home</a><span>/</span><a href="#">Products</a><span>/</span><span aria-current="page">Aurora Lamp</span></nav>`,
    `.wc-crumb{display:flex;align-items:center;gap:8px;font-size:13px}.wc-crumb a{color:#64748b;text-decoration:none}.wc-crumb a:hover{color:#4f46e5}.wc-crumb span{color:#cbd5e1}.wc-crumb span[aria-current]{color:#0f172a;font-weight:700}`,
    ``
  ),
  c(
    "dropdown",
    "Dropdown menu",
    "navigation",
    "Button with menu (js).",
    `<div class="wc-dd"><button class="wc-dd-btn" aria-expanded="false">Actions ▾</button><div class="wc-dd-menu" hidden><a href="#">Edit</a><a href="#">Duplicate</a><a href="#">Move to…</a><hr /><a href="#" class="danger">Delete</a></div></div>`,
    `.wc-dd{position:relative;display:inline-block}.wc-dd-btn{padding:10px 16px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;font-size:13.5px;font-weight:600;color:#1e293b;cursor:pointer;transition:border-color .15s}.wc-dd-btn:hover{border-color:#c7d2fe}.wc-dd-menu{position:absolute;top:calc(100% + 6px);left:0;min-width:170px;padding:6px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;box-shadow:0 14px 34px rgba(15,23,42,.12);z-index:20}.wc-dd-menu a{display:block;padding:9px 12px;border-radius:8px;font-size:13.5px;font-weight:600;color:#334155;text-decoration:none}.wc-dd-menu a:hover{background:#f1f5f9}.wc-dd-menu hr{margin:6px;border:0;border-top:1px solid #e2e8f0}.wc-dd-menu a.danger{color:#dc2626}.wc-dd-menu a.danger:hover{background:#fef2f2}`,
    `document.querySelectorAll(".wc-dd-btn").forEach((btn)=>btn.addEventListener("click",(e)=>{e.stopPropagation();const m=btn.nextElementSibling;m.hidden=!m.hidden;btn.setAttribute("aria-expanded",String(!m.hidden));}));document.addEventListener("click",()=>{document.querySelectorAll(".wc-dd-menu:not([hidden])").forEach((m)=>{m.hidden=true;m.previousElementSibling.setAttribute("aria-expanded","false");});});`
  ),
  c(
    "progress-nav",
    "Progress — steps nav",
    "navigation",
    "Checkout-style step indicator.",
    `<ol class="wc-pnav"><li class="done"><i>✓</i><span>Cart</span></li><li class="active"><i>2</i><span>Shipping</span></li><li><i>3</i><span>Payment</span></li></ol>`,
    `.wc-pnav{list-style:none;display:flex;align-items:center;gap:0;margin:0;padding:0}.wc-pnav li{display:flex;align-items:center;gap:9px;flex:1;position:relative;font-size:13px;font-weight:700;color:#94a3b8}.wc-pnav li::after{content:"";flex:1;height:2px;background:#e2e8f0;margin:0 14px}.wc-pnav li:last-child::after{display:none}.wc-pnav i{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:#e2e8f0;color:#94a3b8;font-style:normal;font-size:12px}.wc-pnav li.active{color:#0f172a}.wc-pnav li.active i{background:#6366f1;color:#fff}.wc-pnav li.done{color:#475569}.wc-pnav li.done i{background:#16a34a;color:#fff}`,
    ``
  ),
  c(
    "back-to-top",
    "Back to top",
    "navigation",
    "Scroll-to-top floating button (js).",
    `<button class="wc-top" aria-label="Back to top">↑</button>`,
    `.wc-top{position:fixed;right:22px;bottom:22px;width:44px;height:44px;border-radius:50%;border:0;background:#0f172a;color:#fff;font-size:18px;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;box-shadow:0 8px 20px rgba(15,23,42,.25);z-index:40}.wc-top.show{opacity:1;pointer-events:auto}.wc-top:hover{transform:translateY(-2px)}`,
    `window.addEventListener("scroll",()=>{const b=document.querySelector(".wc-top");b.classList.toggle("show",window.scrollY>400);},{passive:true});document.querySelectorAll(".wc-top").forEach((b)=>b.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"})));`
  ),
];

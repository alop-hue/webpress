/**
 * Component library — basics: buttons, badges, alerts, avatars, tags, dividers.
 * Every component is self-contained (scoped css + optional vanilla js) and
 * uses a shared minimal design language via scoped custom properties.
 */
import type { LibraryComponent } from "./types";
import { c } from "./types";

export const BASICS: LibraryComponent[] = [
  c(
    "button-primary",
    "Button — primary",
    "basics",
    "Solid call-to-action button with hover lift.",
    `<a class="wc-btn-pr" href="#">Get started</a>`,
    `.wc-btn-pr{--p:#6366f1;--p2:#4f46e5;display:inline-block;padding:12px 22px;border-radius:10px;background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;font-weight:600;font-size:15px;text-decoration:none;box-shadow:0 4px 14px rgba(99,102,241,.35);transition:transform .15s ease,box-shadow .15s ease}.wc-btn-pr:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(99,102,241,.4)}`,
    ``
  ),
  c(
    "button-secondary",
    "Button — secondary",
    "basics",
    "Outlined button for secondary actions.",
    `<a class="wc-btn-sec" href="#">Learn more</a>`,
    `.wc-btn-sec{--p:#6366f1;display:inline-block;padding:12px 22px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#1e293b;font-weight:600;font-size:15px;text-decoration:none;transition:border-color .15s,color .15s}.wc-btn-sec:hover{border-color:var(--p);color:var(--p)}`,
    ``
  ),
  c(
    "button-ghost",
    "Button — ghost",
    "basics",
    "Borderless text button.",
    `<a class="wc-btn-ghost" href="#">View pricing <span aria-hidden>→</span></a>`,
    `.wc-btn-ghost{--p:#6366f1;display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;background:transparent;color:#64748b;font-weight:600;font-size:14px;text-decoration:none;transition:background .15s,color .15s}.wc-btn-ghost:hover{background:#f1f5f9;color:var(--p)}`,
    ``
  ),
  c(
    "button-gradient",
    "Button — gradient",
    "basics",
    "Vivid gradient CTA with glow.",
    `<a class="wc-btn-grad" href="#">Start free trial</a>`,
    `.wc-btn-grad{display:inline-block;padding:13px 26px;border-radius:999px;background:linear-gradient(90deg,#8b5cf6,#ec4899,#f59e0b);background-size:200% 100%;color:#fff;font-weight:700;font-size:15px;text-decoration:none;box-shadow:0 6px 20px rgba(236,72,153,.35);transition:background-position .4s,transform .15s}.wc-btn-grad:hover{background-position:100% 0;transform:translateY(-1px)}`,
    ``
  ),
  c(
    "button-pill",
    "Button — pill",
    "basics",
    "Soft rounded button in accent tint.",
    `<a class="wc-btn-pill" href="#">Subscribe</a>`,
    `.wc-btn-pill{--p:#0ea5e9;display:inline-block;padding:11px 24px;border-radius:999px;background:rgba(14,165,233,.12);color:#0284c7;font-weight:700;font-size:14px;text-decoration:none;transition:background .15s,transform .15s}.wc-btn-pill:hover{background:rgba(14,165,233,.2);transform:translateY(-1px)}`,
    ``
  ),
  c(
    "button-icon",
    "Button — with icon",
    "basics",
    "Button with inline SVG icon.",
    `<a class="wc-btn-ic" href="#"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Continue</a>`,
    `.wc-btn-ic{--p:#6366f1;display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:10px;background:#0f172a;color:#fff;font-weight:600;font-size:14px;text-decoration:none;transition:background .15s}.wc-btn-ic:hover{background:#1e293b}.wc-btn-ic svg{transition:transform .15s}.wc-btn-ic:hover svg{transform:translateX(2px)}`,
    ``
  ),
  c(
    "badge",
    "Badge",
    "basics",
    "Small status label.",
    `<span class="wc-badge">New</span>`,
    `.wc-badge{--p:#6366f1;display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(99,102,241,.12);color:#4f46e5;font-size:12px;font-weight:700;letter-spacing:.02em}`,
    ``
  ),
  c(
    "badge-dot",
    "Badge — dot",
    "basics",
    "Status badge with a live dot.",
    `<span class="wc-badge-dot"><i></i> 2,401 online</span>`,
    `.wc-badge-dot{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:12.5px;font-weight:600}.wc-badge-dot i{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.5);animation:wc-pulse 2s infinite}@keyframes wc-pulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,.5)}70%{box-shadow:0 0 0 6px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}`,
    ``
  ),
  c(
    "badge-icon",
    "Badge — with icon",
    "basics",
    "Badge with a small icon chip.",
    `<span class="wc-badge-ic"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Verified</span>`,
    `.wc-badge-ic{--p:#16a34a;display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:rgba(22,163,74,.1);color:#15803d;font-size:12px;font-weight:700}`,
    ``
  ),
  c(
    "alert-info",
    "Alert — info",
    "basics",
    "Neutral informational callout.",
    `<div class="wc-alert wc-alert-info" role="status"><strong>Heads up</strong><p>Your trial expires in 6 days. Add billing to keep your site live.</p></div>`,
    `.wc-alert{padding:14px 16px;border-radius:12px;font-size:13.5px;line-height:1.5}.wc-alert strong{display:block;font-size:14px;margin-bottom:2px}.wc-alert p{margin:0;opacity:.85}.wc-alert-info{background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}`,
    ``
  ),
  c(
    "alert-success",
    "Alert — success",
    "basics",
    "Positive confirmation callout.",
    `<div class="wc-alert wc-alert-ok" role="status"><strong>Payment received</strong><p>Thanks — your invoice is available in your dashboard.</p></div>`,
    `.wc-alert{padding:14px 16px;border-radius:12px;font-size:13.5px;line-height:1.5}.wc-alert strong{display:block;font-size:14px;margin-bottom:2px}.wc-alert p{margin:0;opacity:.85}.wc-alert-ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}`,
    ``
  ),
  c(
    "alert-warning",
    "Alert — warning",
    "basics",
    "Caution callout.",
    `<div class="wc-alert wc-alert-warn" role="alert"><strong>Almost there</strong><p>Your domain needs to be verified within 48 hours.</p></div>`,
    `.wc-alert{padding:14px 16px;border-radius:12px;font-size:13.5px;line-height:1.5}.wc-alert strong{display:block;font-size:14px;margin-bottom:2px}.wc-alert p{margin:0;opacity:.85}.wc-alert-warn{background:#fffbeb;border:1px solid #fde68a;color:#92400e}`,
    ``
  ),
  c(
    "alert-error",
    "Alert — error",
    "basics",
    "Error callout.",
    `<div class="wc-alert wc-alert-bad" role="alert"><strong>Something went wrong</strong><p>We couldn't save your changes. Please try again.</p></div>`,
    `.wc-alert{padding:14px 16px;border-radius:12px;font-size:13.5px;line-height:1.5}.wc-alert strong{display:block;font-size:14px;margin-bottom:2px}.wc-alert p{margin:0;opacity:.85}.wc-alert-bad{background:#fef2f2;border:1px solid #fecaca;color:#991b1b}`,
    ``
  ),
  c(
    "alert-dismissible",
    "Alert — dismissible",
    "basics",
    "Callout with a close button (js).",
    `<div class="wc-alert-dismiss" role="alert"><span>New pricing is live — <a href="#">see what changed</a>.</span><button class="wc-alert-dismiss-x" aria-label="Dismiss">×</button></div>`,
    `.wc-alert-dismiss{--p:#6366f1;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-radius:12px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.25);color:#1e293b;font-size:13.5px}.wc-alert-dismiss a{color:var(--p);font-weight:600;text-decoration:none}.wc-alert-dismiss-x{border:0;background:transparent;color:#64748b;font-size:18px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px}.wc-alert-dismiss-x:hover{background:rgba(99,102,241,.15);color:#4f46e5}`,
    `document.querySelectorAll(".wc-alert-dismiss-x").forEach((b)=>b.addEventListener("click",()=>b.closest(".wc-alert-dismiss").remove()));`
  ),
  c(
    "avatar",
    "Avatar",
    "basics",
    "Single round avatar with initials.",
    `<span class="wc-avatar">AL</span>`,
    `.wc-avatar{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-weight:700;font-size:15px;letter-spacing:.03em}`,
    ``
  ),
  c(
    "avatar-image",
    "Avatar — image",
    "basics",
    "Avatar with photo and status ring.",
    `<span class="wc-avatar-img"><img src="https://i.pravatar.cc/80?img=12" alt="Portrait" /><i></i></span>`,
    `.wc-avatar-img{position:relative;display:inline-flex}.wc-avatar-img img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.15)}.wc-avatar-img i{position:absolute;right:0;bottom:0;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #fff}`,
    ``
  ),
  c(
    "avatar-stack",
    "Avatar — stack",
    "basics",
    "Overlapping avatar group.",
    `<div class="wc-avatar-stack"><span style="background:#f59e0b">JT</span><span style="background:#10b981">MK</span><span style="background:#6366f1">SR</span><span>+12</span></div>`,
    `.wc-avatar-stack{display:flex}.wc-avatar-stack span{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin-left:-9px;border-radius:50%;border:2px solid #fff;background:#64748b;color:#fff;font-size:12px;font-weight:700}.wc-avatar-stack span:first-child{margin-left:0}`,
    ``
  ),
  c(
    "avatar-status",
    "Avatar — status",
    "basics",
    "Stack with online/offline dots.",
    `<div class="wc-avatar-status"><span class="on">AB</span><span class="off">CD</span><span class="on">EF</span></div>`,
    `.wc-avatar-status{display:flex}.wc-avatar-status span{position:relative;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;margin-left:-8px;border-radius:50%;border:2px solid #fff;background:#6366f1;color:#fff;font-size:12px;font-weight:700}.wc-avatar-status span:first-child{margin-left:0}.wc-avatar-status span::after{content:"";position:absolute;right:1px;bottom:1px;width:10px;height:10px;border-radius:50%;border:2px solid #fff;background:#94a3b8}.wc-avatar-status span.on::after{background:#22c55e}`,
    ``
  ),
  c(
    "tags",
    "Tags",
    "basics",
    "Row of filter tags.",
    `<div class="wc-tags"><span>React</span><span class="active">Next.js</span><span>TypeScript</span><span>Tailwind</span></div>`,
    `.wc-tags{display:flex;flex-wrap:wrap;gap:8px}.wc-tags span{padding:6px 14px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}.wc-tags span:hover{border-color:#c7d2fe}.wc-tags span.active{background:#6366f1;border-color:#6366f1;color:#fff}`,
    `document.querySelectorAll(".wc-tags span").forEach((t)=>t.addEventListener("click",()=>{t.parentElement.querySelectorAll("span").forEach((s)=>s.classList.remove("active"));t.classList.add("active");}));`
  ),
  c(
    "divider",
    "Divider — with label",
    "basics",
    "Horizontal divider with centered text.",
    `<div class="wc-divider"><span>or continue with</span></div>`,
    `.wc-divider{display:flex;align-items:center;gap:14px;color:#94a3b8;font-size:12.5px}.wc-divider::before,.wc-divider::after{content:"";flex:1;height:1px;background:#e2e8f0}`,
    ``
  ),
  c(
    "kbd",
    "Keyboard hint",
    "basics",
    "Keyboard shortcut chip.",
    `<span class="wc-kbd"><kbd>⌘</kbd><kbd>K</kbd> Search anything</span>`,
    `.wc-kbd{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;color:#64748b;font-size:12px}.wc-kbd kbd{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 4px;border-radius:5px;border:1px solid #cbd5e1;background:#fff;color:#334155;font-family:inherit;font-size:11px;box-shadow:0 1px 0 #cbd5e1}`,
    ``
  ),
  c(
    "button-loading",
    "Button — loading",
    "basics",
    "Button in a busy state with spinner.",
    `<button class="wc-btn-loading" disabled><i></i> Saving…</button>`,
    `.wc-btn-loading{display:inline-flex;align-items:center;gap:9px;padding:12px 22px;border:0;border-radius:10px;background:#c7d2fe;color:#4338ca;font-weight:700;font-size:14.5px;cursor:default;opacity:.85}.wc-btn-loading i{width:14px;height:14px;border-radius:50%;border:2px solid rgba(67,56,202,.3);border-top-color:#4338ca;animation:wc-rot .7s linear infinite}@keyframes wc-rot{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.wc-btn-loading i{animation-duration:1.6s}}`,
    ``
  ),
  c(
    "badge-count",
    "Badge — count",
    "basics",
    "Label with a numeric count chip.",
    `<span class="wc-badge-count">Inbox <i>4</i></span>`,
    `.wc-badge-count{display:inline-flex;align-items:center;gap:8px;padding:6px 10px 6px 14px;border:1px solid #e2e8f0;border-radius:999px;background:#fff;color:#334155;font-size:13px;font-weight:700}.wc-badge-count i{min-width:20px;height:20px;padding:0 5px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#ef4444;color:#fff;font-size:11px;font-style:normal}`,
    ``
  ),
  c(
    "divider-dot",
    "Divider — dotted",
    "basics",
    "Subtle dotted horizontal rule.",
    `<div class="wc-divider-dot"></div>`,
    `.wc-divider-dot{height:1px;background-image:radial-gradient(circle,#cbd5e1 1.2px,transparent 1.3px);background-size:14px 1px;background-repeat:repeat-x}`,
    ``
  ),
  c(
    "progress-line",
    "Progress — line",
    "basics",
    "Animated progress bar.",
    `<div class="wc-progress" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"><span style="width:72%"></span></div>`,
    `.wc-progress{height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden}.wc-progress span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#6366f1,#8b5cf6);animation:wc-fill 1.2s ease-out both;transform-origin:left}@keyframes wc-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}@media (prefers-reduced-motion:reduce){.wc-progress span{animation:none}}`,
    ``
  ),
  c(
    "stats-row",
    "Stats — inline row",
    "basics",
    "Key numbers with labels.",
    `<div class="wc-stats"><div><b>12.4k</b><span>Active users</span></div><div><b>98%</b><span>Uptime</span></div><div><b>4.9</b><span>Rating</span></div></div>`,
    `.wc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.wc-stats>div{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;text-align:center}.wc-stats b{display:block;font-size:22px;color:#0f172a;letter-spacing:-.02em}.wc-stats span{font-size:12.5px;color:#64748b}`,
    ``
  ),
  c(
    "timeline-steps",
    "Timeline — vertical",
    "basics",
    "Step-by-step vertical timeline.",
    `<ol class="wc-timeline"><li><b>Research</b><span>Talk to 20 customers</span></li><li><b>Design</b><span>Prototype and test</span></li><li><b>Launch</b><span>Ship to production</span></li></ol>`,
    `.wc-timeline{list-style:none;margin:0;padding:0;display:grid;gap:0}.wc-timeline li{position:relative;padding:0 0 22px 30px;border-left:2px solid #e2e8f0}.wc-timeline li:last-child{border-left-color:transparent;padding-bottom:0}.wc-timeline li::before{content:"";position:absolute;left:-7px;top:2px;width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid #6366f1}.wc-timeline b{display:block;font-size:14.5px;color:#0f172a}.wc-timeline span{font-size:13px;color:#64748b}`,
    ``
  ),
  c(
    "callout",
    "Callout — tip box",
    "basics",
    "Highlighted note with icon.",
    `<div class="wc-callout"><span class="wc-callout-ic"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg></span><b>Tip</b><p>Double-click any text in the visual editor to edit it inline — no code needed.</p></div>`,
    `.wc-callout{display:flex;align-items:flex-start;gap:10px;padding:14px 16px;border:1px solid #c7d2fe;border-radius:12px;background:#eef2ff;max-width:480px}.wc-callout-ic{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:#c7d2fe;color:#3730a3;flex-shrink:0;margin-top:1px}.wc-callout b{display:block;font-size:13px;font-weight:800;color:#3730a3}.wc-callout p{margin:2px 0 0;font-size:13px;line-height:1.55;color:#4338ca}`,
    ``
  ),
];

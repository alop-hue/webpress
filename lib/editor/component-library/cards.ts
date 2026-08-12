/**
 * Component library — cards: feature, stat, pricing, testimonial, profile, blog, product.
 */
import type { LibraryComponent } from "./types";
import { c } from "./types";

export const CARDS: LibraryComponent[] = [
  c(
    "card-feature",
    "Card — feature",
    "cards",
    "Icon + title + copy feature card with hover accent.",
    `<div class="wc-feat">
  <div class="wc-feat-ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg></div>
  <h3>Blazing fast</h3>
  <p>Every page ships as static HTML with zero framework overhead in the browser.</p>
</div>`,
    `.wc-feat{--p:#6366f1;padding:26px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;transition:transform .18s ease,box-shadow .18s ease,border-color .18s}.wc-feat:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(15,23,42,.08);border-color:rgba(99,102,241,.4)}.wc-feat-ic{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:12px;background:rgba(99,102,241,.1);color:#4f46e5;margin-bottom:16px}.wc-feat h3{margin:0 0 8px;font-size:17px;font-weight:700;color:#0f172a}.wc-feat p{margin:0;font-size:14px;line-height:1.6;color:#64748b}`,
    ``
  ),
  c(
    "card-stat",
    "Card — stat",
    "cards",
    "Big number with trend indicator.",
    `<div class="wc-stat"><span class="wc-stat-lbl">Monthly revenue</span><span class="wc-stat-val">$48,290</span><span class="wc-stat-delta up">▲ 12.4%</span></div>`,
    `.wc-stat{padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#fff}.wc-stat-lbl{display:block;font-size:12.5px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em}.wc-stat-val{display:block;margin-top:8px;font-size:30px;font-weight:800;letter-spacing:-.02em;color:#0f172a}.wc-stat-delta{display:inline-flex;align-items:center;gap:4px;margin-top:10px;font-size:12.5px;font-weight:700;border-radius:999px;padding:3px 9px}.wc-stat-delta.up{color:#15803d;background:#f0fdf4}.wc-stat-delta.down{color:#b91c1c;background:#fef2f2}`,
    ``
  ),
  c(
    "card-metric",
    "Card — metric row",
    "cards",
    "Horizontal metric with mini sparkline.",
    `<div class="wc-metric"><div><span class="wc-metric-lbl">Page views</span><span class="wc-metric-val">128,402</span></div><svg class="wc-metric-spark" viewBox="0 0 100 32" preserveAspectRatio="none"><polyline points="0,26 12,22 24,24 36,16 48,19 60,10 72,13 84,6 100,9" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/></svg></div>`,
    `.wc-metric{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 22px;border:1px solid #e2e8f0;border-radius:16px;background:#fff}.wc-metric-lbl{display:block;font-size:12px;color:#64748b;font-weight:600}.wc-metric-val{display:block;margin-top:4px;font-size:24px;font-weight:800;color:#0f172a}.wc-metric-spark{width:110px;height:34px}`,
    ``
  ),
  c(
    "card-pricing",
    "Card — pricing",
    "cards",
    "Single pricing option.",
    `<div class="wc-price">
  <span class="wc-price-name">Starter</span>
  <span class="wc-price-amt"><b>$19</b><i>/mo</i></span>
  <ul><li>3 projects</li><li>50 GB storage</li><li>Community support</li></ul>
  <a class="wc-price-btn" href="#">Choose plan</a>
</div>`,
    `.wc-price{padding:26px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;display:flex;flex-direction:column;gap:6px}.wc-price-name{font-size:14px;font-weight:700;color:#64748b}.wc-price-amt b{font-size:34px;font-weight:800;color:#0f172a;letter-spacing:-.02em}.wc-price-amt i{font-style:normal;color:#94a3b8;font-size:13px}.wc-price ul{list-style:none;margin:14px 0;padding:0;display:grid;gap:9px}.wc-price li{font-size:13.5px;color:#475569;padding-left:22px;position:relative}.wc-price li::before{content:"✓";position:absolute;left:0;color:#6366f1;font-weight:800}.wc-price-btn{text-align:center;padding:11px;border-radius:10px;border:1px solid #c7d2fe;color:#4f46e5;font-weight:700;font-size:14px;text-decoration:none;transition:all .15s}.wc-price-btn:hover{background:#6366f1;border-color:#6366f1;color:#fff}`,
    ``
  ),
  c(
    "card-pricing-popular",
    "Card — pricing popular",
    "cards",
    "Highlighted plan with ribbon.",
    `<div class="wc-price-pop">
  <span class="wc-price-ribbon">Most popular</span>
  <span class="wc-price-name">Pro</span>
  <span class="wc-price-amt"><b>$49</b><i>/mo</i></span>
  <ul><li>Unlimited projects</li><li>500 GB storage</li><li>Priority support</li></ul>
  <a class="wc-price-btn" href="#">Get Pro</a>
</div>`,
    `.wc-price-pop{position:relative;padding:30px 26px;border-radius:18px;background:linear-gradient(160deg,#312e81,#4338ca 55%,#4f46e5);color:#fff;display:flex;flex-direction:column;gap:6px;box-shadow:0 18px 40px rgba(67,56,202,.35)}.wc-price-ribbon{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#f59e0b;color:#fff;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 14px;border-radius:999px;box-shadow:0 4px 12px rgba(245,158,11,.4)}.wc-price-name{font-size:14px;font-weight:700;opacity:.85}.wc-price-amt b{font-size:34px;font-weight:800;letter-spacing:-.02em}.wc-price-amt i{font-style:normal;opacity:.7;font-size:13px}.wc-price-pop ul{list-style:none;margin:14px 0;padding:0;display:grid;gap:9px}.wc-price-pop li{font-size:13.5px;opacity:.92;padding-left:22px;position:relative}.wc-price-pop li::before{content:"✓";position:absolute;left:0;font-weight:800}.wc-price-btn{text-align:center;padding:11px;border-radius:10px;background:#fff;color:#4338ca;font-weight:800;font-size:14px;text-decoration:none;transition:transform .15s}.wc-price-btn:hover{transform:translateY(-1px)}`,
    ``
  ),
  c(
    "card-testimonial",
    "Card — testimonial",
    "cards",
    "Quote with author and rating.",
    `<figure class="wc-tquote">
  <div class="wc-tquote-stars">★★★★★</div>
  <blockquote>"Webpress replaced three tools for us. Publishing feels like magic."</blockquote>
  <figcaption><img src="https://i.pravatar.cc/64?img=32" alt="Portrait of Dana" /><div><b>Dana Keller</b><span>Founder, Northwind</span></div></figcaption>
</figure>`,
    `.wc-tquote{margin:0;padding:26px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;display:grid;gap:12px}.wc-tquote-stars{color:#f59e0b;letter-spacing:3px;font-size:14px}.wc-tquote blockquote{margin:0;font-size:15px;line-height:1.65;color:#1e293b;font-weight:500}.wc-tquote figcaption{display:flex;align-items:center;gap:11px;margin-top:4px}.wc-tquote img{width:40px;height:40px;border-radius:50%;object-fit:cover}.wc-tquote figcaption div{display:grid;line-height:1.3}.wc-tquote b{font-size:13.5px;color:#0f172a}.wc-tquote span{font-size:12px;color:#64748b}`,
    ``
  ),
  c(
    "card-quote",
    "Card — quote",
    "cards",
    "Minimal centered pull-quote.",
    `<figure class="wc-quote"><blockquote>"Design is intelligence made visible."</blockquote><figcaption>— Alina Wong, Creative Director</figcaption></figure>`,
    `.wc-quote{margin:0;text-align:center;padding:34px 24px;border-left:3px solid #6366f1;background:#f8fafc;border-radius:0 16px 16px 0}.wc-quote blockquote{margin:0;font-size:19px;font-weight:600;line-height:1.5;color:#0f172a}.wc-quote figcaption{margin-top:12px;font-size:13px;color:#64748b}`,
    ``
  ),
  c(
    "card-profile",
    "Card — profile",
    "cards",
    "Team member card.",
    `<div class="wc-prof"><img src="https://i.pravatar.cc/160?img=47" alt="Portrait of Sam" /><h3>Sam Rivera</h3><p>Head of Product</p><div class="wc-prof-links"><a href="#" aria-label="Twitter">𝕏</a><a href="#" aria-label="LinkedIn">in</a></div></div>`,
    `.wc-prof{text-align:center;padding:28px 20px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;transition:transform .18s}.wc-prof:hover{transform:translateY(-3px)}.wc-prof img{width:84px;height:84px;border-radius:50%;object-fit:cover;margin:0 auto 14px;display:block;box-shadow:0 6px 16px rgba(0,0,0,.12)}.wc-prof h3{margin:0;font-size:16px;font-weight:700;color:#0f172a}.wc-prof p{margin:4px 0 14px;font-size:13px;color:#64748b}.wc-prof-links{display:flex;justify-content:center;gap:8px}.wc-prof-links a{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1px solid #e2e8f0;color:#64748b;font-size:12.5px;text-decoration:none;transition:all .15s}.wc-prof-links a:hover{border-color:#6366f1;color:#4f46e5;background:rgba(99,102,241,.06)}`,
    ``
  ),
  c(
    "card-blog",
    "Card — blog post",
    "cards",
    "Article card with cover, meta and read link.",
    `<article class="wc-blog">
  <div class="wc-blog-cover" style="background:linear-gradient(135deg,#6366f1,#a855f7)">📷</div>
  <div class="wc-blog-body"><span class="wc-blog-meta">Product · 6 min read</span><h3>Shipping faster with previews</h3><p>A short look at how instant previews changed our release loop.</p><a href="#">Read article →</a></div>
</article>`,
    `.wc-blog{border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;background:#fff;transition:transform .18s,box-shadow .18s}.wc-blog:hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(15,23,42,.09)}.wc-blog-cover{height:150px;display:flex;align-items:center;justify-content:center;font-size:34px}.wc-blog-body{padding:20px}.wc-blog-meta{font-size:11.5px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.06em}.wc-blog h3{margin:8px 0 6px;font-size:17px;font-weight:700;color:#0f172a;line-height:1.35}.wc-blog p{margin:0 0 12px;font-size:13.5px;line-height:1.6;color:#64748b}.wc-blog a{font-size:13.5px;font-weight:700;color:#4f46e5;text-decoration:none}.wc-blog a:hover{text-decoration:underline}`,
    ``
  ),
  c(
    "card-product",
    "Card — product",
    "cards",
    "Store product card with price and add-to-cart.",
    `<div class="wc-prod">
  <div class="wc-prod-img" style="background:linear-gradient(135deg,#fef3c7,#fde68a)"></div>
  <div class="wc-prod-body"><h3>Aurora Desk Lamp</h3><p>Warm, adjustable light for late nights.</p><div class="wc-prod-foot"><b>$89</b><button>Add to cart</button></div></div>
</div>`,
    `.wc-prod{border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;background:#fff}.wc-prod-img{height:160px}.wc-prod-body{padding:18px}.wc-prod h3{margin:0;font-size:15.5px;font-weight:700;color:#0f172a}.wc-prod p{margin:5px 0 12px;font-size:13px;color:#64748b}.wc-prod-foot{display:flex;align-items:center;justify-content:space-between}.wc-prod b{font-size:17px;color:#0f172a}.wc-prod button{border:0;background:#0f172a;color:#fff;font-size:12.5px;font-weight:700;padding:9px 14px;border-radius:9px;cursor:pointer;transition:background .15s}.wc-prod button:hover{background:#4f46e5}`,
    ``
  ),
  c(
    "card-service",
    "Card — service",
    "cards",
    "Service offering with feature list and link.",
    `<div class="wc-svc">
  <span class="wc-svc-num">01</span>
  <h3>Brand identity</h3>
  <p>Strategy, visual language, and guidelines that scale across every touchpoint.</p>
  <a href="#">Explore →</a>
</div>`,
    `.wc-svc{padding:26px;border-top:2px solid #e2e8f0;transition:border-color .15s,background .15s}.wc-svc:hover{border-top-color:#6366f1;background:#f8fafc}.wc-svc-num{font-size:12px;font-weight:800;color:#94a3b8;letter-spacing:.1em}.wc-svc h3{margin:8px 0;font-size:18px;font-weight:700;color:#0f172a}.wc-svc p{margin:0 0 14px;font-size:13.5px;line-height:1.6;color:#64748b}.wc-svc a{font-size:13.5px;font-weight:700;color:#4f46e5;text-decoration:none}`,
    ``
  ),
  c(
    "card-icon",
    "Card — icon banner",
    "cards",
    "Large icon + heading + CTA, tinted background.",
    `<div class="wc-iconcard">
  <div class="wc-iconcard-ic"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
  <h3>Need a hand?</h3>
  <p>Our team replies within one business day.</p>
  <a href="#">Contact support</a>
</div>`,
    `.wc-iconcard{text-align:center;padding:34px 24px;border-radius:20px;background:linear-gradient(160deg,#f5f3ff,#eef2ff);border:1px solid #e0e7ff}.wc-iconcard-ic{display:inline-flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:16px;background:#fff;color:#6366f1;box-shadow:0 6px 18px rgba(99,102,241,.18)}.wc-iconcard h3{margin:16px 0 6px;font-size:18px;font-weight:800;color:#312e81}.wc-iconcard p{margin:0 0 16px;font-size:13.5px;color:#4338ca;opacity:.85}.wc-iconcard a{display:inline-block;font-size:13.5px;font-weight:800;color:#4f46e5;text-decoration:none}.wc-iconcard a:hover{text-decoration:underline}`,
    ``
  ),
  c(
    "card-image",
    "Card — image overlay",
    "cards",
    "Photo card with gradient overlay caption.",
    `<figure class="wc-imcard" style="background-image:linear-gradient(180deg,rgba(15,23,42,0) 40%,rgba(15,23,42,.78)),url(https://picsum.photos/480/360)"><figcaption><h3>Golden Gate at dawn</h3><span>San Francisco · Travel</span></figcaption></figure>`,
    `.wc-imcard{margin:0;height:230px;border-radius:18px;background-size:cover;background-position:center;display:flex;align-items:flex-end;overflow:hidden}.wc-imcard figcaption{padding:20px;color:#fff}.wc-imcard h3{margin:0;font-size:17px;font-weight:800}.wc-imcard span{font-size:12.5px;opacity:.85}`,
    ``
  ),
  c(
    "card-action",
    "Card — action row",
    "cards",
    "Compact clickable row with chevron.",
    `<button class="wc-actrow"><div><b>Export project</b><span>Download a zip of every file</span></div><span class="wc-actrow-chev">›</span></button>`,
    `.wc-actrow{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:16px 18px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;cursor:pointer;text-align:left;transition:border-color .15s,background .15s}.wc-actrow:hover{border-color:rgba(99,102,241,.5);background:#f8fafc}.wc-actrow b{display:block;font-size:14px;color:#0f172a}.wc-actrow span{font-size:12.5px;color:#64748b}.wc-actrow-chev{font-size:20px;color:#94a3b8;transition:transform .15s}.wc-actrow:hover .wc-actrow-chev{transform:translateX(3px);color:#6366f1}`,
    ``
  ),
];

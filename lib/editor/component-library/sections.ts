/**
 * Component library — sections: heroes, features, stats, CTA, pricing, FAQ, logos, team, footers.
 */
import type { LibraryComponent } from "./types";
import { c } from "./types";

export const SECTIONS: LibraryComponent[] = [
  c(
    "hero-split",
    "Hero — split",
    "sections",
    "Two-column hero: headline, copy, buttons and a visual panel.",
    `<div class="wc-hero-split">
  <div class="wc-hs-copy">
    <span class="wc-hs-eyebrow">New · Webpress 2.0</span>
    <h1>Build websites that feel <em>hand-crafted</em></h1>
    <p>Visual editing, real code, and AI agents — publish to a public URL in one click.</p>
    <div class="wc-hs-actions"><a class="wc-hs-btn wc-hs-btn-p" href="#">Start building</a><a class="wc-hs-btn" href="#">See templates</a></div>
  </div>
  <div class="wc-hs-visual">
    <div class="wc-hs-window"><div class="wc-hs-bar"><i></i><i></i><i></i></div><div class="wc-hs-screen"><span></span><span></span><span></span><span></span></div></div>
  </div>
</div>`,
    `.wc-hero-split{--p:#6366f1;display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:center;padding:72px 8px;max-width:1080px;margin:0 auto}.wc-hs-eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#4f46e5;background:rgba(99,102,241,.1);padding:6px 12px;border-radius:999px}.wc-hs-copy h1{margin:18px 0 14px;font-size:44px;line-height:1.08;letter-spacing:-.03em;font-weight:800;color:#0f172a}.wc-hs-copy h1 em{font-style:normal;background:linear-gradient(90deg,#6366f1,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent}.wc-hs-copy p{margin:0 0 26px;font-size:17px;line-height:1.65;color:#64748b;max-width:44ch}.wc-hs-actions{display:flex;gap:12px;flex-wrap:wrap}.wc-hs-btn{padding:13px 22px;border-radius:11px;font-weight:700;font-size:15px;text-decoration:none;border:1px solid #e2e8f0;color:#1e293b;transition:all .15s}.wc-hs-btn-p{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border-color:transparent;box-shadow:0 8px 22px rgba(99,102,241,.35)}.wc-hs-btn-p:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(99,102,241,.4)}.wc-hs-btn:hover{border-color:#6366f1;color:#4f46e5}.wc-hs-window{border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 30px 70px rgba(15,23,42,.14);background:#fff}.wc-hs-bar{display:flex;gap:6px;padding:11px 14px;background:#f8fafc;border-bottom:1px solid #eef2f7}.wc-hs-bar i{width:10px;height:10px;border-radius:50%;background:#fecaca}.wc-hs-bar i:nth-child(2){background:#fde68a}.wc-hs-bar i:nth-child(3){background:#bbf7d0}.wc-hs-screen{padding:22px;display:grid;gap:12px}.wc-hs-screen span{height:10px;border-radius:6px;background:#e2e8f0}.wc-hs-screen span:first-child{width:60%;height:16px;background:#c7d2fe}.wc-hs-screen span:nth-child(3){width:80%}.wc-hs-screen span:last-child{width:40%;height:30px;background:linear-gradient(90deg,#6366f1,#a855f7);border-radius:8px}@media (max-width:820px){.wc-hero-split{grid-template-columns:1fr;padding:48px 8px}.wc-hs-copy h1{font-size:34px}}`,
    ``
  ),
  c(
    "hero-center",
    "Hero — centered",
    "sections",
    "Centered headline, subcopy and pill CTAs.",
    `<div class="wc-hero-center">
  <span class="wc-hc-badge">✨ Now with AI agents</span>
  <h1>The simplest way to ship a website</h1>
  <p>Design visually, drop into code when you need it, and publish to a stable public URL — all in one tool.</p>
  <div class="wc-hc-actions"><a class="wc-hc-btn" href="#">Get started free</a><a class="wc-hc-btn wc-hc-ghost" href="#">Watch demo</a></div>
</div>`,
    `.wc-hero-center{text-align:center;padding:84px 16px;max-width:760px;margin:0 auto}.wc-hc-badge{display:inline-block;font-size:12.5px;font-weight:700;color:#4f46e5;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);padding:7px 14px;border-radius:999px;margin-bottom:20px}.wc-hero-center h1{margin:0 0 16px;font-size:48px;line-height:1.05;letter-spacing:-.035em;font-weight:800;color:#0f172a}.wc-hero-center p{margin:0 auto 30px;font-size:18px;line-height:1.6;color:#64748b;max-width:52ch}.wc-hc-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.wc-hc-btn{padding:13px 24px;border-radius:11px;background:#0f172a;color:#fff;font-weight:700;font-size:15px;text-decoration:none;transition:transform .15s,background .15s}.wc-hc-btn:hover{background:#1e293b;transform:translateY(-1px)}.wc-hc-ghost{background:transparent;color:#334155;border:1px solid #e2e8f0}.wc-hc-ghost:hover{background:#f8fafc;color:#0f172a}@media (max-width:640px){.wc-hero-center h1{font-size:34px}}`,
    ``
  ),
  c(
    "features-grid",
    "Features — grid",
    "sections",
    "Three-column feature grid.",
    `<div class="wc-featgrid">
  <h2>Everything you need to build</h2>
  <div class="wc-fg-grid">
    <div class="wc-fg-item"><b>Visual editor</b><p>Select, edit and reorder elements directly on the page.</p></div>
    <div class="wc-fg-item"><b>Real code</b><p>Full HTML, CSS and JS files you own and can export anytime.</p></div>
    <div class="wc-fg-item"><b>AI agents</b><p>Describe a change and review it as a diff before applying.</p></div>
    <div class="wc-fg-item"><b>One-click publish</b><p>Quality checks, build, and a stable public URL in seconds.</p></div>
    <div class="wc-fg-item"><b>Version history</b><p>Every meaningful edit snapshotted and restorable.</p></div>
    <div class="wc-fg-item"><b>Component library</b><p>100 pre-made blocks, ready to drop into any page.</p></div>
  </div>
</div>`,
    `.wc-featgrid{max-width:1080px;margin:0 auto;padding:64px 16px}.wc-featgrid h2{margin:0 0 32px;font-size:32px;font-weight:800;letter-spacing:-.02em;color:#0f172a;text-align:center}.wc-fg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}@media (max-width:820px){.wc-fg-grid{grid-template-columns:1fr 1fr}}@media (max-width:560px){.wc-fg-grid{grid-template-columns:1fr}}.wc-fg-item{padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;transition:transform .16s,box-shadow .16s}.wc-fg-item:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(15,23,42,.07)}.wc-fg-item b{display:block;font-size:16px;color:#0f172a;margin-bottom:8px}.wc-fg-item p{margin:0;font-size:13.5px;line-height:1.6;color:#64748b}`,
    ``
  ),
  c(
    "features-list",
    "Features — list",
    "sections",
    "Numbered feature list with big typography.",
    `<div class="wc-featlist">
  <div class="wc-fl-item"><span>01</span><div><h3>Inspect</h3><p>The agent reads your real files and design system before touching anything.</p></div></div>
  <div class="wc-fl-item"><span>02</span><div><h3>Draft</h3><p>Changes arrive as per-file diffs — nothing is written without your approval.</p></div></div>
  <div class="wc-fl-item"><span>03</span><div><h3>Apply</h3><p>Approve once and the edit is saved as a version you can roll back anytime.</p></div></div>
</div>`,
    `.wc-featlist{max-width:860px;margin:0 auto;padding:56px 16px}.wc-fl-item{display:flex;gap:24px;padding:26px 0;border-bottom:1px solid #e2e8f0}.wc-fl-item:last-child{border-bottom:0}.wc-fl-item span{font-size:13px;font-weight:800;color:#6366f1;background:rgba(99,102,241,.1);height:34px;min-width:34px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px}.wc-fl-item h3{margin:0 0 6px;font-size:20px;font-weight:700;color:#0f172a}.wc-fl-item p{margin:0;font-size:14.5px;line-height:1.65;color:#64748b}`,
    ``
  ),
  c(
    "stats-band",
    "Stats — band",
    "sections",
    "Four-key-number strip.",
    `<div class="wc-stats"><div><b>12k+</b><span>Teams</span></div><div><b>3.2M</b><span>Sites built</span></div><div><b>99.9%</b><span>Uptime</span></div><div><b>4.9/5</b><span>Rating</span></div></div>`,
    `.wc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:1080px;margin:0 auto;padding:40px 16px}@media (max-width:700px){.wc-stats{grid-template-columns:1fr 1fr}}.wc-stats div{text-align:center;padding:28px 16px;border-radius:18px;background:#fff;border:1px solid #e2e8f0}.wc-stats b{display:block;font-size:32px;font-weight:800;letter-spacing:-.02em;color:#0f172a}.wc-stats span{display:block;margin-top:6px;font-size:13px;color:#64748b}`,
    ``
  ),
  c(
    "cta-banner",
    "CTA — banner",
    "sections",
    "Gradient banner with headline and button.",
    `<div class="wc-cta">
  <div><h2>Ready to publish your site?</h2><p>Create a free project and be live in under a minute.</p></div>
  <a href="#">Start now</a>
</div>`,
    `.wc-cta{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding:36px 40px;border-radius:22px;background:linear-gradient(120deg,#4f46e5,#7c3aed 60%,#a855f7);color:#fff;max-width:1080px;margin:0 auto;box-shadow:0 20px 50px rgba(124,58,237,.3)}.wc-cta h2{margin:0 0 6px;font-size:26px;font-weight:800;letter-spacing:-.01em}.wc-cta p{margin:0;font-size:14.5px;opacity:.85}.wc-cta a{background:#fff;color:#5b21b6;font-weight:800;font-size:15px;padding:13px 24px;border-radius:11px;text-decoration:none;transition:transform .15s}.wc-cta a:hover{transform:translateY(-1px)}@media (max-width:640px){.wc-cta{padding:28px 24px;justify-content:center;text-align:center}}`,
    ``
  ),
  c(
    "testimonials-row",
    "Testimonials — row",
    "sections",
    "Three testimonial cards in a row.",
    `<div class="wc-trow">
  <div class="wc-trow-card"><span>★★★★★</span><p>"The fastest way we've shipped a marketing site — period."</p><footer><b>Mia Chen</b><i>VP Marketing, Lumen</i></footer></div>
  <div class="wc-trow-card"><span>★★★★★</span><p>"Finally a builder that doesn't fight us for the code."</p><footer><b>Omar Haddad</b><i>CTO, Relay</i></footer></div>
  <div class="wc-trow-card"><span>★★★★★</span><p>"Published in one click. Our clients love the public links."</p><footer><b>Jon Bell</b><i>Freelance designer</i></footer></div>
</div>`,
    `.wc-trow{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1080px;margin:0 auto;padding:56px 16px}@media (max-width:820px){.wc-trow{grid-template-columns:1fr}}.wc-trow-card{padding:26px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;display:grid;gap:14px}.wc-trow-card span{color:#f59e0b;letter-spacing:2px;font-size:13px}.wc-trow-card p{margin:0;font-size:15px;line-height:1.6;color:#1e293b;font-weight:500}.wc-trow-card footer b{display:block;font-size:13.5px;color:#0f172a}.wc-trow-card footer i{font-style:normal;font-size:12px;color:#64748b}`,
    ``
  ),
  c(
    "faq-accordion",
    "FAQ — accordion",
    "sections",
    "Collapsible question list (js).",
    `<div class="wc-faq">
  <h2>Frequently asked questions</h2>
  <div class="wc-faq-item"><button class="wc-faq-q" aria-expanded="false">Do I own my code?<span>+</span></button><div class="wc-faq-a"><p>Yes — you can export every file as a zip and host it anywhere, anytime.</p></div></div>
  <div class="wc-faq-item"><button class="wc-faq-q" aria-expanded="false">Can I use my own domain?<span>+</span></button><div class="wc-faq-a"><p>Custom domains are on the roadmap and will be a Pro feature.</p></div></div>
  <div class="wc-faq-item"><button class="wc-faq-q" aria-expanded="false">How does publishing work?<span>+</span></button><div class="wc-faq-a"><p>One click runs quality checks, builds a static export, and gives you a stable public URL.</p></div></div>
</div>`,
    `.wc-faq{max-width:720px;margin:0 auto;padding:56px 16px}.wc-faq h2{margin:0 0 24px;font-size:30px;font-weight:800;letter-spacing:-.02em;color:#0f172a;text-align:center}.wc-faq-item{border-bottom:1px solid #e2e8f0}.wc-faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 4px;background:none;border:0;font-size:16px;font-weight:700;color:#0f172a;cursor:pointer;text-align:left}.wc-faq-q span{font-size:20px;color:#94a3b8;transition:transform .2s;font-weight:400}.wc-faq-item.open .wc-faq-q span{transform:rotate(45deg)}.wc-faq-a{max-height:0;overflow:hidden;transition:max-height .25s ease}.wc-faq-item.open .wc-faq-a{max-height:200px}.wc-faq-a p{margin:0;padding:0 4px 20px;font-size:14px;line-height:1.65;color:#64748b}`,
    `document.querySelectorAll(".wc-faq-q").forEach((q)=>q.addEventListener("click",()=>{const it=q.closest(".wc-faq-item");const open=it.classList.toggle("open");q.setAttribute("aria-expanded",String(open));}));`
  ),
  c(
    "pricing-table",
    "Pricing — table",
    "sections",
    "Three-column pricing comparison.",
    `<div class="wc-ptable">
  <div class="wc-pt-col"><b>Starter</b><span class="wc-pt-price">$19</span><ul><li>3 projects</li><li>Community support</li><li>Webpress subdomain</li></ul><a href="#">Choose</a></div>
  <div class="wc-pt-col wc-pt-pop"><b>Pro</b><span class="wc-pt-price">$49</span><ul><li>Unlimited projects</li><li>Custom domains</li><li>Advanced AI credits</li></ul><a href="#">Choose</a></div>
  <div class="wc-pt-col"><b>Team</b><span class="wc-pt-price">$99</span><ul><li>Collaboration</li><li>Shared workspace</li><li>Priority support</li></ul><a href="#">Contact us</a></div>
</div>`,
    `.wc-ptable{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:stretch;max-width:1000px;margin:0 auto;padding:56px 16px}@media (max-width:760px){.wc-ptable{grid-template-columns:1fr}}.wc-pt-col{padding:28px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;display:flex;flex-direction:column}.wc-pt-col b{font-size:15px;color:#64748b}.wc-pt-price{font-size:38px;font-weight:800;letter-spacing:-.02em;color:#0f172a;margin:10px 0 4px}.wc-pt-col ul{list-style:none;margin:16px 0 22px;padding:0;display:grid;gap:9px}.wc-pt-col li{font-size:13.5px;color:#475569;padding-left:22px;position:relative}.wc-pt-col li::before{content:"✓";position:absolute;left:0;color:#6366f1;font-weight:800}.wc-pt-col a{margin-top:auto;text-align:center;padding:11px;border-radius:10px;border:1px solid #c7d2fe;color:#4f46e5;font-weight:700;font-size:14px;text-decoration:none}.wc-pt-col a:hover{background:#6366f1;color:#fff;border-color:#6366f1}.wc-pt-pop{background:linear-gradient(160deg,#312e81,#4338ca);border-color:transparent;color:#fff;transform:scale(1.03);box-shadow:0 20px 44px rgba(67,56,202,.3)}.wc-pt-pop b{color:#c7d2fe}.wc-pt-pop .wc-pt-price{color:#fff}.wc-pt-pop li{color:#e0e7ff}.wc-pt-pop li::before{color:#a5b4fc}.wc-pt-pop a{background:#fff;color:#4338ca;border-color:transparent}`,
    ``
  ),
  c(
    "logo-cloud",
    "Logos — cloud",
    "sections",
    "Centered logo row with grayscale hover.",
    `<div class="wc-logos"><span>Trusted by teams at</span><div><b>NORTHWIND</b><b>LUMEN</b><b>RELAY</b><b>BASEFORM</b><b>HALCYON</b></div></div>`,
    `.wc-logos{max-width:1000px;margin:0 auto;padding:44px 16px;text-align:center}.wc-logos span{display:block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8;margin-bottom:22px}.wc-logos div{display:flex;flex-wrap:wrap;justify-content:center;gap:22px 44px}.wc-logos b{font-size:17px;letter-spacing:.08em;color:#cbd5e1;font-weight:800;transition:color .15s;cursor:default}.wc-logos b:hover{color:#475569}`,
    ``
  ),
  c(
    "team-grid",
    "Team — grid",
    "sections",
    "Photo grid of team members with roles.",
    `<div class="wc-team"><h2>Meet the team</h2><div>
  <figure><img src="https://i.pravatar.cc/200?img=5" alt="Ana" /><figcaption><b>Ana Sousa</b><span>CEO</span></figcaption></figure>
  <figure><img src="https://i.pravatar.cc/200?img=13" alt="Leo" /><figcaption><b>Leo Park</b><span>CTO</span></figcaption></figure>
  <figure><img src="https://i.pravatar.cc/200?img=33" alt="Ines" /><figcaption><b>Ines Costa</b><span>Design</span></figcaption></figure>
  <figure><img src="https://i.pravatar.cc/200?img=51" alt="Mark" /><figcaption><b>Mark Holt</b><span>Growth</span></figcaption></figure>
</div></div>`,
    `.wc-team{max-width:1000px;margin:0 auto;padding:56px 16px}.wc-team h2{margin:0 0 28px;font-size:30px;font-weight:800;letter-spacing:-.02em;color:#0f172a;text-align:center}.wc-team>div{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}@media (max-width:760px){.wc-team>div{grid-template-columns:1fr 1fr}}.wc-team figure{margin:0;border-radius:16px;overflow:hidden;background:#fff;border:1px solid #e2e8f0}.wc-team img{width:100%;height:190px;object-fit:cover;display:block}.wc-team figcaption{padding:14px 16px}.wc-team b{display:block;font-size:14.5px;color:#0f172a}.wc-team span{font-size:12.5px;color:#64748b}`,
    ``
  ),
  c(
    "gallery-grid",
    "Gallery — grid",
    "sections",
    "Responsive masonry-style image grid.",
    `<div class="wc-gallery">
  <img src="https://picsum.photos/400/520?1" alt="Gallery 1" />
  <img src="https://picsum.photos/400/300?2" alt="Gallery 2" />
  <img src="https://picsum.photos/400/400?3" alt="Gallery 3" />
  <img src="https://picsum.photos/400/340?4" alt="Gallery 4" />
  <img src="https://picsum.photos/400/560?5" alt="Gallery 5" />
  <img src="https://picsum.photos/400/320?6" alt="Gallery 6" />
</div>`,
    `.wc-gallery{columns:3;gap:14px;max-width:1080px;margin:0 auto;padding:56px 16px}@media (max-width:820px){.wc-gallery{columns:2}}@media (max-width:540px){.wc-gallery{columns:1}}.wc-gallery img{width:100%;border-radius:14px;margin-bottom:14px;display:block;transition:transform .2s}.wc-gallery img:hover{transform:scale(1.02)}`,
    ``
  ),
  c(
    "contact-section",
    "Contact — section",
    "sections",
    "Contact split: details + form (js submit).",
    `<div class="wc-contact">
  <div class="wc-contact-info"><h2>Talk to us</h2><p>hello@webpress.app</p><p>+1 (555) 013-4455</p><p>Mon–Fri, 9am–6pm</p></div>
  <form class="wc-contact-form"><input placeholder="Your email" type="email" required /><textarea placeholder="Message" rows="4" required></textarea><button type="submit">Send message</button></form>
</div>`,
    `.wc-contact{display:grid;grid-template-columns:1fr 1.2fr;gap:44px;max-width:960px;margin:0 auto;padding:64px 16px}@media (max-width:760px){.wc-contact{grid-template-columns:1fr}}.wc-contact-info h2{margin:0 0 14px;font-size:30px;font-weight:800;letter-spacing:-.02em;color:#0f172a}.wc-contact-info p{margin:0 0 10px;font-size:15px;color:#475569}.wc-contact-form{display:grid;gap:12px}.wc-contact-form input,.wc-contact-form textarea{padding:12px 14px;border:1px solid #e2e8f0;border-radius:11px;font-size:14px;font-family:inherit;resize:vertical}.wc-contact-form input:focus,.wc-contact-form textarea:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-contact-form button{padding:13px;border:0;border-radius:11px;background:#0f172a;color:#fff;font-weight:700;font-size:14.5px;cursor:pointer;transition:background .15s}.wc-contact-form button:hover{background:#4f46e5}`,
    `document.querySelectorAll(".wc-contact-form").forEach((f)=>f.addEventListener("submit",(e)=>{e.preventDefault();const b=f.querySelector("button");const t=b.textContent;b.textContent="Sent ✓";setTimeout(()=>{b.textContent=t;f.reset();},1800);}));`
  ),
  c(
    "newsletter",
    "Newsletter — band",
    "sections",
    "Email capture with success feedback (js).",
    `<div class="wc-nl"><div><h3>Get product updates</h3><p>One email a month. No spam, unsubscribe anytime.</p></div><form class="wc-nl-form"><input type="email" required placeholder="you@example.com" /><button type="submit">Subscribe</button></form></div>`,
    `.wc-nl{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;max-width:1080px;margin:0 auto;padding:36px 40px;border-radius:22px;background:#f8fafc;border:1px solid #e2e8f0}.wc-nl h3{margin:0 0 4px;font-size:20px;font-weight:800;color:#0f172a}.wc-nl p{margin:0;font-size:13.5px;color:#64748b}.wc-nl-form{display:flex;gap:10px}.wc-nl-form input{padding:12px 14px;border:1px solid #e2e8f0;border-radius:11px;font-size:14px;min-width:240px}.wc-nl-form input:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}.wc-nl-form button{padding:12px 20px;border:0;border-radius:11px;background:#6366f1;color:#fff;font-weight:700;font-size:14px;cursor:pointer;transition:background .15s}.wc-nl-form button:hover{background:#4f46e5}@media (max-width:560px){.wc-nl-form{width:100%}.wc-nl-form input{flex:1;min-width:0}}`,
    `document.querySelectorAll(".wc-nl-form").forEach((f)=>f.addEventListener("submit",(e)=>{e.preventDefault();const b=f.querySelector("button");b.textContent="Subscribed ✓";b.style.background="#16a34a";f.querySelector("input").value="";setTimeout(()=>{b.textContent="Subscribe";b.style.background="";},2200);}));`
  ),
  c(
    "footer-simple",
    "Footer — simple",
    "sections",
    "Minimal footer with links.",
    `<footer class="wc-footer"><div class="wc-footer-top"><b>Webpress</b><nav><a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a><a href="#">Blog</a><a href="#">Contact</a></nav></div><p class="wc-footer-copy">© 2026 Webpress. All rights reserved.</p></footer>`,
    `.wc-footer{border-top:1px solid #e2e8f0;padding:34px 24px;max-width:1080px;margin:40px auto 0}.wc-footer-top{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.wc-footer-top b{font-size:17px;color:#0f172a}.wc-footer nav{display:flex;gap:20px;flex-wrap:wrap}.wc-footer nav a{font-size:13.5px;color:#64748b;text-decoration:none}.wc-footer nav a:hover{color:#4f46e5}.wc-footer-copy{margin:26px 0 0;font-size:12.5px;color:#94a3b8}`,
    ``
  ),
  c(
    "steps",
    "Steps — how it works",
    "sections",
    "Three-step numbered process.",
    `<div class="wc-steps">
  <div class="wc-step"><span class="wc-step-n">1</span><h3>Create</h3><p>Pick a template or start from a blank page.</p></div>
  <div class="wc-step"><span class="wc-step-n">2</span><h3>Build</h3><p>Edit visually or in code, with AI help when stuck.</p></div>
  <div class="wc-step"><span class="wc-step-n">3</span><h3>Publish</h3><p>One click → a stable public URL, forever yours.</p></div>
</div>`,
    `.wc-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1000px;margin:0 auto;padding:56px 16px;position:relative}@media (max-width:760px){.wc-steps{grid-template-columns:1fr}}.wc-step{text-align:center;padding:0 10px}.wc-step-n{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:#6366f1;color:#fff;font-weight:800;font-size:17px;box-shadow:0 8px 20px rgba(99,102,241,.3)}.wc-step h3{margin:16px 0 6px;font-size:17px;font-weight:700;color:#0f172a}.wc-step p{margin:0;font-size:13.5px;line-height:1.6;color:#64748b}`,
    ``
  ),
  c(
    "timeline",
    "Timeline",
    "sections",
    "Vertical timeline with dots.",
    `<div class="wc-timeline">
  <div class="wc-tl-item"><i></i><div><time>2024</time><h3>Founded</h3><p>Webpress starts with a simple mission: websites you actually own.</p></div></div>
  <div class="wc-tl-item"><i></i><div><time>2025</time><h3>AI agents ship</h3><p>Sub-agent QA, draft diffs, and one-click publishing.</p></div></div>
  <div class="wc-tl-item"><i></i><div><time>2026</time><h3>100 components</h3><p>A full pre-made library lands in the editor.</p></div></div>
</div>`,
    `.wc-timeline{max-width:640px;margin:0 auto;padding:48px 16px}.wc-tl-item{position:relative;padding:0 0 30px 36px;border-left:2px solid #e2e8f0;margin-left:10px}.wc-tl-item:last-child{border-left-color:transparent;padding-bottom:0}.wc-tl-item i{position:absolute;left:-8px;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #6366f1}.wc-tl-item time{display:block;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6366f1}.wc-tl-item h3{margin:6px 0 4px;font-size:16px;font-weight:700;color:#0f172a}.wc-tl-item p{margin:0;font-size:13.5px;line-height:1.6;color:#64748b}`,
    ``
  ),
  c(
    "marquee",
    "Marquee — logo strip",
    "sections",
    "Infinite scrolling ticker (js).",
    `<div class="wc-marquee"><div class="wc-mq-track"><span>NEXTJS</span><span>REACT</span><span>TYPESCRIPT</span><span>TAILWIND</span><span>SUPABASE</span><span>VERCEL</span><span>NEXTJS</span><span>REACT</span><span>TYPESCRIPT</span><span>TAILWIND</span></div></div>`,
    `.wc-marquee{overflow:hidden;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:20px 0}.wc-mq-track{display:flex;gap:56px;width:max-content;animation:wc-scroll 22s linear infinite}.wc-marquee:hover .wc-mq-track{animation-play-state:paused}.wc-mq-track span{font-size:18px;font-weight:800;letter-spacing:.1em;color:#cbd5e1;white-space:nowrap}@keyframes wc-scroll{to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.wc-mq-track{animation:none;flex-wrap:wrap}}`,
    ``
  ),
];

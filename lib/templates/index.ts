import type { FileEntry } from "@/lib/editor/fs";

export interface TemplateDef {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  files: FileEntry[];
  pages: { path: string; title: string; description: string }[];
}

const saasCss = String.raw`/* SaaS starter — Webpress template */
:root{--bg:#0a0a0f;--fg:#f4f4f5;--muted:#a1a1aa;--border:#27272a;--accent:#6366f1;--accent-2:#10b981;--max:1120px;--radius:14px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
nav{position:sticky;top:0;z-index:50;background:rgba(10,10,15,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
nav .container{display:flex;align-items:center;justify-content:space-between;height:64px}
.brand{font-weight:700;font-size:1.05rem;letter-spacing:-.02em}
.brand span{color:var(--accent)}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{color:var(--muted);font-size:.92rem;transition:color .15s}
.nav-links a:hover{color:var(--fg)}
.nav-cta{display:flex;gap:12px;align-items:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;padding:10px 18px;font-size:.92rem;font-weight:600;border:1px solid transparent;cursor:pointer;transition:transform .15s,background .15s,border-color .15s}
.btn:hover{transform:translateY(-1px)}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover{background:#4f46e5}
.btn-ghost{border-color:var(--border);color:var(--fg);background:transparent}
.btn-ghost:hover{border-color:#3f3f46}
.hero{padding:120px 0 88px;text-align:center}
.hero .badge{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:999px;padding:6px 14px;font-size:.8rem;color:var(--muted);margin-bottom:28px}
.hero .badge .dot{width:7px;height:7px;border-radius:50%;background:var(--accent-2)}
.hero h1{font-size:clamp(2.4rem,6vw,4.2rem);line-height:1.08;letter-spacing:-.035em;font-weight:800;margin-bottom:24px}
.hero h1 .grad{background:linear-gradient(90deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p.lead{color:var(--muted);font-size:clamp(1.05rem,2vw,1.25rem);max-width:620px;margin:0 auto 36px}
.hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.hero-meta{margin-top:56px;color:var(--muted);font-size:.85rem}
.hero-meta .avatars{display:flex;justify-content:center;gap:-8px;margin-bottom:10px}
.hero-meta .avatars span{width:26px;height:26px;border-radius:50%;border:2px solid var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:.6rem;background:linear-gradient(135deg,var(--accent),var(--accent-2));margin-left:-6px}
.hero-meta .avatars span:first-child{margin-left:0}
section{padding:88px 0}
section.alt{background:#0d0d14;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.sec-head{text-align:center;max-width:640px;margin:0 auto 56px}
.sec-head .kicker{color:var(--accent);font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px}
.sec-head h2{font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.03em;font-weight:800;margin-bottom:14px}
.sec-head p{color:var(--muted)}
.grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.card{border:1px solid var(--border);border-radius:var(--radius);padding:28px;background:#111118;transition:border-color .2s,transform .2s}
.card:hover{border-color:#3f3f46;transform:translateY(-3px)}
.card .icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:rgba(99,102,241,.15);color:var(--accent);margin-bottom:18px}
.card h3{font-size:1.05rem;margin-bottom:8px}
.card p{color:var(--muted);font-size:.92rem}
.pricing .price{font-size:2.6rem;font-weight:800;letter-spacing:-.03em;margin:16px 0 4px}
.pricing .price small{font-size:.9rem;color:var(--muted);font-weight:400}
.pricing ul{list-style:none;margin:22px 0;color:var(--muted);font-size:.92rem}
.pricing ul li{padding:7px 0;display:flex;gap:10px;align-items:center}
.pricing ul li::before{content:"✓";color:var(--accent-2);font-weight:700}
.card.highlight{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent),0 20px 60px -20px rgba(99,102,241,.35)}
.card.highlight .badge-pop{display:inline-block;background:var(--accent);color:#fff;font-size:.72rem;font-weight:700;border-radius:999px;padding:3px 10px;margin-bottom:10px}
.testimonials{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.t-card{border:1px solid var(--border);border-radius:var(--radius);padding:26px}
.t-card p{font-size:.95rem;margin-bottom:18px}
.t-card .who{display:flex;align-items:center;gap:12px}
.t-card .who .av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem}
.t-card .who .nm{font-weight:600;font-size:.9rem}
.t-card .who .rl{color:var(--muted);font-size:.8rem}
.faq{max-width:760px;margin:0 auto}
details{border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:12px;background:#111118}
details summary{cursor:pointer;font-weight:600;list-style:none;display:flex;justify-content:space-between;align-items:center}
details summary::after{content:"+";color:var(--muted);font-size:1.2rem}
details[open] summary::after{content:"–"}
details p{color:var(--muted);margin-top:12px;font-size:.92rem}
.cta{text-align:center;padding:96px 0}
.cta h2{font-size:clamp(1.8rem,4vw,2.8rem);letter-spacing:-.03em;font-weight:800;margin-bottom:16px}
.cta p{color:var(--muted);margin-bottom:32px;max-width:520px;margin-left:auto;margin-right:auto}
footer{border-top:1px solid var(--border);padding:48px 0 32px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;margin-bottom:40px}
.footer-grid h4{font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:14px}
.footer-grid a{display:block;color:var(--muted);font-size:.9rem;padding:4px 0}
.footer-grid a:hover{color:var(--fg)}
.copy{color:#71717a;font-size:.82rem;text-align:center;border-top:1px solid var(--border);padding-top:24px}
.nav-toggle{display:none;background:none;border:1px solid var(--border);color:var(--fg);border-radius:8px;width:38px;height:38px;font-size:1rem;cursor:pointer}
.tiers{display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));align-items:stretch}
@media (max-width:768px){
  .nav-links{display:none;position:absolute;top:64px;left:0;right:0;background:var(--bg);border-bottom:1px solid var(--border);flex-direction:column;padding:16px 24px;gap:16px;align-items:flex-start}
  .nav-links.open{display:flex}
  .nav-toggle{display:inline-flex;align-items:center;justify-content:center}
  .hero{padding:80px 0 64px}
  section{padding:64px 0}
  .footer-grid{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media (min-width:1441px){.hero{padding:150px 0 100px}}
`;

const appJs = String.raw`// Webpress SaaS starter
(function(){
  var toggle=document.querySelector(".nav-toggle");
  var links=document.querySelector(".nav-links");
  if(toggle&&links){toggle.addEventListener("click",function(){links.classList.toggle("open");toggle.setAttribute("aria-expanded",links.classList.contains("open")?"true":"false");});}
  var mq=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(mq.matches)return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll(".card,.t-card,details").forEach(function(el,i){el.style.transitionDelay=((i%4)*40)+"ms";io.observe(el);});
  document.documentElement.classList.add("js-anim");
})();
`;

const saasHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scribe — Notes that think</title>
<meta name="description" content="Scribe is an AI note-taking app that organizes, connects and summarizes your ideas automatically.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip-link" href="#main" style="position:absolute;left:-999px;top:0;background:#6366f1;color:#fff;padding:10px 16px;border-radius:0 0 10px 0;z-index:99">Skip to content</a>
<nav aria-label="Main">
  <div class="container">
    <a class="brand" href="index.html">Scribe<span>.</span></a>
    <div class="nav-links" id="navLinks">
      <a href="#features">Features</a>
      <a href="pricing.html">Pricing</a>
      <a href="#testimonials">Reviews</a>
      <a href="#faq">FAQ</a>
    </div>
    <div class="nav-cta">
      <a class="btn btn-primary" href="pricing.html">Get started</a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
    </div>
  </div>
</nav>

<header class="hero" id="main">
  <div class="container">
    <span class="badge"><span class="dot"></span> v2.0 — smarter notes, zero effort</span>
    <h1>Notes that <span class="grad">organize themselves</span></h1>
    <p class="lead">Scribe turns messy notes into a connected knowledge base. Capture anything, and let AI link, summarize and resurface what matters.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="pricing.html">Start free — no card</a>
      <a class="btn btn-ghost" href="#features">See how it works</a>
    </div>
    <div class="hero-meta">
      <div class="avatars"><span>AN</span><span>JK</span><span>RS</span><span>ML</span><span>+2k</span></div>
      <div>Trusted by 2,400+ writers, students and teams</div>
    </div>
  </div>
</header>

<section id="features">
  <div class="container">
    <div class="sec-head">
      <div class="kicker">Features</div>
      <h2>Everything you need to think clearly</h2>
      <p>Three ideas, one app: capture fast, connect everything, and find it again in seconds.</p>
    </div>
    <div class="grid">
      <article class="card"><div class="icon">⚡</div><h3>Instant capture</h3><p>Type, clip or speak. Notes save locally-first and sync across every device in under a second.</p></article>
      <article class="card"><div class="icon">🔗</div><h3>Auto-linking</h3><p>Scribe detects related ideas and links them for you — a knowledge graph that builds itself.</p></article>
      <article class="card"><div class="icon">🧠</div><h3>Weekly digests</h3><p>A tailored summary of what you learned, what's stale, and what deserves a second look.</p></article>
      <article class="card"><div class="icon">🔍</div><h3>Semantic search</h3><p>Ask in plain language. "Where did I write about the solar tax credit?" Just works.</p></article>
      <article class="card"><div class="icon">🤝</div><h3>Shared workspaces</h3><p>Publish any note or vault to a public, beautifully formatted page with one click.</p></article>
      <article class="card"><div class="icon">🔒</div><h3>Private by default</h3><p>End-to-end encrypted. Even we can't read your notes — features run on your device.</p></article>
    </div>
  </div>
</section>

<section class="alt">
  <div class="container">
    <div class="sec-head">
      <div class="kicker">Pricing</div>
      <h2>Simple pricing that scales with you</h2>
      <p>Start free. Upgrade when your thinking gets serious.</p>
    </div>
    <div class="tiers">
      <article class="card pricing">
        <h3>Free</h3>
        <div class="price">$0<small>/mo</small></div>
        <ul><li>200 notes</li><li>3 linked spaces</li><li>Semantic search</li><li>All devices</li></ul>
        <a class="btn btn-ghost" href="#">Start free</a>
      </article>
      <article class="card pricing highlight">
        <span class="badge-pop">Most popular</span>
        <h3>Plus</h3>
        <div class="price">$9<small>/mo</small></div>
        <ul><li>Unlimited notes</li><li>Weekly AI digests</li><li>Public pages &amp; sharing</li><li>AI assistance, 10k msgs/mo</li></ul>
        <a class="btn btn-primary" href="#">Try 14 days free</a>
      </article>
      <article class="card pricing">
        <h3>Team</h3>
        <div class="price">$24<small>/user/mo</small></div>
        <ul><li>Everything in Plus</li><li>Shared workspaces</li><li>Admin controls &amp; export</li><li>Priority support</li></ul>
        <a class="btn btn-ghost" href="#">Contact sales</a>
      </article>
    </div>
  </div>
</section>

<section id="testimonials">
  <div class="container">
    <div class="sec-head">
      <div class="kicker">Reviews</div>
      <h2>Loved by people who think a lot</h2>
    </div>
    <div class="testimonials">
      <article class="t-card"><p>"I replaced five different apps with Scribe. The auto-linking alone is worth it — my research vault finally makes sense."</p><div class="who"><div class="av">AN</div><div><div class="nm">Amira N.</div><div class="rl">PhD researcher</div></div></div></article>
      <article class="t-card"><p>"The weekly digest surfaces things I'd forgotten I wrote down. It's like a second brain that actually works."</p><div class="who"><div class="av">JK</div><div><div class="nm">Jonas K.</div><div class="rl">Product designer</div></div></div></article>
      <article class="t-card"><p>"We run our whole editorial process in Scribe workspaces. Publishing notes as pages is magic for our workflow."</p><div class="who"><div class="av">RS</div><div><div class="nm">Rosa S.</div><div class="rl">Newsletter editor</div></div></div></article>
    </div>
  </div>
</section>

<section class="alt" id="faq">
  <div class="container">
    <div class="sec-head"><div class="kicker">FAQ</div><h2>Questions, answered</h2></div>
    <div class="faq">
      <details open><summary>Is my data really private?</summary><p>Yes. Notes are end-to-end encrypted on your devices. AI features use an encrypted, ephemeral pipeline and are disabled in Private mode.</p></details>
      <details><summary>Can I import from Notion, Obsidian or Apple Notes?</summary><p>One-click importers are available for Notion, Obsidian, Apple Notes, Evernote and Markdown folders.</p></details>
      <details><summary>What does "AI assistance" include?</summary><p>Auto-linking, summaries, digests, semantic search and conversational Q&A over your own notes — capped per plan with transparent quotas.</p></details>
      <details><summary>Do you offer student or non-profit discounts?</summary><p>Yes — 50% off any paid plan with proof of enrollment or non-profit status.</p></details>
    </div>
  </div>
</section>

<section class="cta">
  <div class="container">
    <h2>Your best thinking, finally connected</h2>
    <p>Join the people who stopped losing their ideas. Free forever for your first 200 notes.</p>
    <div class="hero-actions"><a class="btn btn-primary" href="pricing.html">Start free</a><a class="btn btn-ghost" href="#features">Learn more</a></div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html">Scribe<span>.</span></a>
        <p style="color:var(--muted);font-size:.9rem;margin-top:12px">Notes that organize themselves.</p>
      </div>
      <div><h4>Product</h4><a href="#features">Features</a><a href="pricing.html">Pricing</a><a href="#faq">FAQ</a></div>
      <div><h4>Company</h4><a href="#">About</a><a href="#">Blog</a><a href="#">Careers</a></div>
      <div><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a></div>
    </div>
    <div class="copy">© 2026 Scribe Labs. Made for thinkers.</div>
  </div>
</footer>
<script src="js/app.js" defer></script>
</body>
</html>`;

export const TEMPLATES: TemplateDef[] = [
  {
    id: "saas",
    name: "SaaS Landing",
    category: "SaaS",
    description: "Modern dark SaaS landing page with pricing, testimonials and FAQ.",
    tags: ["dark", "modern", "landing", "pricing"],
    pages: [
      { path: "/", title: "Scribe — Notes that think", description: "Scribe is an AI note-taking app that organizes, connects and summarizes your ideas automatically." },
      { path: "/pricing", title: "Pricing — Scribe", description: "Simple pricing that scales with you. Start free, upgrade when your thinking gets serious." },
    ],
    files: [
      { path: "index.html", content: saasHome, kind: "file", mime: "text/html" },
      {
        path: "pricing.html",
        content: saasHome
          .replace(/<title>.*?<\/title>/, "<title>Pricing — Scribe</title>")
          .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Simple pricing that scales with you. Start free, upgrade when your thinking gets serious.">')
          .replace(/<header class="hero"[\s\S]*?<\/header>/, `<header class="hero" id="main"><div class="container"><span class="badge"><span class="dot"></span> Pricing</span><h1>Simple pricing, <span class="grad">zero lock-in</span></h1><p class="lead">Every plan includes automatic syncing, semantic search and world-class privacy. Cancel anytime.</p><div class="hero-actions"><a class="btn btn-primary" href="#">Try Plus free for 14 days</a></div></div></header>`)
          .replace(/<section class="alt"[\s\S]*?<section class="cta">/, ""),
        kind: "file",
        mime: "text/html",
      },
      { path: "css/style.css", content: saasCss, kind: "file", mime: "text/css" },
      { path: "js/app.js", content: appJs, kind: "file", mime: "text/javascript" },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    category: "Portfolio",
    description: "Clean light portfolio for designers & developers with a projects grid and about page.",
    tags: ["light", "minimal", "portfolio", "personal"],
    pages: [
      { path: "/", title: "Lina Rosh — Designer & Developer", description: "Portfolio of Lina Rosh — product designer and front-end developer crafting clean, human interfaces." },
      { path: "/work", title: "Selected Work — Lina Rosh", description: "Selected projects by Lina Rosh: design systems, product design and front-end builds." },
      { path: "/about", title: "About — Lina Rosh", description: "Lina Rosh is a product designer and front-end developer based in Lisbon." },
    ],
    files: [
      {
        path: "index.html",
        content: String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lina Rosh — Designer & Developer</title>
<meta name="description" content="Portfolio of Lina Rosh — product designer and front-end developer crafting clean, human interfaces.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a href="#main" class="skip" style="position:absolute;left:-9999px">Skip to content</a>
<nav class="top" aria-label="Main">
  <div class="inner">
    <a class="logo" href="index.html">lina<span>.</span>rosh</a>
    <div class="links">
      <a href="index.html">Home</a>
      <a href="work.html">Work</a>
      <a href="about.html">About</a>
    </div>
    <a class="btn small" href="mailto:hello@lina.rosh">hello@lina.rosh</a>
  </div>
</nav>

<header class="intro" id="main">
  <p class="eyebrow">Product designer · developer · Lisbon</p>
  <h1>Crafting <em>calm, useful</em> software — from first sketch to shipped pixels.</h1>
  <p class="lede">I'm Lina. I've spent a decade designing and building products for startups, studios and the occasional museum. Currently freelance.</p>
  <div class="cta-row">
    <a class="btn" href="work.html#projects">See selected work</a>
    <a class="btn ghost" href="about.html">More about me</a>
  </div>
</header>

<main>
  <section class="now" aria-label="Focus areas">
    <div class="inner">
      <h2>What I do</h2>
      <div class="three">
        <article><h3>Product design</h3><p>Interfaces, design systems and prototypes that balance brand, business and usability.</p></article>
        <article><h3>Front-end build</h3><p>Semantic, performant HTML/CSS/JS and React — design that ships without excuses.</p></article>
        <article><h3>Design systems</h3><p>Token-led systems with living documentation teams actually use.</p></article>
      </div>
    </div>
  </section>

  <section class="featured" aria-label="Featured work">
    <div class="inner">
      <div class="grid2">
        <article class="proj">
          <div class="thumb t1">Fieldnotes</div>
          <h3>Fieldnotes — reading app for slow readers</h3>
          <p>Design system + iOS app + marketing site. 4.8★ on the App Store.</p>
          <a href="work.html#fieldnotes">Case study →</a>
        </article>
        <article class="proj">
          <div class="thumb t2">Orbit</div>
          <h3>Orbit — analytics for design teams</h3>
          <p>End-to-end product design for a data-heavy startup, seeded with 200+ components.</p>
          <a href="work.html#orbit">Case study →</a>
        </article>
      </div>
    </div>
  </section>

  <section class="quote" aria-label="Testimonial">
    <blockquote>
      "Lina is the rare designer who argues with engineers about data structures because she wants the UX to be honest. The result was a product our users described as *calm*."
      <footer>— Marta Vieira, VP Product, Orbit</footer>
    </blockquote>
  </section>
</main>

<footer class="foot">
  <div class="inner">
    <p>© 2026 Lina Rosh. Set in system type, zero trackers.</p>
    <div class="links"><a href="mailto:hello@lina.rosh">Email</a><a href="#">GitHub</a><a href="#">LinkedIn</a><a href="#">Mastodon</a></div>
  </div>
</footer>
</body>
</html>`,
        kind: "file",
        mime: "text/html",
      },
      {
        path: "work.html",
        content: String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Selected Work — Lina Rosh</title>
<meta name="description" content="Selected projects by Lina Rosh: design systems, product design and front-end builds.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a href="#main" class="skip" style="position:absolute;left:-9999px">Skip to content</a>
<nav class="top" aria-label="Main">
  <div class="inner">
    <a class="logo" href="index.html">lina<span>.</span>rosh</a>
    <div class="links"><a href="index.html">Home</a><a href="work.html">Work</a><a href="about.html">About</a></div>
  </div>
</nav>
<header class="page-head" id="main">
  <p class="eyebrow">Selected work</p>
  <h1>Projects, 2021–2026</h1>
  <p class="lede">A few favourites, each with a story about constraints and trade-offs.</p>
</header>
<main class="projects" id="projects">
  <article class="proj full" id="fieldnotes">
    <div class="thumb t1 tall">Fieldnotes</div>
    <div class="meta"><p class="year">2025</p><h2>Fieldnotes</h2><p>Reading app for slow, deliberate readers. I owned design and front-end; grew the library to 300+ rituals and shipped a token-led design system.</p><p class="tags">iOS · Design system · Marketing site</p></div>
  </article>
  <article class="proj full" id="orbit">
    <div class="thumb t2 tall">Orbit</div>
    <div class="meta"><p class="year">2024</p><h2>Orbit analytics</h2><p>Design-to-front-end work for a data product: 200+ components, dark-theme visualization library, and onboarding that lifted activation 31%.</p><p class="tags">React · Data viz · Design ops</p></div>
  </article>
  <article class="proj full" id="maritime">
    <div class="thumb t3 tall">Maritime Museum</div>
    <div class="meta"><p class="year">2023</p><h2>Museu do Mar — wayfinding</h2><p>Digital wayfinding and accessible kiosks for a historic museum: 12 languages, zero-touch interaction, WCAG AA throughout.</p><p class="tags">Kiosks · Accessibility · Content</p></div>
  </article>
</main>
<footer class="foot">
  <div class="inner"><p>© 2026 Lina Rosh.</p><div class="links"><a href="mailto:hello@lina.rosh">Email</a><a href="#">GitHub</a><a href="#">LinkedIn</a></div></div>
</footer>
</body>
</html>`,
        kind: "file",
        mime: "text/html",
      },
      {
        path: "about.html",
        content: String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>About — Lina Rosh</title>
<meta name="description" content="Lina Rosh is a product designer and front-end developer based in Lisbon.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a href="#main" class="skip" style="position:absolute;left:-9999px">Skip to content</a>
<nav class="top" aria-label="Main">
  <div class="inner">
    <a class="logo" href="index.html">lina<span>.</span>rosh</a>
    <div class="links"><a href="index.html">Home</a><a href="work.html">Work</a><a href="about.html">About</a></div>
  </div>
</nav>
<header class="page-head" id="main">
  <p class="eyebrow">About</p>
  <h1>Ten years of making things easier to use.</h1>
</header>
<main class="about">
  <div class="inner wide">
    <p class="lede">I grew up on the coast of Portugal, taught myself to code on a school library computer, and never really stopped. Before freelancing I led product design at two startups and one very slow-moving museum.</p>
    <div class="grid2 cols">
      <section><h2>How I work</h2><ul><li>No 40-page decks — prototypes and written arguments.</li><li>Design in the browser early; only then in Figma.</li><li>Accessibility checked on every build, not as an afterthought.</li><li>Weekly shows, honest timelines, tiny invoices.</li></ul></section>
      <section><h2>Contact</h2><p>Currently booking work from September. Best reach: <a href="mailto:hello@lina.rosh">hello@lina.rosh</a>.</p><p>Prefer async? Book a 20-min call below.</p><a class="btn" href="#">Book a call</a></section>
    </div>
  </div>
</main>
<footer class="foot">
  <div class="inner"><p>© 2026 Lina Rosh.</p><div class="links"><a href="mailto:hello@lina.rosh">Email</a><a href="#">GitHub</a><a href="#">LinkedIn</a><a href="#">Mastodon</a></div></div>
</footer>
</body>
</html>`,
        kind: "file",
        mime: "text/html",
      },
      {
        path: "css/style.css",
        content: String.raw`/* Portfolio starter — Webpress template */
:root{--bg:#faf9f6;--fg:#18181b;--muted:#6b6b70;--line:#e4e2dc;--accent:#b45309;--accent-ink:#92400e;--max:1040px;--font:"SF Pro Text",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--accent-ink);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;display:block}
.inner{max-width:var(--max);margin:0 auto;padding:0 28px}
nav.top{border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(250,249,246,.9);backdrop-filter:blur(10px);z-index:50}
nav.top .inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-weight:700;letter-spacing:-.02em;color:var(--fg)}
.logo span{color:var(--accent)}
.links{display:flex;gap:26px}
.links a{color:var(--muted);font-size:.9rem}
.links a:hover{color:var(--fg)}
.btn{display:inline-block;border:1px solid var(--fg);border-radius:999px;padding:10px 20px;font-size:.9rem;font-weight:600;color:var(--fg)}
.btn:hover{background:var(--fg);color:var(--bg);text-decoration:none}
.btn.ghost{border-color:var(--line);color:var(--muted)}
.btn.ghost:hover{border-color:var(--fg);background:transparent;color:var(--fg)}
.btn.small{padding:7px 16px;font-size:.82rem}
.intro{padding:110px 0 80px;max-width:820px;margin:0 auto;text-align:center;padding-left:20px;padding-right:20px}
.intro .lede,.page-head .lede{color:var(--muted);font-size:1.15rem;max-width:560px;margin:0 auto}
.intro h1{font-size:clamp(2.2rem,5.5vw,3.6rem);letter-spacing:-.03em;line-height:1.12;margin:18px 0 22px}
.intro h1 em,.page-head h1 em{font-style:italic;color:var(--accent-ink)}
.eyebrow{font-size:.74rem;text-transform:uppercase;letter-spacing:.18em;color:var(--accent);font-weight:700}
.cta-row{display:flex;gap:12px;justify-content:center;margin-top:34px;flex-wrap:wrap}
section.now{padding:70px 0;border-top:1px solid var(--line)}
section.now h2,.featured h2{font-size:1.4rem;letter-spacing:-.02em;margin-bottom:34px}
.three{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:40px}
.three h3{font-size:1.02rem;margin-bottom:8px}
.three p{color:var(--muted);font-size:.92rem}
.featured{padding:70px 0;border-top:1px solid var(--line)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.proj{overflow:hidden}
.proj h3{font-size:1.05rem;margin:16px 0 8px}
.proj p{color:var(--muted);font-size:.92rem}
.proj a{font-size:.9rem;font-weight:600}
.thumb{height:300px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;letter-spacing:.02em;background:linear-gradient(135deg,#7c3aed,#312e81)}
.thumb.t2{background:linear-gradient(135deg,#0d9488,#134e4a)}
.thumb.t3{background:linear-gradient(135deg,#b45309,#7c2d12)}
.thumb.tall{height:340px}
.quote{border-top:1px solid var(--line);padding:90px 0}
blockquote{max-width:720px;margin:0 auto;text-align:center;font-size:clamp(1.3rem,3vw,1.7rem);letter-spacing:-.02em;line-height:1.4}
blockquote footer{margin-top:26px;font-size:.85rem;color:var(--muted)}
.page-head{padding:90px 0 50px;text-align:center}
.page-head h1{font-size:clamp(2rem,5vw,3rem);letter-spacing:-.03em;margin:14px 0 10px}
.projects{padding:0 28px 80px;max-width:var(--max);margin:0 auto}
.proj.full{display:grid;grid-template-columns:1.2fr 1fr;gap:34px;align-items:center;padding:40px 0;border-bottom:1px solid var(--line)}
.proj.full:last-child{border-bottom:none}
.proj.full .year{font-size:.74rem;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);font-weight:700;margin-bottom:10px}
.proj.full h2{font-size:1.6rem;letter-spacing:-.02em;margin-bottom:12px}
.proj.full p{color:var(--muted);margin-bottom:10px}
.tags{font-size:.82rem;color:var(--accent-ink)!important;font-weight:600}
.about{padding:20px 0 90px}
.about .lede{font-size:1.2rem;max-width:640px;margin-bottom:50px}
.about ul{list-style:none}
.about ul li{padding:9px 0;border-bottom:1px solid var(--line);color:var(--muted);font-size:.95rem}
.about section p{margin-bottom:12px;color:var(--muted)}
.about section{margin-bottom:40px}
footer.foot{border-top:1px solid var(--line);padding:40px 0}
footer.foot .inner{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
footer.foot p{color:var(--muted);font-size:.85rem}
@media (max-width:700px){
  .grid2,.proj.full{grid-template-columns:1fr}
  nav.top .links{display:none}
  .intro{padding:80px 24px 60px}
  .thumb,.thumb.tall{height:220px}
}`,
        kind: "file",
        mime: "text/css",
      },
    ],
  },
];
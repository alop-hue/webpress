import type { TemplateDef } from "./index";

const blogCss = String.raw`/* Blog — Webpress template */
:root{--bg:#fbfaf8;--fg:#1c1a17;--muted:#6f6b63;--line:#e8e4dd;--accent:#b45309;--max:720px;--font:ui-serif,Georgia,"Times New Roman",serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.75;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
nav{display:flex;align-items:center;justify-content:space-between;max-width:var(--max);margin:0 auto;padding:28px 24px 0}
.brand{font-size:1.2rem;font-weight:700;letter-spacing:-.01em}
.brand span{color:var(--accent)}
nav .links{display:flex;gap:24px;font-size:.92rem;color:var(--muted)}
nav .links a:hover{color:var(--fg)}
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
.hero{padding:80px 0 50px;max-width:var(--max);margin:0 auto;padding-left:24px;padding-right:24px}
.hero .kicker{font-size:.78rem;text-transform:uppercase;letter-spacing:.2em;color:var(--accent);font-weight:700;margin-bottom:18px}
.hero h1{font-size:clamp(2rem,5.5vw,3.2rem);letter-spacing:-.03em;line-height:1.15}
.hero .lede{color:var(--muted);margin-top:16px;font-size:1.08rem;max-width:560px}
.featured{border:1px solid var(--line);border-radius:18px;padding:34px;margin:40px 0;background:#fff}
.featured .tag{font-size:.74rem;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);font-weight:700}
.featured h2{font-size:1.6rem;letter-spacing:-.02em;margin:12px 0 8px;line-height:1.3}
.featured p{color:var(--muted);margin-bottom:18px}
.read-more{font-weight:700;color:var(--accent);font-size:.95rem}
.posts{display:flex;flex-direction:column;gap:0;padding-bottom:80px}
.post{border-bottom:1px solid var(--line);padding:28px 0;display:flex;justify-content:space-between;gap:24px;align-items:baseline}
.post:last-child{border-bottom:none}
.post .date{color:var(--muted);font-size:.86rem;white-space:nowrap}
.post h3{font-size:1.18rem;letter-spacing:-.01em;line-height:1.4}
.post h3 a:hover{color:var(--accent)}
.post .ex{color:var(--muted);font-size:.94rem;margin-top:6px}
article.post-full{max-width:var(--max);margin:0 auto;padding:60px 24px 90px}
article.post-full .meta{color:var(--muted);font-size:.9rem;margin-bottom:24px}
article.post-full h1{font-size:clamp(2rem,5vw,2.9rem);letter-spacing:-.03em;line-height:1.2;margin-bottom:14px}
article.post-full h2{font-size:1.45rem;margin:40px 0 14px;letter-spacing:-.01em}
article.post-full p{color:#403c35;margin-bottom:18px}
article.post-full p.lede{font-size:1.15rem;color:var(--muted)}
article.post-full blockquote{border-left:3px solid var(--accent);padding:4px 0 4px 22px;margin:28px 0;font-size:1.1rem;font-style:italic;color:#403c35}
footer{border-top:1px solid var(--line);padding:34px 0;text-align:center;color:var(--muted);font-size:.86rem}
footer .socials{display:flex;gap:20px;justify-content:center;margin-bottom:12px}
@media (max-width:640px){.post{flex-direction:column;gap:6px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const blogHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Commonplace — notes on making things</title>
<meta name="description" content="Commonplace is a blog about design, craft and the slow work of making things well. New essays every other week.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav aria-label="Main">
  <a class="brand" href="index.html">Commonplace<span>.</span></a>
  <div class="links"><a href="index.html">Essays</a><a href="posts/field-notes.html">Featured</a><a href="mailto:hi@commonplace.example">Contact</a></div>
</nav>

<header class="hero">
  <p class="kicker">Essays on design & craft</p>
  <h1>Notes on making things well.</h1>
  <p class="lede">Slow thoughts about design, tools, and the work that takes longer than it should — because it should.</p>
</header>

<main class="container">
  <article class="featured">
    <p class="tag">Featured essay</p>
    <h2><a href="posts/field-notes.html">Field notes on slow reading</a></h2>
    <p>What I learned from spending a year reading one long book at a time — and why the apps trying to "optimize" reading are missing the point.</p>
    <a class="read-more" href="posts/field-notes.html">Read the essay →</a>
  </article>

  <div class="posts">
    <article class="post">
      <div><h3><a href="posts/field-notes.html">Field notes on slow reading</a></h3><p class="ex">On attention, paper and the quiet joy of a long book.</p></div>
      <span class="date">Mar 2026</span>
    </article>
    <article class="post">
      <div><h3><a href="posts/field-notes.html">The tools we keep</a></h3><p class="ex">Why a ten-year-old knife outperforms this year's hype cycle.</p></div>
      <span class="date">Feb 2026</span>
    </article>
    <article class="post">
      <div><h3><a href="posts/field-notes.html">On finishing things</a></h3><p class="ex">Shipping is a design skill. Here's how I practice it.</p></div>
      <span class="date">Jan 2026</span>
    </article>
    <article class="post">
      <div><h3><a href="posts/field-notes.html">Small notebooks, big ideas</a></h3><p class="ex">The unglamorous system behind a decade of writing.</p></div>
      <span class="date">Dec 2025</span>
    </article>
  </div>
</main>

<footer>
  <div class="socials"><a href="https://twitter.com">Twitter</a><a href="https://www.linkedin.com">LinkedIn</a><a href="https://example.com/rss">RSS</a></div>
  <div>© 2026 Commonplace · Made with Webpress</div>
</footer>
</body>
</html>`;

const blogPost = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Field notes on slow reading — Commonplace</title>
<meta name="description" content="What I learned from spending a year reading one long book at a time — and why the apps trying to optimize reading are missing the point.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav aria-label="Main">
  <a class="brand" href="index.html">Commonplace<span>.</span></a>
  <div class="links"><a href="index.html">Essays</a><a href="mailto:hi@commonplace.example">Contact</a></div>
</nav>

<article class="post-full">
  <p class="meta">March 2026 · 8 min read · <a href="index.html">← All essays</a></p>
  <h1>Field notes on slow reading</h1>
  <p class="lede">Last January I decided to read one long book at a time — no stacking, no speed-reading, no tracking apps. This is what happened to my attention, my shelves, and my tolerance for dashboards.</p>
  <p>Every reading app I've tried wants to turn reading into a pipeline. Progress bars, streaks, "words per minute", and a little dopamine hit every time you finish a chapter. They treat books like a queue to be drained, and readers like throughput machines.</p>
  <p>But reading was never really about throughput. It's about the slow formation of ideas — the moment a thought from page 40 collides with something from page 300. You can't schedule that collision. You can only leave room for it.</p>
  <h2>One book at a time</h2>
  <p>The change was simple: one book, started and finished before the next begins. No "currently reading" graveyard of abandoned titles. It feels almost radical in its slowness — which is exactly why it works.</p>
  <blockquote>You can't schedule the moment a thought from page 40 collides with something from page 300. You can only leave room for it.</blockquote>
  <p>The books I finished this year weren't more numerous — they were better kept. Marginalia accumulated, arguments followed me through the day, and the endings actually felt earned.</p>
  <h2>What the apps get wrong</h2>
  <p>The apps are built around the anxiety of not having read enough. The practice is built around the pleasure of having read something deeply. One feeds a metric; the other feeds a mind.</p>
  <p>I still use my phone to read on the train. I just stopped letting it keep score.</p>
</article>

<footer>
  <div class="socials"><a href="https://twitter.com">Twitter</a><a href="https://example.com/rss">RSS</a></div>
  <div>© 2026 Commonplace · Made with Webpress</div>
</footer>
</body>
</html>`;

const docsCss = String.raw`/* Documentation — Webpress template */
:root{--bg:#ffffff;--fg:#1a1a1f;--muted:#6b6b74;--line:#e8e8ee;--accent:#4f46e5;--sidebar:260px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.7;-webkit-font-smoothing:antialiased;font-size:15.5px}
a{color:inherit;text-decoration:none}
nav.top{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding:0 28px;height:56px;position:sticky;top:0;background:#fff;z-index:40}
.brand{font-weight:800;letter-spacing:-.02em}
.brand span{color:var(--accent)}
nav.top .r{display:flex;gap:20px;font-size:.88rem;color:var(--muted)}
nav.top .r a:hover{color:var(--fg)}
.layout{display:flex;max-width:1180px;margin:0 auto}
aside.side{width:var(--sidebar);flex-shrink:0;border-right:1px solid var(--line);padding:30px 24px;position:sticky;top:56px;height:calc(100dvh - 56px);overflow-y:auto}
aside.side .group{margin-bottom:26px}
aside.side .group h4{font-size:.7rem;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);margin-bottom:10px}
aside.side .group a{display:block;padding:6px 10px;border-radius:8px;color:var(--muted);font-size:.9rem}
aside.side .group a:hover{color:var(--fg);background:#f5f5fa}
aside.side .group a.on{color:var(--accent);font-weight:600;background:rgba(79,70,229,.08)}
main.doc{flex:1;min-width:0;padding:44px 56px 100px;max-width:780px}
main.doc .crumbs{font-size:.84rem;color:var(--muted);margin-bottom:20px}
main.doc h1{font-size:2rem;letter-spacing:-.02em;line-height:1.25;margin-bottom:10px}
main.doc .lede{color:var(--muted);font-size:1.05rem;margin-bottom:34px}
main.doc h2{font-size:1.3rem;letter-spacing:-.01em;margin:44px 0 12px}
main.doc p{margin-bottom:16px}
main.doc a{color:var(--accent);text-decoration:underline}
main.doc ul,main.doc ol{margin:0 0 18px 22px}
main.doc li{margin-bottom:8px}
main.doc code{background:#f2f2f7;border-radius:6px;padding:2px 7px;font-size:.86em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
main.doc pre{background:#16161c;color:#e4e4ef;border-radius:12px;padding:20px;overflow-x:auto;margin:20px 0 26px;font-size:.86rem;line-height:1.6}
main.doc pre code{background:none;color:inherit;padding:0}
main.doc .note{border-left:3px solid var(--accent);background:#f5f5fa;border-radius:0 10px 10px 0;padding:14px 18px;margin:22px 0;font-size:.92rem;color:#45454f}
.prev-next{display:flex;justify-content:space-between;border-top:1px solid var(--line);margin-top:60px;padding-top:24px;font-size:.9rem}
.prev-next a{color:var(--accent);font-weight:600}
footer{border-top:1px solid var(--line);padding:26px 28px;text-align:center;color:var(--muted);font-size:.84rem}
@media (max-width:900px){aside.side{display:none}main.doc{padding:34px 24px 80px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const docsHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acme API — Developer documentation</title>
<meta name="description" content="Everything you need to build with the Acme API — quickstarts, guides and API reference.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav class="top" aria-label="Main">
  <a class="brand" href="index.html">Acme<span>.</span>docs</a>
  <div class="r"><a href="https://github.com">GitHub</a><a href="mailto:dev@acme.example">Support</a></div>
</nav>

<div class="layout">
  <aside class="side" aria-label="Documentation">
    <div class="group">
      <h4>Getting started</h4>
      <a href="index.html" class="on">Introduction</a>
      <a href="guides/quickstart.html">Quickstart</a>
      <a href="guides/authentication.html">Authentication</a>
    </div>
    <div class="group">
      <h4>Guides</h4>
      <a href="guides/quickstart.html">Your first request</a>
      <a href="guides/authentication.html">API keys</a>
    </div>
    <div class="group">
      <h4>Reference</h4>
      <a href="guides/quickstart.html">REST endpoints</a>
      <a href="guides/authentication.html">Error codes</a>
    </div>
  </aside>

  <main class="doc">
    <p class="crumbs">Getting started / <b>Introduction</b></p>
    <h1>Build with the Acme API</h1>
    <p class="lede">A simple, typed REST API for storing, searching and syncing your data. This guide takes you from zero to your first request in about ten minutes.</p>

    <h2>What you can build</h2>
    <p>The Acme API handles the boring parts of data products — storage, querying, webhooks and auth — so you can focus on your app. Three concepts to know:</p>
    <ul>
      <li><b>Projects</b> — isolated containers for your data and keys.</li>
      <li><b>Collections</b> — typed groups of records with indexes and validation.</li>
      <li><b>Webhooks</b> — real-time push notifications when records change.</li>
    </ul>

    <h2>Your first request</h2>
    <p>Every request uses your API key. Grab it from the dashboard, then:</p>
    <pre><code>curl -X POST https://api.acme.example/v1/collections \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "orders", "schema": {"total": "number"}}'</code></pre>
    <p>That's it — you just created a collection. Read the <a href="guides/quickstart.html">quickstart</a> next, or jump to <a href="guides/authentication.html">authentication</a>.</p>

    <div class="note">💡 <b>Tip:</b> all endpoints are idempotent and return consistent JSON. Errors use standard HTTP status codes with a <code>code</code> field.</div>

    <div class="prev-next">
      <span></span>
      <a href="guides/quickstart.html">Next: Quickstart →</a>
    </div>
  </main>
</div>

<footer>© 2026 Acme · Made with Webpress</footer>
</body>
</html>`;

const docsQuickstart = docsHome
  .replace(/<title>.*?<\/title>/, "<title>Quickstart — Acme API</title>")
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Build your first app with the Acme API in ten minutes — create a project, add a key, make a request.">')
  .replace(/<p class="crumbs">Getting started \/ <b>Introduction<\/b>/, '<p class="crumbs">Getting started / <b>Quickstart</b>')
  .replace(/<a href="index.html" class="on">Introduction<\/a>/, '<a href="index.html">Introduction</a>')
  .replace(/<a href="guides\/quickstart.html">Quickstart<\/a>/, '<a href="guides/quickstart.html" class="on">Quickstart</a>')
  .replace(/<h1>Build with the Acme API<\/h1>[\s\S]*?<div class="note">[\s\S]*?<\/div>/, `<h1>Quickstart</h1>
    <p class="lede">Create a project, mint an API key, and make your first request — in under ten minutes.</p>
    <h2>1. Create a project</h2>
    <p>Sign in to the <a href="https://dashboard.acme.example">dashboard</a> and create a project. Give it a name like <code>my-first-app</code> — you can change it later.</p>
    <h2>2. Add an API key</h2>
    <p>Open <b>Settings → API keys</b> and create a key with <code>write</code> scope. Keep it server-side; keys are shown only once.</p>
    <pre><code>export ACME_KEY="acm_live_xxx"</code></pre>
    <h2>3. Make a request</h2>
    <p>With your key set, create a record:</p>
    <pre><code>curl https://api.acme.example/v1/records \\
  -H "Authorization: Bearer $ACME_KEY" \\
  -d '{"collection": "orders", "data": {"total": 99}}'</code></pre>
    <p>You'll get back the created record with an <code>id</code> and <code>created_at</code>. That's the whole flow.</p>
    <div class="note">💡 <b>Next:</b> read about <a href="guides/authentication.html">authentication</a> to understand keys, scopes and webhook signing.</div>`)
  .replace(/<span><\/span>\n      <a href="guides\/quickstart.html">Next: Quickstart →<\/a>/, '<a href="guides/authentication.html">Next: Authentication →</a>\n      <a href="index.html">← Introduction</a>');

const startupCss = String.raw`/* Startup landing — Webpress template */
:root{--bg:#f8fafc;--fg:#0f172a;--muted:#64748b;--line:#e2e8f0;--accent:#2563eb;--accent-2:#7c3aed;--max:1100px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
nav{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-weight:800;letter-spacing:-.02em;font-size:1.05rem}
.logo .dot{color:var(--accent)}
nav .links{display:flex;gap:28px;color:var(--muted);font-size:.9rem}
nav .links a:hover{color:var(--fg)}
nav .cta{display:flex;gap:10px;align-items:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;padding:10px 18px;font-size:.9rem;font-weight:600;transition:background .15s,transform .15s;cursor:pointer;border:1px solid transparent}
.btn:hover{transform:translateY(-1px)}
.btn-primary{background:var(--fg);color:#fff}
.btn-primary:hover{background:var(--accent)}
.btn-ghost{color:var(--muted)}
.btn-ghost:hover{color:var(--fg)}
.btn-lg{padding:13px 26px;font-size:.95rem}
.hero{text-align:center;padding:100px 0 70px;background:radial-gradient(800px 400px at 50% -10%,rgba(37,99,235,.12),transparent 60%),radial-gradient(600px 300px at 80% 0%,rgba(124,58,237,.1),transparent 60%)}
.hero .badge{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 14px;font-size:.8rem;color:var(--muted);margin-bottom:26px;box-shadow:0 1px 2px rgba(15,23,42,.04)}
.hero h1{font-size:clamp(2.4rem,6.5vw,4.2rem);letter-spacing:-.04em;line-height:1.08;font-weight:800;max-width:820px;margin:0 auto 22px}
.hero h1 .grad{background:linear-gradient(90deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{color:var(--muted);font-size:clamp(1.05rem,2vw,1.25rem);max-width:600px;margin:0 auto 34px}
.hero .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.logos{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:26px 0;display:flex;justify-content:center;gap:44px;flex-wrap:wrap;color:#94a3b8;font-weight:700;letter-spacing:.02em;font-size:.9rem}
section{padding:90px 0}
.sec-head{text-align:center;max-width:620px;margin:0 auto 54px}
.sec-head .kicker{color:var(--accent);font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px}
.sec-head h2{font-size:clamp(1.9rem,4.5vw,2.7rem);letter-spacing:-.03em;font-weight:800;margin-bottom:14px}
.sec-head p{color:var(--muted)}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.feature{border:1px solid var(--line);border-radius:16px;padding:28px;background:#fff;transition:border-color .2s,transform .2s,box-shadow .2s}
.feature:hover{border-color:#cbd5e1;transform:translateY(-3px);box-shadow:0 12px 30px -12px rgba(15,23,42,.12)}
.feature .ico{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;background:rgba(37,99,235,.1);margin-bottom:16px}
.feature h3{font-size:1.05rem;margin-bottom:8px}
.feature p{color:var(--muted);font-size:.9rem}
section.alt{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;align-items:stretch}
.price-card{border:1px solid var(--line);border-radius:18px;padding:30px;background:#fff;display:flex;flex-direction:column}
.price-card.pop{border-color:var(--accent);box-shadow:0 20px 50px -20px rgba(37,99,235,.35);position:relative}
.price-card.pop .pop-tag{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-size:.7rem;font-weight:700;border-radius:999px;padding:4px 12px;text-transform:uppercase;letter-spacing:.08em}
.price-card h3{font-size:1rem;margin-bottom:8px}
.price-card .price{font-size:2.4rem;font-weight:800;letter-spacing:-.03em}
.price-card .price small{font-size:.9rem;color:var(--muted);font-weight:400}
.price-card .desc{color:var(--muted);font-size:.88rem;margin:8px 0 22px}
.price-card ul{list-style:none;margin-bottom:26px;flex:1}
.price-card ul li{padding:7px 0;display:flex;gap:10px;font-size:.9rem;color:#334155}
.price-card ul li::before{content:"✓";color:var(--accent);font-weight:700}
.cta{text-align:center;padding:100px 0;background:linear-gradient(180deg,var(--bg),rgba(37,99,235,.06))}
.cta h2{font-size:clamp(1.9rem,4.5vw,2.8rem);letter-spacing:-.03em;font-weight:800;margin-bottom:16px}
.cta p{color:var(--muted);max-width:480px;margin:0 auto 32px}
footer{border-top:1px solid var(--line);padding:34px 0;text-align:center;color:#94a3b8;font-size:.85rem}
footer .cols{display:flex;justify-content:center;gap:28px;margin-bottom:14px}
@media (max-width:900px){.features,.pricing{grid-template-columns:1fr}.hero{padding:80px 0 60px}section{padding:70px 0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const startupHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rivet — Time tracking your team will actually use</title>
<meta name="description" content="Rivet is effortless time tracking for modern teams. One-click timers, beautiful reports and integrations with the tools you already use.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav class="container" aria-label="Main">
  <a class="logo" href="index.html">rivet<span class="dot">.</span></a>
  <div class="links"><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div>
  <div class="cta"><a class="btn btn-ghost" href="#pricing">Sign in</a><a class="btn btn-primary" href="#pricing">Start free</a></div>
</nav>

<header class="hero">
  <div class="container">
    <span class="badge">✦ New: AI-powered weekly reports</span>
    <h1>Time tracking your team will <span class="grad">actually use</span></h1>
    <p>Rivet makes it effortless to track time, plan projects and understand where the day went. No timesheets, no guilt — just one-click timers and honest data.</p>
    <div class="cta-row">
      <a class="btn btn-primary btn-lg" href="#pricing">Start free — no card</a>
      <a class="btn btn-ghost btn-lg" href="#features">See how it works</a>
    </div>
  </div>
</header>

<div class="logos">TRUSTED BY 3,000+ TEAMS</div>

<main>
  <section id="features">
    <div class="container">
      <div class="sec-head"><div class="kicker">Features</div><h2>Everything you need. Nothing you don't.</h2><p>Rivet replaces spreadsheets, sticky notes and the weekly "what did you work on" email.</p></div>
      <div class="features">
        <article class="feature"><div class="ico">⏱️</div><h3>One-click timers</h3><p>Start, stop, done. Timers live in your menu bar or browser — no forms, no friction.</p></article>
        <article class="feature"><div class="ico">📊</div><h3>Beautiful reports</h3><p>Client-ready reports in one click, with smart summaries your team actually reads.</p></article>
        <article class="feature"><div class="ico">🔌</div><h3>40+ integrations</h3><p>Slack, GitHub, Asana, Linear and more. Time flows in from the tools you already use.</p></article>
        <article class="feature"><div class="ico">🗂️</div><h3>Projects & budgets</h3><p>Track budgets in real time and get notified before you blow a project estimate.</p></article>
        <article class="feature"><div class="ico">🧾</div><h3>Effortless invoicing</h3><p>Turn tracked time into invoices in two clicks, with your rates and taxes applied.</p></article>
        <article class="feature"><div class="ico">🔒</div><h3>Privacy first</h3><p>Your data is encrypted and exportable anytime. Leave whenever — it's yours.</p></article>
      </div>
    </div>
  </section>

  <section class="alt" id="pricing">
    <div class="container">
      <div class="sec-head"><div class="kicker">Pricing</div><h2>Simple pricing that scales</h2><p>Start free. Upgrade when your team grows. Cancel anytime.</p></div>
      <div class="pricing">
        <article class="price-card">
          <h3>Starter</h3>
          <div class="price">$0<small>/mo</small></div>
          <p class="desc">For solo makers getting organised.</p>
          <ul><li>Unlimited projects</li><li>1 team member</li><li>Basic reports</li><li>Mobile app</li></ul>
          <a class="btn btn-ghost" href="#pricing">Start free</a>
        </article>
        <article class="price-card pop">
          <span class="pop-tag">Most popular</span>
          <h3>Team</h3>
          <div class="price">$8<small>/user/mo</small></div>
          <p class="desc">For teams that bill by the hour.</p>
          <ul><li>Everything in Starter</li><li>Unlimited members</li><li>Budgets & invoicing</li><li>Integrations</li><li>Priority support</li></ul>
          <a class="btn btn-primary" href="#pricing">Start 14-day trial</a>
        </article>
        <article class="price-card">
          <h3>Business</h3>
          <div class="price">$15<small>/user/mo</small></div>
          <p class="desc">For agencies and scale-ups.</p>
          <ul><li>Everything in Team</li><li>SSO & SCIM</li><li>Audit logs</li><li>AI weekly reports</li><li>Dedicated CSM</li></ul>
          <a class="btn btn-ghost" href="#pricing">Contact sales</a>
        </article>
      </div>
    </div>
  </section>

  <section id="faq">
    <div class="container">
      <div class="sec-head"><div class="kicker">FAQ</div><h2>Questions, answered</h2></div>
      <div style="max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:12px">
        <details style="border:1px solid var(--line);border-radius:12px;padding:18px 22px;background:#fff"><summary style="cursor:pointer;font-weight:600;list-style:none">Is there really a free plan?</summary><p style="color:var(--muted);margin-top:10px;font-size:.92rem">Yes — free forever for one person. No trial clock, no card required.</p></details>
        <details style="border:1px solid var(--line);border-radius:12px;padding:18px 22px;background:#fff"><summary style="cursor:pointer;font-weight:600;list-style:none">Can I export my data?</summary><p style="color:var(--muted);margin-top:10px;font-size:.92rem">Anytime, in CSV or JSON. Your data belongs to you — always.</p></details>
        <details style="border:1px solid var(--line);border-radius:12px;padding:18px 22px;background:#fff"><summary style="cursor:pointer;font-weight:600;list-style:none">Does Rivet work with contractors?</summary><p style="color:var(--muted);margin-top:10px;font-size:.92rem">Yes — invite contractors free of charge and approve their time before invoicing.</p></details>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <h2>Know where the time goes</h2>
      <p>Join thousands of teams who stopped guessing and started tracking — effortlessly.</p>
      <a class="btn btn-primary btn-lg" href="#pricing">Get started free</a>
    </div>
  </section>
</main>

<footer>
  <div class="cols"><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="mailto:hello@rivet.example">Contact</a></div>
  <div>© 2026 Rivet · Made with Webpress</div>
</footer>
</body>
</html>`;

export const BLOG_TEMPLATE: TemplateDef = {
  id: "blog",
  name: "Blog",
  category: "Blog",
  description: "Editorial blog with featured essay, post list and a full article layout.",
  tags: ["light", "serif", "editorial", "writing"],
  pages: [
    { path: "/", title: "Commonplace — notes on making things", description: "Commonplace is a blog about design, craft and the slow work of making things well. New essays every other week." },
    { path: "/posts/field-notes", title: "Field notes on slow reading — Commonplace", description: "What I learned from spending a year reading one long book at a time — and why the apps trying to optimize reading are missing the point." },
  ],
  files: [
    { path: "index.html", content: blogHome, kind: "file", mime: "text/html" },
    { path: "posts/field-notes.html", content: blogPost, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: blogCss, kind: "file", mime: "text/css" },
  ],
};

export const DOCS_TEMPLATE: TemplateDef = {
  id: "docs",
  name: "Documentation",
  category: "Documentation",
  description: "Developer docs with sidebar navigation, guides and code samples.",
  tags: ["light", "docs", "developer", "reference"],
  pages: [
    { path: "/", title: "Acme API — Developer documentation", description: "Everything you need to build with the Acme API — quickstarts, guides and API reference." },
    { path: "/guides/quickstart", title: "Quickstart — Acme API", description: "Build your first app with the Acme API in ten minutes — create a project, add a key, make a request." },
    { path: "/guides/authentication", title: "Authentication — Acme API", description: "Understand Acme API keys, scopes and webhook signing." },
  ],
  files: [
    { path: "index.html", content: docsHome, kind: "file", mime: "text/html" },
    { path: "guides/quickstart.html", content: docsQuickstart, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: docsCss, kind: "file", mime: "text/css" },
    { path: "guides/authentication.html", content: docsHome.replace(/<title>.*?<\/title>/, "<title>Authentication — Acme API</title>").replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Understand Acme API keys, scopes and webhook signing.">').replace(/<p class="crumbs">Getting started \/ <b>Introduction<\/b>/, '<p class="crumbs">Guides / <b>Authentication</b>').replace(/<a href="index.html" class="on">Introduction<\/a>/, '<a href="index.html">Introduction</a>').replace(/<a href="guides\/quickstart.html">Quickstart<\/a>/, '<a href="guides/quickstart.html">Quickstart</a>').replace(/<a href="guides\/authentication.html">Authentication<\/a>/, '<a href="guides/authentication.html" class="on">Authentication</a>').replace(/<h1>Build with the Acme API<\/h1>[\s\S]*?<div class="note">[\s\S]*?<\/div>/, `<h1>Authentication</h1>
    <p class="lede">Every Acme API request is authenticated with a secret API key. Here's how keys, scopes and webhook signing work.</p>
    <h2>API keys</h2>
    <p>Create keys in the <b>Dashboard → API keys</b> page. Keep them on your server — never in client code or public repos.</p>
    <pre><code>Authorization: Bearer acm_live_xxxx</code></pre>
    <h2>Scopes</h2>
    <ul><li><code>read</code> — read-only access to your data.</li><li><code>write</code> — read + create/update records.</li><li><code>admin</code> — full access including keys and settings.</li></ul>
    <h2>Webhook signing</h2>
    <p>Webhook payloads are signed with an <code>X-Acme-Signature</code> header (HMAC-SHA256 of the raw body). Verify it before trusting the payload.</p>
    <div class="note">🔐 <b>Security:</b> rotate keys regularly and scope them to the minimum privilege your app needs.</div>`).replace(/<span><\/span>\n      <a href="guides\/quickstart.html">Next: Quickstart →<\/a>/, '<a href="guides/quickstart.html">← Quickstart</a>'),
    kind: "file",
    mime: "text/html",
    },
  ],
};

export const STARTUP_TEMPLATE: TemplateDef = {
  id: "startup",
  name: "Startup Landing",
  category: "Landing",
  description: "Modern SaaS landing page with features grid, pricing tiers and FAQ.",
  tags: ["light", "landing", "startup", "pricing"],
  pages: [{ path: "/", title: "Rivet — Time tracking your team will actually use", description: "Rivet is effortless time tracking for modern teams. One-click timers, beautiful reports and integrations with the tools you already use." }],
  files: [
    { path: "index.html", content: startupHome, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: startupCss, kind: "file", mime: "text/css" },
  ],
};

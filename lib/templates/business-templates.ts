/**
 * Business templates: Restaurant (multi-page), Agency, Store.
 */
import type { TemplateDef } from "./index";

const restaurantCss = String.raw`/* Restaurant — Webpress template */
:root{--bg:#0f0d0b;--fg:#f5efe6;--muted:#b3a595;--accent:#e0a458;--accent-2:#c87533;--border:#2a241e;--max:1080px;--font:ui-serif,Georgia,"Times New Roman",serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
nav{position:sticky;top:0;z-index:40;background:rgba(15,13,11,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
nav .container{display:flex;align-items:center;justify-content:space-between;height:64px}
.brand{font-size:1.15rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.brand span{color:var(--accent)}
nav .links{display:flex;gap:28px}
nav .links a{color:var(--muted);font-size:.92rem;transition:color .15s}
nav .links a:hover{color:var(--fg)}
nav .book{background:var(--accent);color:#1a140d;font-weight:700;border-radius:8px;padding:9px 18px;font-size:.85rem;letter-spacing:.04em;text-transform:uppercase;transition:background .15s}
nav .book:hover{background:var(--accent-2)}
.hero{text-align:center;padding:130px 0 100px;background:radial-gradient(800px 420px at 50% -10%,rgba(224,164,88,.18),transparent 60%)}
.hero .eyebrow{color:var(--accent);text-transform:uppercase;letter-spacing:.3em;font-size:.78rem;margin-bottom:22px}
.hero h1{font-size:clamp(2.6rem,7vw,4.6rem);letter-spacing:.02em;line-height:1.05;font-weight:700}
.hero h1 em{color:var(--accent);font-style:italic}
.hero p{color:var(--muted);font-size:1.05rem;max-width:520px;margin:22px auto 36px}
.hero .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.btn{display:inline-block;border:1px solid var(--accent);border-radius:999px;padding:13px 28px;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;transition:background .2s,color .2s}
.btn.solid{background:var(--accent);color:#1a140d;font-weight:700}
.btn.solid:hover{background:var(--accent-2)}
.btn.outline{color:var(--accent)}
.btn.outline:hover{background:var(--accent);color:#1a140d}
.hours{margin-top:44px;color:var(--muted);font-size:.88rem;letter-spacing:.08em;text-transform:uppercase}
section{padding:84px 0}
section.alt{background:#14100c;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.sec-head{text-align:center;margin-bottom:52px}
.sec-head .kicker{color:var(--accent);text-transform:uppercase;letter-spacing:.26em;font-size:.76rem;margin-bottom:14px}
.sec-head h2{font-size:clamp(1.9rem,4.5vw,2.7rem);letter-spacing:.02em;font-weight:700}
.sec-head p{color:var(--muted);margin-top:12px}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.about-grid p{color:var(--muted);font-size:1.02rem}
.about-grid p + p{margin-top:16px}
.photos{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.photos .ph{height:150px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:2rem;background:linear-gradient(135deg,#7c3a2d,#d9a05b);opacity:.9}
.photos .ph:nth-child(2){background:linear-gradient(135deg,#3f6212,#a3c96a)}
.photos .ph:nth-child(3){background:linear-gradient(135deg,#92400e,#f59e0b)}
.menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:34px 56px}
.menu-grid h3{grid-column:1/-1;color:var(--accent);font-size:1.25rem;letter-spacing:.1em;text-transform:uppercase;margin-top:12px}
.menu-item{display:flex;justify-content:space-between;gap:18px;border-bottom:1px dashed var(--border);padding:12px 0;align-items:baseline}
.menu-item .nm{font-size:1.02rem}
.menu-item .desc{color:var(--muted);font-size:.86rem;margin-top:2px}
.menu-item .dots{flex:1;border-bottom:1px dotted var(--border);margin:0 8px}
.menu-item .pr{color:var(--accent);font-weight:700;font-size:1rem}
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.gallery .g{height:200px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:2.4rem;background:linear-gradient(135deg,#9a3412,#fcd34d);}
.gallery .g:nth-child(2){background:linear-gradient(135deg,#14532d,#86efac)}
.gallery .g:nth-child(3){background:linear-gradient(135deg,#7c2d12,#fb923c)}
.visit{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:center}
.visit .v{border:1px solid var(--border);border-radius:16px;padding:32px 20px}
.visit .v h3{color:var(--accent);text-transform:uppercase;letter-spacing:.14em;font-size:.82rem;margin-bottom:12px}
.visit .v p{color:var(--muted);font-size:.95rem}
.reserve{text-align:center;padding:100px 0;background:radial-gradient(700px 380px at 50% 120%,rgba(224,164,88,.16),transparent 60%)}
.reserve h2{font-size:clamp(1.9rem,4.5vw,2.8rem);letter-spacing:.02em;margin-bottom:16px}
.reserve p{color:var(--muted);margin-bottom:32px}
footer{border-top:1px solid var(--border);padding:36px 0;text-align:center;color:#7d6f5f;font-size:.85rem}
@media (max-width:768px){nav .links{display:none}.about-grid,.menu-grid{grid-template-columns:1fr}.photos,.gallery,.visit{grid-template-columns:1fr}.hero{padding:90px 0 70px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const restaurantHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ember & Oak — Wood-fired kitchen</title>
<meta name="description" content="Ember & Oak is a wood-fired restaurant in the old town — seasonal plates, natural wines and a hearth that never goes out.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a href="#main" style="position:absolute;left:-999px;top:0;background:#e0a458;color:#1a140d;padding:10px 16px;z-index:99">Skip to content</a>
<nav aria-label="Main">
  <div class="container">
    <a class="brand" href="index.html">Ember<span> &amp;</span> Oak</a>
    <div class="links"><a href="index.html">Home</a><a href="menu.html">Menu</a><a href="#about">About</a><a href="#visit">Visit</a></div>
    <a class="book" href="menu.html">Book a table</a>
  </div>
</nav>

<header class="hero" id="main">
  <div class="container">
    <p class="eyebrow">Wood-fired · Seasonal · Since 2014</p>
    <h1>Cooked over <em>live fire</em>,<br>seasoned with patience.</h1>
    <p>Twelve tables, one hearth, and a menu that changes with the market. Everything is made in-house, from the sourdough to the pickles.</p>
    <div class="cta-row">
      <a class="btn solid" href="menu.html">View the menu</a>
      <a class="btn outline" href="#about">Our story</a>
    </div>
    <p class="hours">Open Tue — Sun · 5pm until late</p>
  </div>
</header>

<main>
  <section class="alt" id="about">
    <div class="container">
      <div class="sec-head"><div class="kicker">Our story</div><h2>Fire, produce, and very little else</h2></div>
      <div class="about-grid">
        <div class="photos"><div class="ph">🔥</div><div class="ph">🥬</div><div class="ph">🍷</div></div>
        <div>
          <p>Ember &amp; Oak started as a pop-up behind a bakery in 2014. A decade later we still cook the same way: whole animals, day-boat fish and whatever the farms drop off that morning — all over a single wood fire.</p>
          <p>Our kitchen is open to the room, the wine list favours small growers, and the sourdough is started from a culture older than the restaurant. Come hungry and stay curious.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="menu-preview">
    <div class="container">
      <div class="sec-head"><div class="kicker">From the kitchen</div><h2>A few current plates</h2></div>
      <div class="menu-grid">
        <h3>Small plates</h3>
        <div class="menu-item"><div><div class="nm">Charred leeks, hazelnut & brown butter</div><div class="desc">Wood-grilled, smoked yogurt</div></div><span class="dots"></span><span class="pr">12</span></div>
        <div class="menu-item"><div><div class="nm">Beef tartare on toasted rye</div><div class="desc">Capers, shallot, egg yolk</div></div><span class="dots"></span><span class="pr">16</span></div>
        <h3>From the fire</h3>
        <div class="menu-item"><div><div class="nm">Half chicken, salsa verde</div><div class="desc">Dry-aged, grilled over oak</div></div><span class="dots"></span><span class="pr">28</span></div>
        <div class="menu-item"><div><div class="nm">Catch of the day</div><div class="desc">Whole fish, fermented chilli butter</div></div><span class="dots"></span><span class="pr">34</span></div>
        <h3>Sweet</h3>
        <div class="menu-item"><div><div class="nm">Burnt honey & rosemary panna cotta</div></div><span class="dots"></span><span class="pr">11</span></div>
      </div>
      <div style="text-align:center;margin-top:40px"><a class="btn outline" href="menu.html">Full menu →</a></div>
    </div>
  </section>

  <section class="alt" id="gallery">
    <div class="container">
      <div class="sec-head"><div class="kicker">The room</div><h2>A look around</h2></div>
      <div class="gallery"><div class="g">🍽️</div><div class="g">🪵</div><div class="g">🥂</div></div>
    </div>
  </section>

  <section id="visit">
    <div class="container">
      <div class="sec-head"><div class="kicker">Plan your visit</div><h2>Find us</h2></div>
      <div class="visit">
        <div class="v"><h3>Hours</h3><p>Tue — Thu 5–11pm<br>Fri — Sat 5pm–12am<br>Sun 4–10pm · Mon closed</p></div>
        <div class="v"><h3>Address</h3><p>14 Old Firehouse Lane<br>Old Town<br>City, CT1 2AB</p></div>
        <div class="v"><h3>Contact</h3><p><a href="tel:+441234567890">+44 1234 567890</a><br><a href="mailto:table@emberandoak.example">table@emberandoak.example</a></p></div>
      </div>
    </div>
  </section>

  <section class="reserve">
    <div class="container">
      <h2>Reserve your table</h2>
      <p>Tables go quickly on weekends — book ahead or call us. Walk-ins welcome at the counter.</p>
      <a class="btn solid" href="menu.html">Book a table</a>
    </div>
  </section>
</main>

<footer>© 2026 Ember &amp; Oak · Made with Webpress</footer>
</body>
</html>`;

const restaurantMenu = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Menu — Ember &amp; Oak</title>
<meta name="description" content="The full menu at Ember & Oak — wood-fired small plates, mains, sides and desserts.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a href="#main" style="position:absolute;left:-999px;top:0;background:#e0a458;color:#1a140d;padding:10px 16px;z-index:99">Skip to content</a>
<nav aria-label="Main">
  <div class="container">
    <a class="brand" href="index.html">Ember<span> &amp;</span> Oak</a>
    <div class="links"><a href="index.html">Home</a><a href="menu.html">Menu</a><a href="index.html#about">About</a><a href="index.html#visit">Visit</a></div>
    <a class="book" href="menu.html">Book a table</a>
  </div>
</nav>

<header class="hero" id="main">
  <div class="container">
    <p class="eyebrow">The menu</p>
    <h1>Eat <em>everything</em></h1>
    <p>Dishes change with the market — this is the current menu. Prices in local currency.</p>
    <div class="cta-row"><a class="btn solid" href="index.html">Back to home</a></div>
  </div>
</header>

<main>
  <section id="menu-preview">
    <div class="container">
      <div class="sec-head"><div class="kicker">From the kitchen</div><h2>Full menu</h2></div>
      <div class="menu-grid">
        <h3>Small plates</h3>
        <div class="menu-item"><div><div class="nm">Charred leeks, hazelnut & brown butter</div><div class="desc">Wood-grilled, smoked yogurt</div></div><span class="dots"></span><span class="pr">12</span></div>
        <div class="menu-item"><div><div class="nm">Beef tartare on toasted rye</div><div class="desc">Capers, shallot, egg yolk</div></div><span class="dots"></span><span class="pr">16</span></div>
        <div class="menu-item"><div><div class="nm">Salt-baked celeriac, brown butter</div><div class="desc">Smoked almonds, aged balsamic</div></div><span class="dots"></span><span class="pr">14</span></div>
        <h3>From the fire</h3>
        <div class="menu-item"><div><div class="nm">Half chicken, salsa verde</div><div class="desc">Dry-aged, grilled over oak</div></div><span class="dots"></span><span class="pr">28</span></div>
        <div class="menu-item"><div><div class="nm">Catch of the day</div><div class="desc">Whole fish, fermented chilli butter</div></div><span class="dots"></span><span class="pr">34</span></div>
        <div class="menu-item"><div><div class="nm">8oz dry-aged ribeye</div><div class="desc">Charred onion, bone-marrow butter</div></div><span class="dots"></span><span class="pr">42</span></div>
        <h3>Sides & bread</h3>
        <div class="menu-item"><div><div class="nm">Wood-fired sourdough</div><div class="desc">Cultured butter, smoked salt</div></div><span class="dots"></span><span class="pr">7</span></div>
        <div class="menu-item"><div><div class="nm">Roast roots & gremolata</div><div class="desc">Seasonal, from the market</div></div><span class="dots"></span><span class="pr">9</span></div>
        <h3>Sweet</h3>
        <div class="menu-item"><div><div class="nm">Burnt honey & rosemary panna cotta</div></div><span class="dots"></span><span class="pr">11</span></div>
        <div class="menu-item"><div><div class="nm">Dark chocolate & olive oil cake</div><div class="desc">Whipped crème fraîche</div></div><span class="dots"></span><span class="pr">10</span></div>
      </div>
    </div>
  </section>

  <section class="reserve">
    <div class="container">
      <h2>Reserve your table</h2>
      <p>Tables go quickly on weekends — book ahead or call us. Walk-ins welcome at the counter.</p>
      <a class="btn solid" href="index.html">Back to home</a>
    </div>
  </section>
</main>

<footer>© 2026 Ember &amp; Oak · Made with Webpress</footer>
</body>
</html>`;

const agencyCss = String.raw`/* Agency — Webpress template */
:root{--bg:#f7f6f4;--fg:#17171a;--muted:#6d6d74;--line:#e6e4df;--accent:#0d9488;--accent-ink:#0f766e;--max:1100px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--accent-ink);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;display:block}
.wrap{max-width:var(--max);margin:0 auto;padding:0 28px}
nav.top{border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(247,246,244,.92);backdrop-filter:blur(10px);z-index:50}
nav.top .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-weight:800;letter-spacing:-.02em;color:var(--fg);font-size:1.05rem}
.logo span{color:var(--accent)}
nav.top .links{display:flex;gap:26px}
nav.top .links a{color:var(--muted);font-size:.9rem}
nav.top .links a:hover{color:var(--fg)}
.btn{display:inline-block;border:1px solid var(--fg);border-radius:999px;padding:11px 22px;font-size:.9rem;font-weight:600;color:var(--fg)}
.btn:hover{background:var(--fg);color:var(--bg);text-decoration:none}
.btn.solid{background:var(--fg);color:var(--bg)}
.btn.solid:hover{background:var(--accent);border-color:var(--accent)}
.hero{padding:110px 0 70px;max-width:900px}
.hero .kicker{font-size:.76rem;text-transform:uppercase;letter-spacing:.2em;color:var(--accent);font-weight:700;margin-bottom:20px}
.hero h1{font-size:clamp(2.4rem,6vw,4rem);letter-spacing:-.03em;line-height:1.08}
.hero h1 em{font-style:italic;color:var(--accent)}
.hero .lede{color:var(--muted);font-size:1.12rem;max-width:600px;margin-top:22px}
.hero .cta-row{margin-top:34px;display:flex;gap:12px;flex-wrap:wrap}
.metrics{border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:repeat(4,1fr)}
.metrics .m{padding:26px 28px;border-right:1px solid var(--line)}
.metrics .m:last-child{border-right:none}
.metrics .n{font-size:2rem;font-weight:800;letter-spacing:-.02em}
.metrics .l{color:var(--muted);font-size:.84rem;margin-top:2px}
section.block{padding:80px 0;border-bottom:1px solid var(--line)}
section.block:last-of-type{border-bottom:none}
.sec-head{max-width:560px;margin-bottom:48px}
.sec-head .kicker{font-size:.74rem;text-transform:uppercase;letter-spacing:.2em;color:var(--accent);font-weight:700;margin-bottom:12px}
.sec-head h2{font-size:clamp(1.8rem,4vw,2.5rem);letter-spacing:-.03em}
.sec-head p{color:var(--muted);margin-top:12px}
.services{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:22px}
.service{border:1px solid var(--line);border-radius:16px;padding:28px;transition:border-color .2s,transform .2s;background:#fff}
.service:hover{border-color:var(--accent);transform:translateY(-3px)}
.service .ico{font-size:1.6rem;margin-bottom:16px}
.service h3{font-size:1.05rem;margin-bottom:8px}
.service p{color:var(--muted);font-size:.9rem}
.cases{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.case{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff;transition:border-color .2s}
.case:hover{border-color:var(--accent)}
.case .thumb{height:220px;display:flex;align-items:center;justify-content:center;font-size:2.2rem;color:#fff;font-weight:800;letter-spacing:.02em;background:linear-gradient(135deg,#0d9488,#134e4a)}
.case:nth-child(2) .thumb{background:linear-gradient(135deg,#7c3aed,#4c1d95)}
.case:nth-child(3) .thumb{background:linear-gradient(135deg,#ea580c,#7c2d12)}
.case:nth-child(4) .thumb{background:linear-gradient(135deg,#2563eb,#1e3a8a)}
.case .body{padding:22px 24px}
.case .body .tag{font-size:.72rem;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);font-weight:700}
.case .body h3{font-size:1.15rem;margin:8px 0 6px}
.case .body p{color:var(--muted);font-size:.9rem}
.process{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.step{border-left:2px solid var(--accent);padding-left:18px}
.step .n{font-size:.78rem;font-weight:800;color:var(--accent)}
.step h3{font-size:1rem;margin:6px 0 6px}
.step p{color:var(--muted);font-size:.86rem}
.cta-band{background:var(--fg);color:var(--bg);padding:90px 0;text-align:center}
.cta-band h2{font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.03em;margin-bottom:14px}
.cta-band p{color:rgba(247,246,244,.7);margin-bottom:30px}
.cta-band .btn{background:var(--accent);border-color:var(--accent);color:#fff}
.cta-band .btn:hover{background:#0f766e}
footer.foot{border-top:1px solid var(--line);padding:32px 0;color:var(--muted);font-size:.85rem}
footer.foot .wrap{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
footer.foot .socials{display:flex;gap:18px}
@media (max-width:768px){.metrics{grid-template-columns:1fr 1fr}.metrics .m{border-bottom:1px solid var(--line)}.cases,.process{grid-template-columns:1fr}.hero{padding:80px 0 50px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const agencyHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>North & Found — Digital design studio</title>
<meta name="description" content="North & Found is a digital design studio helping ambitious companies design, build and ship products people love.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a href="#main" class="skip" style="position:absolute;left:-9999px">Skip to content</a>
<nav class="top" aria-label="Main">
  <div class="wrap">
    <a class="logo" href="index.html">north<span>&amp;</span>found</a>
    <div class="links"><a href="index.html">Home</a><a href="work.html">Work</a><a href="#services">Services</a><a href="#process">Process</a></div>
    <a class="btn" href="mailto:hello@northandfound.example">Start a project</a>
  </div>
</nav>

<header class="hero wrap" id="main">
  <p class="kicker">Digital design studio · Amsterdam & New York</p>
  <h1>We help teams design, build and ship <em>products people love</em>.</h1>
  <p class="lede">North &amp; Found is a small senior team. We partner with founders and product leaders for a few meaningful projects a year — and give each one our full attention.</p>
  <div class="cta-row">
    <a class="btn solid" href="mailto:hello@northandfound.example">Start a project</a>
    <a class="btn" href="work.html">See our work</a>
  </div>
</header>

<div class="metrics">
  <div class="m"><div class="n">12</div><div class="l">Years designing</div></div>
  <div class="m"><div class="n">80+</div><div class="l">Products shipped</div></div>
  <div class="m"><div class="n">9</div><div class="l">Design awards</div></div>
  <div class="m"><div class="n">4.9★</div><div class="l">Avg. client rating</div></div>
</div>

<main>
  <section class="block" id="services">
    <div class="wrap">
      <div class="sec-head"><div class="kicker">Services</div><h2>What we do</h2><p>Strategy, design and engineering under one roof — so nothing gets lost in translation.</p></div>
      <div class="services">
        <article class="service"><div class="ico">🧭</div><h3>Product strategy</h3><p>Positioning, roadmaps and discovery that answer "what should we build" before anyone writes code.</p></article>
        <article class="service"><div class="ico">🎨</div><h3>Product design</h3><p>Interfaces, design systems and prototypes — tested with real users at every stage.</p></article>
        <article class="service"><div class="ico">⚙️</div><h3>Engineering</h3><p>Production React/Next.js builds with clean code, tests and performance budgets.</p></article>
        <article class="service"><div class="ico">📈</div><h3>Growth & conversion</h3><p>Landing pages, onboarding and experiments that turn visitors into customers.</p></article>
        <article class="service"><div class="ico">♿</div><h3>Accessibility</h3><p>WCAG-compliant design and audits — because great products include everyone.</p></article>
        <article class="service"><div class="ico">🛟</div><h3>Design ops</h3><p>Tokens, tooling and documentation so your team can design faster forever.</p></article>
      </div>
    </div>
  </section>

  <section class="block" id="work">
    <div class="wrap">
      <div class="sec-head"><div class="kicker">Selected work</div><h2>Recent projects</h2><p>A few things we're proud of from the last two years.</p></div>
      <div class="cases">
        <article class="case"><div class="thumb">Fieldnotes</div><div class="body"><p class="tag">Product design · iOS</p><h3>Fieldnotes — reading app</h3><p>Full product redesign that grew subscriptions 2.1× in six months.</p></div></article>
        <article class="case"><div class="thumb">Orbit</div><div class="body"><p class="tag">Design system · SaaS</p><h3>Orbit analytics</h3><p>A 200-component design system that cut build time in half.</p></div></article>
        <article class="case"><div class="thumb">Harbor</div><div class="body"><p class="tag">Web app · Fintech</p><h3>Harbor banking</h3><p>End-to-end product for a challenger bank — from research to launch.</p></div></article>
        <article class="case"><div class="thumb">Museo</div><div class="body"><p class="tag">Website · Cultural</p><h3>Museo Nacional</h3><p>Accessible, blazing-fast site for a national museum, 12 languages.</p></div></article>
      </div>
    </div>
  </section>

  <section class="block" id="process">
    <div class="wrap">
      <div class="sec-head"><div class="kicker">Process</div><h2>How we work</h2><p>Senior people, no hand-offs, weekly demos. Here's the shape of a project.</p></div>
      <div class="process">
        <div class="step"><p class="n">01</p><h3>Discover</h3><p>Stakeholder interviews, user research, competitive teardown.</p></div>
        <div class="step"><p class="n">02</p><h3>Design</h3><p>Prototypes and design systems, tested with real users weekly.</p></div>
        <div class="step"><p class="n">03</p><h3>Build</h3><p>Production engineering with your team or as an embedded squad.</p></div>
        <div class="step"><p class="n">04</p><h3>Grow</h3><p>Launch support, analytics and iteration sprints after ship.</p></div>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap">
      <h2>Have something worth building?</h2>
      <p>We take on a limited number of projects each year. Tell us about yours.</p>
      <a class="btn" href="mailto:hello@northandfound.example">hello@northandfound.example</a>
    </div>
  </section>
</main>

<footer class="foot"><div class="wrap"><p>© 2026 North &amp; Found Studio</p><div class="socials"><a href="https://twitter.com">Twitter</a><a href="https://www.linkedin.com">LinkedIn</a><a href="https://dribbble.com">Dribbble</a></div></div></footer>
</body>
</html>`;

const agencyWork = agencyHome
  .replace(/<title>.*?<\/title>/, "<title>Work — North &amp; Found</title>")
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Selected projects by North & Found: product design, design systems and engineering for ambitious companies.">')
  .replace(/<header class="hero"[\s\S]*?<\/header>/, `<header class="hero wrap" id="main"><p class="kicker">Selected work</p><h1>Projects we're <em>proud of</em></h1><p class="lede">Every project below shipped, measured and learned from. Each one has a story about constraints and trade-offs.</p><div class="cta-row"><a class="btn solid" href="mailto:hello@northandfound.example">Start yours</a></div></header>`)
  .replace(/<div class="metrics">[\s\S]*?<\/div>/, "")
  .replace(/<section class="block" id="services">[\s\S]*?<section class="block" id="work">/, "<section class=\"block\" id=\"work\">")
  .replace(/<section class="block" id="process">[\s\S]*?<\/section>/, "")
  .replace(/<section class="cta-band">[\s\S]*?<\/section>/, "");

const storeCss = String.raw`/* Store — Webpress template */
:root{--bg:#ffffff;--fg:#18181b;--muted:#71717a;--line:#e7e7ea;--accent:#18181b;--accent-2:#f43f5e;--max:1120px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
nav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
nav .container{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-weight:800;letter-spacing:-.02em;font-size:1.05rem}
nav .right{display:flex;gap:22px;align-items:center}
nav .right a{color:var(--muted);font-size:.9rem}
nav .right a:hover{color:var(--fg)}
nav .right .cart{position:relative}
nav .right .cart .n{position:absolute;top:-6px;right:-10px;background:var(--accent-2);color:#fff;font-size:.62rem;font-weight:700;border-radius:999px;padding:1px 5px}
.hero{padding:90px 0 70px;text-align:center;background:radial-gradient(600px 320px at 50% -20%,#fde4e8,transparent 60%)}
.hero .kicker{font-size:.74rem;text-transform:uppercase;letter-spacing:.22em;color:var(--accent-2);font-weight:700;margin-bottom:16px}
.hero h1{font-size:clamp(2.2rem,5.5vw,3.6rem);letter-spacing:-.035em;line-height:1.1}
.hero p{color:var(--muted);margin-top:16px;font-size:1.05rem}
.cats{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:30px}
.cats button{background:none;border:1px solid var(--line);border-radius:999px;padding:8px 18px;font-size:.86rem;cursor:pointer;color:var(--muted);transition:all .15s}
.cats button:hover{border-color:var(--fg);color:var(--fg)}
.cats button.on{background:var(--fg);color:#fff;border-color:var(--fg)}
.products{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:26px;padding:50px 0 90px}
.product .img{height:240px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,#f0f0f3,#e0e0e6);margin-bottom:14px;transition:transform .2s}
.product:hover .img{transform:scale(1.02)}
.product .cat{font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}
.product h3{font-size:1rem;margin:4px 0 2px}
.product .pr{font-weight:700;font-size:.95rem}
.product .old{color:var(--muted);text-decoration:line-through;font-weight:400;margin-right:8px;font-size:.85rem}
.product .pr.sale{color:var(--accent-2)}
.cta-band{background:#fafafa;border-top:1px solid var(--line);padding:70px 0;text-align:center}
.cta-band h2{font-size:1.6rem;letter-spacing:-.02em}
.cta-band p{color:var(--muted);margin:10px 0 24px}
.btn{display:inline-block;background:var(--fg);color:#fff;border-radius:999px;padding:12px 26px;font-size:.9rem;font-weight:600;transition:background .15s,transform .15s}
.btn:hover{background:var(--accent-2);transform:translateY(-1px)}
footer{border-top:1px solid var(--line);padding:32px 0;text-align:center;color:var(--muted);font-size:.84rem}
footer .links{display:flex;gap:20px;justify-content:center;margin-bottom:10px}
@media (max-width:640px){.hero{padding:70px 0 50px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const storeJs = String.raw`// Webpress Store — category filter + cart count demo
(function(){
  var btns=document.querySelectorAll(".cats button");
  var items=document.querySelectorAll(".product");
  var count=document.querySelector(".cart .n");
  var n=0;
  btns.forEach(function(b){
    b.addEventListener("click",function(){
      btns.forEach(function(x){x.classList.remove("on");});
      b.classList.add("on");
      var cat=b.dataset.cat;
      items.forEach(function(p){
        p.style.display=(!cat||p.dataset.cat===cat)?"block":"none";
      });
    });
  });
  document.querySelectorAll(".product").forEach(function(p){
    p.style.cursor="pointer";
    p.addEventListener("click",function(){
      n++; if(count)count.textContent=n;
      var nm=p.querySelector("h3"); if(nm)nm.animate([{transform:"scale(1)"},{transform:"scale(1.06)"},{transform:"scale(1)"}],{duration:240});
    });
  });
})();`;

const storeHome = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kindred Goods — everyday objects, made to last</title>
<meta name="description" content="Kindred Goods sells a small, thoughtful collection of everyday objects — ceramics, textiles and tools made to last.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav aria-label="Main">
  <div class="container">
    <a class="brand" href="index.html">Kindred Goods</a>
    <div class="right">
      <a href="#shop">Shop</a>
      <a href="#about">About</a>
      <span class="cart">🛍<span class="n">0</span></span>
    </div>
  </div>
</nav>

<header class="hero">
  <div class="container">
    <p class="kicker">Small batch · Fairly made</p>
    <h1>Everyday objects, made to last</h1>
    <p>A small, thoughtful collection from independent makers — ceramics, textiles and tools you'll keep for decades.</p>
    <div class="cats" role="group" aria-label="Filter products">
      <button data-cat="" class="on">All</button>
      <button data-cat="ceramics">Ceramics</button>
      <button data-cat="textiles">Textiles</button>
      <button data-cat="tools">Tools</button>
      <button data-cat="stationery">Stationery</button>
    </div>
  </div>
</header>

<main>
  <section id="shop">
    <div class="container">
      <div class="products" id="products">
        <article class="product" data-cat="ceramics"><div class="img">🏺</div><p class="cat">Ceramics</p><h3>Speckled mug, 350ml</h3><p class="pr">$28</p></article>
        <article class="product" data-cat="ceramics"><div class="img">🥣</div><p class="cat">Ceramics</p><h3>Rim bowl set of 2</h3><p class="pr">$42</p></article>
        <article class="product" data-cat="textiles"><div class="img">🧣</div><p class="cat">Textiles</p><h3>Honeycomb throw</h3><p class="pr"><span class="old">$120</span> $96</p></article>
        <article class="product" data-cat="textiles"><div class="img">🧵</div><p class="cat">Textiles</p><h3>Linen napkins, 4-pack</h3><p class="pr">$34</p></article>
        <article class="product" data-cat="tools"><div class="img">🔪</div><p class="cat">Tools</p><h3>Carbon chef's knife</h3><p class="pr">$145</p></article>
        <article class="product" data-cat="tools"><div class="img">🪵</div><p class="cat">Tools</p><h3>Olive wood board</h3><p class="pr">$58</p></article>
        <article class="product" data-cat="stationery"><div class="img">📓</div><p class="cat">Stationery</p><h3>Stitched notebook, A5</h3><p class="pr">$18</p></article>
        <article class="product" data-cat="stationery"><div class="img">🖋️</div><p class="cat">Stationery</p><h3>Brass fountain pen</h3><p class="pr">$76</p></article>
      </div>
    </div>
  </section>

  <section class="cta-band" id="about">
    <div class="container">
      <h2>Small shops, big craft</h2>
      <p>Every item is made by an independent maker we know by name. Ships carbon-neutral, returns always free.</p>
      <a class="btn" href="#shop">Browse the collection</a>
    </div>
  </section>
</main>

<footer>
  <div class="links"><a href="#shop">Shop</a><a href="#about">About</a><a href="mailto:hello@kindredgoods.example">Contact</a></div>
  <div>© 2026 Kindred Goods · Made with Webpress</div>
</footer>
<script src="js/app.js" defer></script>
</body>
</html>`;

export const RESTAURANT_TEMPLATE: TemplateDef = {
  id: "restaurant",
  name: "Restaurant",
  category: "Restaurant",
  description: "Warm wood-fired restaurant site with menu, story, gallery and visit info.",
  tags: ["dark", "serif", "food", "local"],
  pages: [
    { path: "/", title: "Ember & Oak — Wood-fired kitchen", description: "Ember & Oak is a wood-fired restaurant in the old town — seasonal plates, natural wines and a hearth that never goes out." },
    { path: "/menu", title: "Menu — Ember & Oak", description: "The full menu at Ember & Oak — wood-fired small plates, mains, sides and desserts." },
  ],
  files: [
    { path: "index.html", content: restaurantHome, kind: "file", mime: "text/html" },
    { path: "menu.html", content: restaurantMenu, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: restaurantCss, kind: "file", mime: "text/css" },
  ],
};

export const AGENCY_TEMPLATE: TemplateDef = {
  id: "agency",
  name: "Agency",
  category: "Agency",
  description: "Design studio site with services, case studies, process and a strong CTA.",
  tags: ["light", "studio", "services", "cases"],
  pages: [
    { path: "/", title: "North & Found — Digital design studio", description: "North & Found is a digital design studio helping ambitious companies design, build and ship products people love." },
    { path: "/work", title: "Work — North & Found", description: "Selected projects by North & Found: product design, design systems and engineering for ambitious companies." },
  ],
  files: [
    { path: "index.html", content: agencyHome, kind: "file", mime: "text/html" },
    { path: "work.html", content: agencyWork, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: agencyCss, kind: "file", mime: "text/css" },
  ],
};

export const STORE_TEMPLATE: TemplateDef = {
  id: "store",
  name: "Store",
  category: "Ecommerce",
  description: "Small-batch shop with filterable product grid and a working cart-count demo.",
  tags: ["light", "shop", "products", "ecommerce"],
  pages: [{ path: "/", title: "Kindred Goods — everyday objects, made to last", description: "Kindred Goods sells a small, thoughtful collection of everyday objects — ceramics, textiles and tools made to last." }],
  files: [
    { path: "index.html", content: storeHome, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: storeCss, kind: "file", mime: "text/css" },
    { path: "js/app.js", content: storeJs, kind: "file", mime: "text/javascript" },
  ],
};

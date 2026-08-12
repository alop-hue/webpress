import type { TemplateDef } from "./index";

const linktreeCss = String.raw`/* Link in Bio — Webpress template */
:root{--bg:#0e0f1a;--card:#171826;--fg:#f4f4f8;--muted:#a0a1b5;--accent:#8b5cf6;--accent-2:#ec4899;--border:#262740;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:radial-gradient(1200px 600px at 50% -10%,rgba(139,92,246,.22),transparent 60%),radial-gradient(900px 500px at 85% 110%,rgba(236,72,153,.14),transparent 55%),var(--bg);color:var(--fg);font-family:var(--font);min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:40px 20px;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.profile{width:100%;max-width:420px;text-align:center}
.avatar{width:96px;height:96px;border-radius:50%;margin:0 auto 16px;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800;color:#fff;box-shadow:0 12px 40px -8px rgba(139,92,246,.5)}
.handle{font-size:20px;font-weight:700;letter-spacing:-.01em}
.tagline{color:var(--muted);font-size:14px;margin-top:6px;line-height:1.5}
.bio{margin:18px auto 26px;max-width:340px;color:var(--muted);font-size:13.5px;line-height:1.6}
.links{display:flex;flex-direction:column;gap:12px}
.tile{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:15px 18px;font-size:14.5px;font-weight:600;transition:transform .15s,border-color .2s,background .2s}
.tile:hover{transform:translateY(-2px);border-color:var(--accent);background:#1c1d31}
.tile .ico{font-size:17px}
.tile .ext{margin-left:auto;color:var(--muted);font-size:13px;font-weight:500}
.foot{margin-top:30px;color:#6b6c82;font-size:12px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const linktreeJs = String.raw`// Webpress Link in Bio
(function(){
  var tiles=document.querySelectorAll(".tile");
  tiles.forEach(function(t){t.setAttribute("role","link");t.setAttribute("tabindex","0");});
})();`;

const linktree = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@amara — Link in bio</title>
<meta name="description" content="Everything Amara — projects, writing, talks and more in one place.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<main class="profile">
  <div class="avatar">A</div>
  <h1 class="handle">@amara</h1>
  <p class="tagline">Designer · Builder · Coffee enthusiast</p>
  <p class="bio">I design calm software and write about the craft. Tap a link below — every road leads somewhere good.</p>
  <nav class="links" aria-label="Links">
    <a class="tile" href="https://example.com/portfolio"><span class="ico">🎨</span> Portfolio<span class="ext">→</span></a>
    <a class="tile" href="https://example.com/writing"><span class="ico">✍️</span> Writing & essays<span class="ext">→</span></a>
    <a class="tile" href="https://example.com/talks"><span class="ico">🎤</span> Talks & workshops<span class="ext">→</span></a>
    <a class="tile" href="https://example.com/opensource"><span class="ico">🛠️</span> Open source<span class="ext">→</span></a>
    <a class="tile" href="https://example.com/newsletter"><span class="ico">📬</span> Newsletter<span class="ext">→</span></a>
    <a class="tile" href="mailto:hello@example.com"><span class="ico">💌</span> Say hello<span class="ext">→</span></a>
  </nav>
  <p class="foot">Made with Webpress</p>
</main>
<script src="js/app.js" defer></script>
</body>
</html>`;

const personalCss = String.raw`/* Personal resume — Webpress template */
:root{--bg:#faf9f7;--fg:#1c1b19;--muted:#6f6b64;--line:#e7e4de;--accent:#c2410c;--max:960px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;display:block}
.wrap{max-width:var(--max);margin:0 auto;padding:0 28px}
header.top{display:flex;justify-content:space-between;align-items:center;padding:26px 0;border-bottom:1px solid var(--line)}
header.top .name{font-weight:700;letter-spacing:-.02em}
header.top nav{display:flex;gap:24px}
header.top nav a{color:var(--muted);font-size:14px}
header.top nav a:hover{color:var(--fg)}
.hero{padding:90px 0 60px}
.hero h1{font-size:clamp(2.2rem,6vw,3.4rem);letter-spacing:-.03em;line-height:1.1;max-width:640px}
.hero h1 em{color:var(--accent);font-style:italic}
.hero .lede{color:var(--muted);font-size:1.1rem;max-width:560px;margin-top:20px}
.cta{margin-top:32px;display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-block;border:1px solid var(--fg);border-radius:999px;padding:11px 22px;font-size:14px;font-weight:600}
.btn:hover{background:var(--fg);color:var(--bg);text-decoration:none}
.btn.ghost{border-color:var(--line);color:var(--muted)}
.btn.ghost:hover{border-color:var(--fg);color:var(--fg);background:transparent}
section.block{padding:64px 0;border-top:1px solid var(--line)}
section.block h2{font-size:1.4rem;letter-spacing:-.02em;margin-bottom:34px}
.timeline{border-left:1px solid var(--line);padding-left:26px;display:flex;flex-direction:column;gap:34px}
.timeline .item h3{font-size:1.05rem}
.timeline .item .meta{color:var(--muted);font-size:.86rem;margin-top:3px}
.timeline .item p{color:var(--muted);font-size:.93rem;margin-top:8px;max-width:640px}
.skills{display:flex;flex-wrap:wrap;gap:10px}
.skills span{border:1px solid var(--line);border-radius:999px;padding:7px 16px;font-size:13px}
.ed{display:flex;flex-direction:column;gap:20px}
.ed .d{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:14px}
.ed .d:last-child{border-bottom:none}
.ed .d .when{color:var(--muted);font-size:.86rem}
.contact{display:flex;gap:22px;flex-wrap:wrap;color:var(--muted);font-size:14px}
footer.foot{border-top:1px solid var(--line);padding:30px 0;text-align:center;color:var(--muted);font-size:.84rem}
@media (max-width:640px){header.top nav{display:none}.hero{padding:60px 0 44px}}`;

const personal = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Alex Marlow — Product designer</title>
<meta name="description" content="Alex Marlow is a product designer and front-end developer in London, building calm tools for ambitious teams.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="top wrap">
  <span class="name">Alex Marlow</span>
  <nav aria-label="Sections"><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#contact">Contact</a></nav>
</header>

<main>
  <section class="hero wrap">
    <h1>Product designer building <em>calm, useful</em> software.</h1>
    <p class="lede">Ten years designing interfaces for startups and studios — from first sketch to shipped pixels. Currently leading design at a climate-tech scaleup.</p>
    <div class="cta">
      <a class="btn" href="mailto:alex@example.com">Get in touch</a>
      <a class="btn ghost" href="#experience">See experience</a>
    </div>
  </section>

  <section class="block" id="experience">
    <div class="wrap">
      <h2>Experience</h2>
      <div class="timeline">
        <article class="item">
          <h3>Lead Product Designer — Verdant Energy</h3>
          <p class="meta">2022 — present · London</p>
          <p>Designing the home-energy dashboard used by 400k households. Grew the design system to 120+ components and lifted onboarding completion 28%.</p>
        </article>
        <article class="item">
          <h3>Senior Designer — Fieldnotes</h3>
          <p class="meta">2019 — 2022 · Remote</p>
          <p>Owned design for a reading app's subscription flow and iOS experience. App Store rating: 4.8★ across 12k reviews.</p>
        </article>
        <article class="item">
          <h3>Product Designer — Studio North</h3>
          <p class="meta">2016 — 2019 · Manchester</p>
          <p>Designed websites and products for 30+ clients including two FTSE 100 companies and a national museum.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="block" id="skills">
    <div class="wrap">
      <h2>Skills & tools</h2>
      <div class="skills">
        <span>Product design</span><span>Design systems</span><span>Prototyping</span><span>HTML/CSS</span><span>React</span><span>User research</span><span>Accessibility</span><span>Figma</span>
      </div>
    </div>
  </section>

  <section class="block" id="education">
    <div class="wrap">
      <h2>Education</h2>
      <div class="ed">
        <div class="d"><div><strong>BA Interaction Design</strong> — Central Saint Martins</div><span class="when">2012 — 2015</span></div>
      </div>
    </div>
  </section>

  <section class="block" id="contact">
    <div class="wrap">
      <h2>Contact</h2>
      <div class="contact">
        <a href="mailto:alex@example.com">alex@example.com</a>
        <a href="https://www.linkedin.com">LinkedIn</a>
        <a href="https://github.com">GitHub</a>
        <a href="https://twitter.com">Twitter / X</a>
      </div>
    </div>
  </section>
</main>

<footer class="foot"><div class="wrap">© 2026 Alex Marlow · Made with Webpress</div></footer>
</body>
</html>`;

const chatbotCss = String.raw`/* AI Chatbot — Webpress template */
:root{--bg:#0a0a0f;--fg:#f4f4f5;--muted:#a1a1aa;--border:#27272a;--accent:#6366f1;--accent-2:#22d3ee;--card:#131318;--max:1120px;--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.container{max-width:var(--max);margin:0 auto;padding:0 24px}
nav{position:sticky;top:0;z-index:40;background:rgba(10,10,15,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
nav .container{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-weight:700;letter-spacing:-.02em}
.brand span{color:var(--accent)}
nav .nav-cta{display:flex;gap:12px;align-items:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;padding:10px 18px;font-size:.92rem;font-weight:600;border:1px solid transparent;cursor:pointer;transition:background .15s,transform .15s}
.btn:hover{transform:translateY(-1px)}
.btn-primary{background:var(--accent);color:#fff}
.btn-ghost{border-color:var(--border);color:var(--fg)}
.btn-ghost:hover{border-color:#3f3f46}
.hero{padding:110px 0 80px;text-align:center;background:radial-gradient(700px 400px at 50% -20%,rgba(99,102,241,.25),transparent 65%)}
.hero .badge{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:999px;padding:6px 14px;font-size:.8rem;color:var(--muted);margin-bottom:26px}
.hero h1{font-size:clamp(2.3rem,6vw,4rem);line-height:1.08;letter-spacing:-.035em;font-weight:800;margin-bottom:22px}
.hero h1 .grad{background:linear-gradient(90deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{color:var(--muted);font-size:clamp(1rem,2vw,1.2rem);max-width:600px;margin:0 auto 34px}
.hero .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
section{padding:84px 0}
.sec-head{text-align:center;max-width:600px;margin:0 auto 54px}
.sec-head .kicker{color:var(--accent);font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;margin-bottom:12px}
.sec-head h2{font-size:clamp(1.7rem,4vw,2.4rem);letter-spacing:-.03em;font-weight:800;margin-bottom:14px}
.sec-head p{color:var(--muted)}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.card{border:1px solid var(--border);border-radius:16px;padding:26px;background:var(--card);transition:border-color .2s,transform .2s}
.card:hover{border-color:#3f3f46;transform:translateY(-3px)}
.card .ico{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:rgba(99,102,241,.14);margin-bottom:16px}
.card h3{font-size:1.02rem;margin-bottom:8px}
.card p{color:var(--muted);font-size:.9rem}
.chat-demo{margin:0 auto;max-width:640px}
.chat-frame{border:1px solid var(--border);border-radius:18px;overflow:hidden;background:var(--card);box-shadow:0 30px 80px -30px rgba(99,102,241,.35)}
.chat-head{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--border);font-weight:600;font-size:.92rem}
.chat-head .dot{width:9px;height:9px;border-radius:50%;background:var(--accent-2)}
.chat-body{height:320px;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px}
.msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:.88rem;line-height:1.5;white-space:pre-wrap}
.msg.bot{background:#1d1d26;align-self:flex-start;border-bottom-left-radius:4px}
.msg.user{background:var(--accent);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.chat-input{display:flex;gap:10px;padding:12px;border-top:1px solid var(--border)}
.chat-input input{flex:1;background:#1d1d26;border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--fg);font-size:.9rem;outline:none}
.chat-input input:focus{border-color:var(--accent)}
.chat-input button{background:var(--accent);color:#fff;border:none;border-radius:10px;padding:0 18px;font-weight:600;cursor:pointer;font-size:.9rem}
.chat-input button:hover{background:#4f46e5}
.quick{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:14px}
.quick button{background:none;border:1px solid var(--border);color:var(--muted);border-radius:999px;padding:7px 14px;font-size:.8rem;cursor:pointer;transition:color .15s,border-color .15s}
.quick button:hover{color:var(--fg);border-color:#3f3f46}
.cta{text-align:center;padding:90px 0}
.cta h2{font-size:clamp(1.7rem,4vw,2.6rem);letter-spacing:-.03em;font-weight:800;margin-bottom:14px}
.cta p{color:var(--muted);max-width:480px;margin:0 auto 30px}
footer{border-top:1px solid var(--border);padding:30px 0;text-align:center;color:#71717a;font-size:.84rem}
@media (max-width:768px){.hero{padding:80px 0 60px}section{padding:60px 0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const chatbotJs = String.raw`// Webpress AI Chatbot demo — rule-based assistant
(function(){
  var body=document.getElementById("chatBody");
  var input=document.getElementById("chatInput");
  var send=document.getElementById("chatSend");
  if(!body||!input||!send)return;
  var canned={
    pricing:"Our plans start free — 200 messages/month. Pro is $12/mo for unlimited messages, custom training and priority support.",
    features:"Pulse handles FAQs 24/7, books meetings, captures leads and escalates to a human with full context. It learns from your docs.",
    privacy:"Your data stays yours. Chats are encrypted in transit and at rest, and we never train models on your conversations.",
    install:"Drop one line of JavaScript into your site and the widget appears. No backend to manage — it works in minutes.",
    human:"You can reach a human anytime at hello@example.com or use the chat widget — we reply within a few hours.",
    default:"I can help with pricing, features, privacy, installation or reaching a human. Try one of the quick questions below!"
  };
  function reply(q){
    var t=q.toLowerCase();
    if(/(price|cost|plan|free)/.test(t))return canned.pricing;
    if(/(feature|what can|do you)/.test(t))return canned.features;
    if(/(privacy|data|secure)/.test(t))return canned.privacy;
    if(/(install|setup|code|widget)/.test(t))return canned.install;
    if(/(human|person|real|support)/.test(t))return canned.human;
    return canned.default;
  }
  function add(text,who){
    var m=document.createElement("div");
    m.className="msg "+who;
    m.textContent=text;
    body.appendChild(m);
    body.scrollTop=body.scrollHeight;
  }
  function ask(q){
    if(!q.trim())return;
    input.value="";
    add(q,"user");
    setTimeout(function(){add(reply(q),"bot");},450+Math.random()*450);
  }
  send.addEventListener("click",function(){ask(input.value);});
  input.addEventListener("keydown",function(e){if(e.key==="Enter")ask(input.value);});
  document.querySelectorAll(".quick button").forEach(function(b){
    b.addEventListener("click",function(){ask(b.dataset.q||b.textContent);});
  });
  setTimeout(function(){add("👋 Hi! I'm Pulse. Ask me anything about the product.","bot");},600);
})();`;

const chatbot = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pulse — AI customer support for your website</title>
<meta name="description" content="Pulse answers your customers' questions instantly — right inside your site. No backend, no training data, no waiting.">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<nav aria-label="Main">
  <div class="container">
    <a class="brand" href="index.html">Pulse<span>.</span></a>
    <div class="nav-cta"><a class="btn btn-primary" href="#chat">Try the demo</a></div>
  </div>
</nav>

<header class="hero">
  <div class="container">
    <span class="badge">⚡ Installs in minutes</span>
    <h1>Your customers' questions, <span class="grad">answered instantly</span></h1>
    <p>Pulse is an AI support agent that lives on your website. It answers FAQs, captures leads and hands off to humans — without a helpdesk.</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="#chat">Try the live demo</a>
      <a class="btn btn-ghost" href="#features">See features</a>
    </div>
  </div>
</header>

<main>
  <section id="features">
    <div class="container">
      <div class="sec-head"><div class="kicker">Why Pulse</div><h2>Support that never sleeps</h2><p>Customers get answers at 3am, in their language, in under a second.</p></div>
      <div class="grid">
        <article class="card"><div class="ico">💬</div><h3>Instant answers</h3><p>Responds to common questions immediately, trained on your docs, pricing and policies.</p></article>
        <article class="card"><div class="ico">🎯</div><h3>Lead capture</h3><p>Collects emails and intents when visitors are ready to buy — synced to your CRM.</p></article>
        <article class="card"><div class="ico">🔄</div><h3>Human hand-off</h3><p>Escalates complex questions to your team with the full conversation attached.</p></article>
        <article class="card"><div class="ico">🔒</div><h3>Private by design</h3><p>Your data is never used to train shared models. EU hosting by default.</p></article>
        <article class="card"><div class="ico">🌐</div><h3>30+ languages</h3><p>Auto-detects the visitor's language and answers in it. No setup needed.</p></article>
        <article class="card"><div class="ico">📊</div><h3>Missed-answer reports</h3><p>See which questions it couldn't answer and close the gap with one click.</p></article>
      </div>
    </div>
  </section>

  <section id="chat">
    <div class="container">
      <div class="sec-head"><div class="kicker">Live demo</div><h2>Talk to Pulse right now</h2><p>This is a real chat widget — ask it about pricing, features or privacy.</p></div>
      <div class="chat-demo">
        <div class="chat-frame">
          <div class="chat-head"><span class="dot"></span> Pulse Assistant</div>
          <div class="chat-body" id="chatBody" aria-live="polite"></div>
          <div class="chat-input">
            <input id="chatInput" type="text" placeholder="Ask anything…" aria-label="Ask Pulse a question">
            <button id="chatSend">Send</button>
          </div>
        </div>
        <div class="quick">
          <button data-q="How much does Pulse cost?">Pricing</button>
          <button data-q="What features does it have?">Features</button>
          <button data-q="Is my data private?">Privacy</button>
          <button data-q="Can I talk to a human?">Human</button>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <h2>Add Pulse to your site tonight</h2>
      <p>One line of JavaScript. Your customers get answers immediately. You get your evenings back.</p>
      <a class="btn btn-primary" href="#chat">Start free</a>
    </div>
  </section>
</main>

<footer>© 2026 Pulse · Made with Webpress</footer>
<script src="js/app.js" defer></script>
</body>
</html>`;

export const LINKTREE_TEMPLATE: TemplateDef = {
  id: "linktree",
  name: "Link in Bio",
  category: "Personal",
  description: "A single profile page for all your links — perfect for social bios, podcasts and creators.",
  tags: ["dark", "gradient", "profile", "social"],
  pages: [{ path: "/", title: "@amara — Link in bio", description: "Everything Amara — projects, writing, talks and more in one place." }],
  files: [
    { path: "index.html", content: linktree, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: linktreeCss, kind: "file", mime: "text/css" },
    { path: "js/app.js", content: linktreeJs, kind: "file", mime: "text/javascript" },
  ],
};

export const PERSONAL_TEMPLATE: TemplateDef = {
  id: "personal",
  name: "Personal Resume",
  category: "Personal",
  description: "Clean single-page resume with experience timeline, skills and contact.",
  tags: ["light", "resume", "minimal", "career"],
  pages: [{ path: "/", title: "Alex Marlow — Product designer", description: "Alex Marlow is a product designer and front-end developer in London, building calm tools for ambitious teams." }],
  files: [
    { path: "index.html", content: personal, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: personalCss, kind: "file", mime: "text/css" },
  ],
};

export const CHATBOT_TEMPLATE: TemplateDef = {
  id: "chatbot",
  name: "AI Chatbot",
  category: "AI",
  description: "A landing page with a working chat widget demo — ask it questions and get instant answers.",
  tags: ["AI", "chat", "dark", "landing"],
  pages: [{ path: "/", title: "Pulse — AI customer support for your website", description: "Pulse answers your customers' questions instantly — right inside your site. No backend, no training data, no waiting." }],
  files: [
    { path: "index.html", content: chatbot, kind: "file", mime: "text/html" },
    { path: "css/style.css", content: chatbotCss, kind: "file", mime: "text/css" },
    { path: "js/app.js", content: chatbotJs, kind: "file", mime: "text/javascript" },
  ],
};

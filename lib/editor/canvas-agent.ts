/**
 * Canvas Agent — injected into the editor preview iframe.
 * Makes the real document visually editable: selection, hover,
 * text editing, structural ops, style sync, serialization.
 * Talks to the host page over postMessage (type "wp.*").
 * Never runs on public pages — only injected by the editor.
 */

export const canvasAgentSource = String.raw`
(function () {
  if (window.__wpAgent) return;
  window.__wpAgent = true;
  var selectedPath = null;
  var hoverPath = null;
  var editing = false;
  var lastClick = 0;

  function resolve(path) {
    if (!path || !path.length) return null;
    var node = document.body;
    for (var i = 0; i < path.length; i++) {
      if (path[i] >= node.children.length) return null;
      node = node.children[path[i]];
    }
    return node;
  }
  function indexOf(node) {
    var p = node.parentNode;
    return p ? Array.prototype.indexOf.call(p.children, node) : -1;
  }
  function pathOf(node) {
    var p = [];
    var cur = node;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      p.unshift(indexOf(cur));
      cur = cur.parentNode;
    }
    return p;
  }
  function info(node) {
    var r = node.getBoundingClientRect();
    return {
      tag: node.tagName ? node.tagName.toLowerCase() : "text",
      id: node.id || "",
      classes: node.className && typeof node.className === "string" ? node.className.split(/\s+/).filter(Boolean) : [],
      text: (node.textContent || "").slice(0, 140),
      href: node.getAttribute ? node.getAttribute("href") || "" : "",
      src: node.getAttribute ? node.getAttribute("src") || "" : "",
      raw: node.hasAttribute ? node.hasAttribute("data-wp-raw") : false,
      component: node.getAttribute ? node.getAttribute("data-wp-component") || "" : "",
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      path: pathOf(node),
      editable: isTextEditable(node)
    };
  }
  function post(type, payload) {
    try { parent.postMessage(Object.assign({ type: type }, payload || {}), "*"); } catch (e) {}
  }
  function postSelect(node) {
    if (!node) return;
    selectedPath = pathOf(node);
    var i = info(node);
    highlight();
    post("wp.select", i);
  }
  function clearSel() {
    selectedPath = null;
    highlight();
    post("wp.clear", {});
  }
  function highlight() {
    document.querySelectorAll(".wp-sel,.wp-hover").forEach(function (el) {
      el.classList.remove("wp-sel");
      el.classList.remove("wp-hover");
    });
    if (hoverPath) { var h = resolve(hoverPath); if (h) h.classList.add("wp-hover"); }
    if (selectedPath) { var s = resolve(selectedPath); if (s) s.classList.add("wp-sel"); }
  }
  function isTextEditable(el) {
    if (!el) return false;
    var t = el.tagName;
    if (!t) return false;
    if (t === "IMG" || t === "VIDEO" || t === "IFRAME" || t === "SVG" || t === "SCRIPT" || t === "STYLE" || t === "TEXTAREA" || t === "INPUT" || t === "SELECT") return false;
    if (el.getAttribute && el.getAttribute("data-wp-raw") === "true") return false;
    var kids = el.children;
    for (var i = 0; i < kids.length; i++) {
      var kt = kids[i].tagName;
      if (kt !== "BR" && kt !== "SPAN" && kt !== "STRONG" && kt !== "EM" && kt !== "A" && kt !== "B" && kt !== "I" && kt !== "CODE") return false;
    }
    return true;
  }
  function beginEdit(el) {
    if (editing) return;
    if (!isTextEditable(el)) {
      post("wp.toast", { text: "Structured content — edit in the right panel or Code mode." });
      return;
    }
    editing = true;
    el.setAttribute("contenteditable", "true");
    el.focus();
    var sel = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
    function doneEdit() {
      editing = false;
      el.removeAttribute("contenteditable");
      el.removeEventListener("blur", doneEdit);
      var t = (el.textContent || "").trim();
      post("wp.text", { path: pathOf(el), text: t });
    }
    el.addEventListener("blur", doneEdit);
    el.addEventListener("keydown", function onKey(e) {
      var t = el.tagName;
      if (e.key === "Enter") {
        if ((t === "p" || t === "h1" || t === "h2" || t === "h3" || t === "h4" || t === "h5" || t === "li" || t === "span" || t === "a" || t === "button" || t === "div") && !e.shiftKey) {
          e.preventDefault();
          el.blur();
        }
      }
      if (e.key === "Escape") { e.preventDefault(); el.blur(); }
    });
  }

  // ---- pointer ----
  document.addEventListener("mouseover", function (e) {
    var t = e.target;
    if (!(t instanceof Element) || !t.closest || t.closest("#wp-el-styles")) return;
    hoverPath = pathOf(t);
    highlight();
  }, false);
  document.addEventListener("mouseout", function () {
    if (hoverPath) { hoverPath = null; highlight(); }
  }, false);
  document.addEventListener("mousedown", function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    if (editing || (t.closest && t.closest("#wp-el-styles"))) return;
    e.preventDefault();
    e.stopPropagation();
    postSelect(t);
    var now = Date.now();
    if (now - lastClick < 350) beginEdit(t);
    lastClick = now;
  }, true);
  document.addEventListener("dblclick", function (e) {
    var t = e.target;
    if (!(t instanceof Element) || editing) return;
    e.preventDefault();
    e.stopPropagation();
    postSelect(t);
    beginEdit(t);
  }, true);

  // ---- keyboard ----
  document.addEventListener("keydown", function (e) {
    if (editing || !selectedPath) return;
    var el = resolve(selectedPath);
    if (!el) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      post("wp.action", { action: "delete", path: selectedPath });
    } else if (e.key === "Escape") {
      clearSel();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      post("wp.action", { action: "move", path: selectedPath, dir: "up" });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      post("wp.action", { action: "move", path: selectedPath, dir: "down" });
    }
  }, true);

  // ---- prevent nav / submit ----
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (a && a.getAttribute("href") && !a.getAttribute("target")) {
      e.preventDefault();
      e.stopPropagation();
      post("wp.linkclick", { href: a.getAttribute("href") });
    }
  }, true);
  document.addEventListener("submit", function (e) {
    e.preventDefault();
    post("wp.submit", {});
  }, true);

  // ---- RPC ops ----
  function applyStyle(sel, css) {
    var el = resolve(sel);
    if (!el || !css) return false;
    Object.keys(css).forEach(function (p) { el.style[p] = css[p]; });
    post("wp.state", {});
    return true;
  }
  function setAttr(sel, name, value) {
    var el = resolve(sel);
    if (!el) return false;
    if (value === null || value === undefined || value === "") el.removeAttribute(name);
    else el.setAttribute(name, value);
    post("wp.state", {});
    return true;
  }
  function setText(sel, text) {
    var el = resolve(sel);
    if (!el) return false;
    el.textContent = text;
    postSelect(el);
    post("wp.state", {});
    return true;
  }
  function setHtml(sel, html) {
    var el = resolve(sel);
    if (!el) return false;
    el.innerHTML = html;
    postSelect(el);
    post("wp.state", {});
    return true;
  }
  function del(sel) {
    var el = resolve(sel);
    if (!el || !el.parentNode || el === document.body) return false;
    el.parentNode.removeChild(el);
    selectedPath = null;
    highlight();
    post("wp.state", {});
    return true;
  }
  function duplicate(sel) {
    var el = resolve(sel);
    if (!el || !el.parentNode) return false;
    var copy = el.cloneNode(true);
    copy.removeAttribute("data-wp-el");
    el.parentNode.insertBefore(copy, el.nextSibling);
    postSelect(copy);
    post("wp.state", {});
    return true;
  }
  function move(sel, dir) {
    var el = resolve(sel);
    if (!el || !el.parentNode) return false;
    var i = indexOf(el);
    if (dir === "up" && i > 0) el.parentNode.insertBefore(el, el.parentNode.children[i - 1]);
    else if (dir === "down" && i < el.parentNode.children.length - 1) el.parentNode.insertBefore(el, el.parentNode.children[i + 1]);
    else return false;
    postSelect(el);
    post("wp.state", {});
    return true;
  }
  function insert(html, parentSel, position) {
    var parent = parentSel ? resolve(parentSel) : document.body;
    if (!parent) return false;
    var div = document.createElement("div");
    div.innerHTML = html;
    var nodes = [];
    while (div.firstChild) { nodes.push(div.firstChild); div.removeChild(div.firstChild); }
    if (position === "end") nodes.forEach(function (n) { parent.appendChild(n); });
    else nodes.forEach(function (n) { parent.insertBefore(n, parent.firstChild); });
    post("wp.state", {});
    return true;
  }
  function syncStyles(css) {
    var tag = document.getElementById("wp-el-styles");
    if (!tag) {
      tag = document.createElement("style");
      tag.id = "wp-el-styles";
      document.head.appendChild(tag);
    }
    tag.textContent = css || "";
  }
  function snapshot() {
    var clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll(".wp-sel,.wp-hover").forEach(function (el) {
      el.classList.remove("wp-sel");
      el.classList.remove("wp-hover");
    });
    return "<!DOCTYPE html>\\n" + clone.outerHTML;
  }
  function updateNode(sel, patch) {
    var el = resolve(sel);
    if (!el) return false;
    if (patch && patch.className !== undefined) el.className = patch.className;
    if (patch && patch.attrs) Object.keys(patch.attrs).forEach(function (k) { el.setAttribute(k, patch.attrs[k]); });
    post("wp.state", {});
    return true;
  }
  function getTree() {
    function walk(el) {
      var o = { t: el.tagName.toLowerCase(), p: pathOf(el), sel: el.classList.contains("wp-sel") };
      if (el.hasAttribute("data-wp-el")) o.id = el.getAttribute("data-wp-el");
      if (el.hasAttribute("data-wp-component")) o.c = el.getAttribute("data-wp-component");
      if (el.children.length) {
        o.k = [];
        for (var i = 0; i < el.children.length; i++) o.k.push(walk(el.children[i]));
      }
      return o;
    }
    var root = [];
    for (var j = 0; j < document.body.children.length; j++) root.push(walk(document.body.children[j]));
    return root;
  }
  function ensureUid(sel) {
    var el = resolve(sel);
    if (!el) return null;
    var uid = el.getAttribute("data-wp-el");
    if (!uid) {
      uid = "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      el.setAttribute("data-wp-el", uid);
      post("wp.state", {});
    }
    return uid;
  }
  function getHtml(sel) {
    var el = resolve(sel);
    return el ? el.outerHTML : null;
  }
  function replaceHtml(sel, html) {
    var el = resolve(sel);
    if (!el || !el.parentNode) return false;
    var div = document.createElement("div");
    div.innerHTML = html;
    var first = div.firstChild;
    if (!first) return false;
    el.parentNode.replaceChild(first, el);
    postSelect(first);
    post("wp.state", {});
    return true;
  }

  var handlers = {
    "select": function (sel) { var el = resolve(sel); if (el) postSelect(el); },
    "clear-selection": function () { clearSel(); },
    "set-style": applyStyle,
    "set-attr": setAttr,
    "set-text": setText,
    "set-html": setHtml,
    "delete": del,
    "duplicate": duplicate,
    "move": move,
    "insert": insert,
    "sync-styles": function (css) { syncStyles(css); },
    "snapshot": function () { return snapshot(); },
    "update-node": updateNode,
    "focus-text": function (sel) { var el = resolve(sel); if (el) beginEdit(el); },
    "scroll-to": function (sel) { var el = resolve(sel); if (el) el.scrollIntoView({ block: "center", behavior: "smooth" }); },
    "get-tree": function () { return getTree(); },
    "ensure-uid": function (sel) { return ensureUid(sel); },
    "get-html": function (sel) { return getHtml(sel); },
    "replace-html": function (sel, html) { return replaceHtml(sel, html); }
  };

  window.addEventListener("message", function (e) {
    var msg = e.data;
    if (!msg || typeof msg !== "object") return;
    if (msg.type === "wp.ping") { post("wp.pong", {}); return; }
    if (msg.type === "wp.rpc") {
      var h = handlers[msg.method];
      if (!h) { post("wp.rpc-res", { id: msg.id, ok: false, error: "unknown method " + msg.method }); return; }
      try {
        var res = h.apply(null, msg.args || []);
        post("wp.rpc-res", { id: msg.id, ok: true, result: res });
      } catch (err) {
        post("wp.rpc-res", { id: msg.id, ok: false, error: String(err) });
      }
    }
  }, false);

  post("wp.ready", { url: location.href });
})();
`;

export const DEFAULT_DOC = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Home</title>
</head>
<body></body>
</html>`;

/**
 * Inline relative <link rel="stylesheet"> and <script src> references with the
 * project's own file contents, so srcdoc iframes render styled without
 * resolving relative URLs against the editor's URL.
 */
export function inlineProjectAssets(doc: string, files: Record<string, { content: string }>): string {
  let out = doc;
  // CSS links
  out = out.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
    const m = tag.match(/href=["']([^"']+)["']/i);
    if (!m) return tag;
    const href = m[1];
    if (/^(https?:|\/\/|data:)/.test(href)) return tag;
    const key = href.replace(/^\.\//, "");
    const f = files[key];
    if (!f) return tag;
    return `<style data-wp-inline="${key}">${f.content}</style>`;
  });
  // JS scripts (inline the content; keep external scripts untouched)
  out = out.replace(/<script[^>]*src=["']([^"']+)["'][^>]*>(<\/script>)?/gi, (tag, src: string) => {
    if (/^(https?:|\/\/|data:)/.test(src)) return tag;
    const key = src.replace(/^\.\//, "");
    const f = files[key];
    if (!f) return "";
    return `<script data-wp-inline="${key}">${f.content}<\/script>`;
  });
  return out;
}

/** Build the srcdoc used by the visual canvas: real page + inlined assets + style tag + agent script */
export function buildSrcdoc(doc: string, styleCss = "", files: Record<string, { content: string }> = {}): string {
  if (!/<body/i.test(doc)) doc = DEFAULT_DOC;
  const styleTag = `<style data-wp-styles="1" id="wp-el-styles">${styleCss}</style>`;
  const agent = `\n<script data-wp-agent="1">${canvasAgentSource}</script>\n`;
  let out = inlineProjectAssets(doc, files);
  if (/<\/head>/i.test(out)) out = out.replace(/<\/head>/i, styleTag + "</head>");
  else out = out.replace(/<html[^>]*>/i, "$&" + styleTag);
  if (/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, agent + "</body>");
  else out = out.replace(/<\/html>/i, agent + "</html>");
  return out;
}
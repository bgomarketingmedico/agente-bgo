/* ══════════════════════════════════════════════════════════════
   B.GO — Captura de origem do lead (first-touch)
   Cole no site do cliente, antes do </body>, com:
   <script src="https://bgomarketingmedico.github.io/agente-bgo/bgo-origem.js"></script>

   O que faz: descobre de onde o visitante veio (Google orgânico,
   Instagram, tráfego pago, etc.) e repassa essa origem para os
   botões que apontam para a página WhatsApp (/agente-bgo/wa/...).
   Assim a planilha recebe "busca google orgânico" em vez de "direto".
═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var KEY = "bgo_origem";

  function detectar() {
    var p = new URLSearchParams(location.search);
    // 1) Campanhas marcadas (tráfego pago já vem com utm/click ids)
    if (p.get("utm_source")) {
      return { s: p.get("utm_source"), m: p.get("utm_medium") || "", c: p.get("utm_campaign") || "" };
    }
    if (p.get("gclid")) return { s: "google ads", m: "cpc", c: "" };
    if (p.get("fbclid")) return { s: "facebook ads", m: "cpc", c: "" };

    // 2) Sem campanha → olha de onde veio (referrer)
    var r = document.referrer || "";
    if (!r) return { s: "direto", m: "", c: "" };
    var h;
    try { h = new URL(r).hostname.toLowerCase(); } catch (e) { return { s: "direto", m: "", c: "" }; }

    // navegação dentro do próprio site → não sobrescreve a origem original
    if (h.indexOf(location.hostname) >= 0) return null;

    if (/(^|\.)google\./.test(h))      return { s: "busca google orgânico",     m: "organico", c: "" };
    if (/(^|\.)bing\./.test(h))        return { s: "busca bing orgânico",       m: "organico", c: "" };
    if (/(^|\.)yahoo\./.test(h))       return { s: "busca yahoo orgânico",      m: "organico", c: "" };
    if (/duckduckgo\./.test(h))        return { s: "busca duckduckgo orgânico", m: "organico", c: "" };
    if (/instagram\./.test(h))         return { s: "instagram orgânico",        m: "social",   c: "" };
    if (/(^|\.)facebook\.|(^|\.)fb\./.test(h)) return { s: "facebook orgânico", m: "social",   c: "" };
    if (/youtube\./.test(h))           return { s: "youtube orgânico",          m: "social",   c: "" };
    if (/linkedin\./.test(h))          return { s: "linkedin orgânico",         m: "social",   c: "" };
    if (/tiktok\./.test(h))            return { s: "tiktok orgânico",           m: "social",   c: "" };
    if (/t\.co|twitter\.|x\.com/.test(h)) return { s: "twitter orgânico",       m: "social",   c: "" };

    // qualquer outro site que indicou
    return { s: h.replace(/^www\./, ""), m: "referencia", c: "" };
  }

  // first-touch: grava a primeira origem externa da sessão
  var det = detectar();
  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) {}
  if (det && (!saved || saved.s === "direto")) {
    saved = det;
    try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
  }
  if (!saved) saved = { s: "direto", m: "", c: "" };

  // repassa a origem para os links da página WhatsApp
  function aplicar() {
    var links = document.querySelectorAll('a[href*="/agente-bgo/wa/"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var u = new URL(links[i].href, location.origin);
        if (!u.searchParams.get("utm_source")) {
          u.searchParams.set("utm_source", saved.s);
          if (saved.m) u.searchParams.set("utm_medium", saved.m);
          if (saved.c) u.searchParams.set("utm_campaign", saved.c);
          links[i].href = u.toString();
        }
      } catch (e) {}
    }
  }
  aplicar();
  // reaplica em sites que carregam botões dinamicamente (ex.: Wix)
  try {
    new MutationObserver(aplicar).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})();

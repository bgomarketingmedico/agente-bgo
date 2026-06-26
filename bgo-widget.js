/* ══════════════════════════════════════════════════════════════
   B.GO — Widget WhatsApp (loader universal)
   Uso no site do cliente (1 linha, antes do </body>):
   <script src="https://bgomarketingmedico.github.io/agente-bgo/bgo-widget.js"
     data-wa="5561999990000"
     data-wh="https://script.google.com/macros/s/XXX/exec"
     data-c1="#25D366" data-c2="#1DA851"
     data-msg="Olá! Meu nome é {{nome}} e gostaria de agendar."
     data-titulo="Fale com a gente"
     data-sub="Preencha para iniciarmos a conversa."
     data-esp="0" data-conv="0"
     data-fields="[]"></script>

   O ícone é desenhado como background do botão (à prova de temas).
═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var sc = document.currentScript;
  if (!sc) { var all = document.getElementsByTagName("script"); sc = all[all.length - 1]; }

  var C = {
    wa: sc.getAttribute("data-wa") || "",
    wh: sc.getAttribute("data-wh") || "",
    c1: sc.getAttribute("data-c1") || "#25D366",
    c2: sc.getAttribute("data-c2") || "#1DA851",
    m:  sc.getAttribute("data-msg") || "Olá! Meu nome é {{nome}} e gostaria de mais informações.",
    t:  sc.getAttribute("data-titulo") || "Fale com a gente",
    s:  sc.getAttribute("data-sub") || "Preencha para iniciarmos a conversa."
  };
  var esp = sc.getAttribute("data-esp") === "1";
  var conv = sc.getAttribute("data-conv") === "1";
  var cfs = [];
  try { cfs = JSON.parse(sc.getAttribute("data-fields") || "[]"); } catch (e) { cfs = []; }

  var WP = "M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52zM12 22c-1.85 0-3.65-.5-5.22-1.44l-.37-.22-3.67.96.98-3.57-.24-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.47-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51H7.5c-.2 0-.5.07-.77.37C6.47 8.6 5.75 9.27 5.75 10.67c0 1.4 1.02 2.76 1.17 2.95.15.2 2 3.04 4.86 4.27.68.29 1.21.47 1.62.6.68.21 1.3.18 1.79.11.55-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34z";
  var ICON = "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ffffff' d='" + WP + "'/></svg>");

  var IDS = ["bgo_nm", "bgo_tel", "bgo_em"];
  if (esp) IDS.push("bgo_esp");
  if (conv) IDS.push("bgo_conv");
  cfs.forEach(function (f) { IDS.push(f.id); });

  function mk(tag, css, attrs) {
    var el = document.createElement(tag);
    if (css) el.style.cssText = css;
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  var FLD = "display:block;width:100%;box-sizing:border-box;border:1.5px solid #e0e0e0;border-radius:10px;padding:11px 13px;font-size:14px;font-family:inherit;color:#111;background:#f8f8f8;outline:none;transition:border-color .15s";
  var LBL = "display:block;font-size:12px;font-weight:700;color:#555;margin-bottom:6px;font-family:inherit";

  function addField(parent, id, label, type, ph, req) {
    var wrap = mk("div", "margin-bottom:16px");
    var lbl = mk("label", LBL);
    lbl.textContent = label;
    if (req) { var sp = document.createElement("span"); sp.style.color = "#e74c3c"; sp.textContent = " *"; lbl.appendChild(sp); }
    var inp = mk("input", FLD, { type: type, id: id, placeholder: ph });
    inp.addEventListener("focus", function () { this.style.borderColor = C.c1; this.style.boxShadow = "0 0 0 3px rgba(37,211,102,.1)"; });
    inp.addEventListener("blur", function () { this.style.borderColor = "#e0e0e0"; this.style.boxShadow = "none"; });
    wrap.appendChild(lbl); wrap.appendChild(inp); parent.appendChild(wrap);
  }

  function addSelect(parent, id, label, opts) {
    var wrap = mk("div", "margin-bottom:16px");
    var lbl = mk("label", LBL); lbl.textContent = label;
    var sel = mk("select", FLD + ";-webkit-appearance:none;appearance:none", { id: id });
    var def = document.createElement("option"); def.value = ""; def.textContent = "Selecione…"; sel.appendChild(def);
    opts.forEach(function (o) { var op = document.createElement("option"); op.textContent = o; sel.appendChild(op); });
    sel.addEventListener("focus", function () { this.style.borderColor = C.c1; });
    sel.addEventListener("blur", function () { this.style.borderColor = "#e0e0e0"; });
    wrap.appendChild(lbl); wrap.appendChild(sel); parent.appendChild(wrap);
  }

  function addTextarea(parent, id, label) {
    var wrap = mk("div", "margin-bottom:16px");
    var lbl = mk("label", LBL); lbl.textContent = label;
    var ta = mk("textarea", FLD + ";resize:vertical;min-height:80px", { id: id, rows: "3" });
    ta.addEventListener("focus", function () { this.style.borderColor = C.c1; });
    ta.addEventListener("blur", function () { this.style.borderColor = "#e0e0e0"; });
    wrap.appendChild(lbl); wrap.appendChild(ta); parent.appendChild(wrap);
  }

  function origem() {
    var p = new URLSearchParams(window.location.search);
    if (p.get("utm_source")) return p.get("utm_source");
    if (p.get("gclid")) return "google ads";
    if (p.get("fbclid")) return "facebook ads";
    var r = document.referrer || "";
    if (!r) return "direto";
    var h; try { h = new URL(r).hostname.toLowerCase(); } catch (e) { return "direto"; }
    if (h.indexOf(location.hostname) >= 0) return "direto";
    if (/(^|\.)google\./.test(h)) return "busca google orgânico";
    if (/(^|\.)bing\./.test(h)) return "busca bing orgânico";
    if (/(^|\.)yahoo\./.test(h)) return "busca yahoo orgânico";
    if (/duckduckgo\./.test(h)) return "busca duckduckgo orgânico";
    if (/instagram\./.test(h)) return "instagram orgânico";
    if (/(^|\.)facebook\.|(^|\.)fb\./.test(h)) return "facebook orgânico";
    if (/youtube\./.test(h)) return "youtube orgânico";
    if (/linkedin\./.test(h)) return "linkedin orgânico";
    if (/tiktok\./.test(h)) return "tiktok orgânico";
    if (/t\.co|twitter\.|x\.com/.test(h)) return "twitter orgânico";
    return h.replace(/^www\./, "");
  }
  function utms() {
    var p = new URLSearchParams(window.location.search);
    return { utm_source: origem(), utm_medium: p.get("utm_medium") || "", utm_campaign: p.get("utm_campaign") || "", pagina: window.location.href, dispositivo: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop" };
  }
  function dH() { return new Date().toLocaleDateString("pt-BR"); }
  function hA() { return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }

  function init() {
    if (document.getElementById("bgo-fab")) return;

    // FAB — ícone via background (à prova de temas)
    var fab = mk("button", "position:fixed!important;bottom:24px;right:24px;z-index:9998;width:58px!important;height:58px!important;min-width:58px!important;padding:0!important;margin:0!important;box-sizing:border-box!important;border-radius:50%;background-color:" + C.c1 + ";background-image:url(\"" + ICON + "\");background-position:center center;background-size:30px 30px;background-repeat:no-repeat;box-shadow:0 6px 20px rgba(0,0,0,.3);border:none;cursor:pointer;display:block!important;line-height:0!important;font-size:0!important;transition:transform .2s,box-shadow .2s");
    fab.id = "bgo-fab";
    fab.setAttribute("aria-label", "Falar pelo WhatsApp");
    fab.onmouseover = function () { this.style.transform = "scale(1.1)"; };
    fab.onmouseout = function () { this.style.transform = "scale(1)"; };
    document.body.appendChild(fab);

    var ov = mk("div", "display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);align-items:flex-end;justify-content:center");

    var st = document.createElement("style");
    st.textContent = "@keyframes bgoUp{from{transform:translateY(50px);opacity:0}to{transform:none;opacity:1}}";
    document.head.appendChild(st);

    var box = mk("div", "background:#fff;width:100%;max-width:440px;border-radius:24px 24px 0 0;overflow:hidden;animation:bgoUp .28s cubic-bezier(.22,1,.36,1);box-shadow:0 -4px 40px rgba(0,0,0,.15)");

    var hd = mk("div", "position:relative;background:" + C.c1 + ";padding:20px 46px 16px 18px;display:flex;align-items:flex-start;gap:12px");
    hd.style.backgroundImage = "none";
    var hdIco = mk("span", "width:26px;height:26px;flex-shrink:0;margin-top:3px;display:inline-block;background-image:url(\"" + ICON + "\");background-size:26px 26px;background-repeat:no-repeat");
    var hdTxt = mk("div", "flex:1");
    var h3 = mk("h3", "margin:0 0 3px;color:#fff;font-size:16px;font-family:inherit;font-weight:700;line-height:1.3"); h3.textContent = C.t;
    var pp = mk("p", "margin:0;color:rgba(255,255,255,.82);font-size:13px;font-family:inherit"); pp.textContent = C.s;
    hdTxt.appendChild(h3); hdTxt.appendChild(pp);
    var xBtn = mk("button", "position:absolute;top:14px;right:14px;background:rgba(0,0,0,.18);border:none;cursor:pointer;color:#fff;font-size:16px;width:30px;height:30px;border-radius:50%;line-height:1;display:flex;align-items:center;justify-content:center");
    xBtn.textContent = "✕"; xBtn.setAttribute("aria-label", "Fechar");
    hd.appendChild(hdIco); hd.appendChild(hdTxt); hd.appendChild(xBtn);

    var bd = mk("div", "padding:20px 18px 22px");
    var fa = mk("div", ""); fa.id = "bgo-fa";

    addField(fa, "bgo_nm", "Nome completo", "text", "João Silva", true);
    addField(fa, "bgo_tel", "Celular / WhatsApp", "tel", "(61) 99999-0000", true);
    addField(fa, "bgo_em", "E-mail", "email", "joao@email.com", true);
    if (esp) addField(fa, "bgo_esp", "Especialidade / Tratamento", "text", "Ex: Varizes, Botox…", false);
    if (conv) addSelect(fa, "bgo_conv", "Particular ou Convênio?", ["Particular", "Convênio", "Não sei ainda"]);
    cfs.forEach(function (f) {
      if (f.tipo === "select") addSelect(fa, f.id, f.label, (f.opts || "").split(",").map(function (o) { return o.trim(); }));
      else if (f.tipo === "textarea") addTextarea(fa, f.id, f.label);
      else addField(fa, f.id, f.label, f.tipo || "text", "", false);
    });

    var err = mk("div", "color:#c0392b;font-size:12px;margin-top:8px;display:none;padding:9px 12px;background:#fff0f0;border-radius:9px;border:1px solid #fcc;font-family:inherit");
    err.id = "bgo-err"; err.textContent = "⚠️ Preencha nome, celular e e-mail para continuar.";

    var btn = mk("button", "width:100%;padding:13px;background:" + C.c1 + ";color:#fff;border:none;border-radius:11px;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;margin-top:10px;box-shadow:0 3px 12px rgba(0,0,0,.15);transition:opacity .2s");
    btn.id = "bgo-btn";
    var btnIco = mk("span", "width:17px;height:17px;display:inline-block;background-image:url(\"" + ICON + "\");background-size:17px 17px;background-repeat:no-repeat;flex:none");
    var btnTx = document.createElement("span"); btnTx.textContent = "Iniciar conversa no WhatsApp";
    btn.appendChild(btnIco); btn.appendChild(btnTx);
    btn.onmouseover = function () { if (!this.disabled) this.style.opacity = ".9"; };
    btn.onmouseout = function () { this.style.opacity = "1"; };

    var lgpd = mk("p", "font-size:11px;color:#bbb;text-align:center;margin-top:12px;line-height:1.5;font-family:inherit");
    lgpd.textContent = "Seus dados são usados apenas para entrar em contato. Não enviamos spam.";

    fa.appendChild(err); fa.appendChild(btn); fa.appendChild(lgpd);

    var ok = mk("div", "display:none;text-align:center;padding:32px 0 16px"); ok.id = "bgo-ok";
    ok.innerHTML = "<svg viewBox='0 0 24 24' width='56' height='56' style='width:56px;height:56px'><circle cx='12' cy='12' r='12' fill='#E6F4ED'/><path d='M7 12.5l3.5 3.5 6.5-7' stroke='#1A7A44' stroke-width='2.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg><p style='color:#111;font-size:16px;margin:12px 0 4px;font-family:inherit;font-weight:700'>Dados enviados! 🎉</p><p style='color:#777;font-size:13px;font-family:inherit'>Abrindo o WhatsApp agora…</p>";

    bd.appendChild(fa); bd.appendChild(ok);
    box.appendChild(hd); box.appendChild(bd); ov.appendChild(box);
    document.body.appendChild(ov);

    function ajustar() {
      if (window.innerWidth >= 520) { ov.style.alignItems = "center"; box.style.borderRadius = "20px"; box.style.margin = "0 16px"; }
      else { ov.style.alignItems = "flex-end"; box.style.borderRadius = "24px 24px 0 0"; box.style.margin = "0"; }
    }
    ajustar(); window.addEventListener("resize", ajustar);

    fab.onclick = function () { ov.style.display = "flex"; setTimeout(function () { var el = document.getElementById("bgo_nm"); if (el) el.focus(); }, 80); };
    xBtn.onclick = fechar;
    ov.onclick = function (e) { if (e.target === ov) fechar(); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ov.style.display === "flex") fechar(); });

    function fechar() {
      ov.style.display = "none";
      setTimeout(function () {
        fa.style.display = ""; ok.style.display = "none"; err.style.display = "none";
        IDS.forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ""; });
        btn.disabled = false; btn.style.opacity = "1";
      }, 300);
    }

    btn.onclick = function () {
      var nm = document.getElementById("bgo_nm").value.trim();
      var tel = document.getElementById("bgo_tel").value.trim();
      var em = document.getElementById("bgo_em").value.trim();
      if (!nm || !tel || !em || !/\S+@\S+\.\S+/.test(em)) { err.style.display = "block"; return; }
      err.style.display = "none";
      btn.disabled = true; btnTx.textContent = "Enviando…";
      var extra = {};
      IDS.slice(3).forEach(function (id) { var el = document.getElementById(id); if (el) extra[id] = el.value; });
      var pl = Object.assign({ data: dH(), hora: hA(), nome: nm, telefone: tel, email: em }, extra, utms());
      if (C.wh) fetch(C.wh, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pl) }).catch(function () {});
      setTimeout(function () {
        fa.style.display = "none"; ok.style.display = "block";
        var mf = C.m.replace("{{nome}}", nm);
        setTimeout(function () { window.open("https://wa.me/" + C.wa + "?text=" + encodeURIComponent(mf), "_blank"); setTimeout(fechar, 2500); }, 900);
      }, 700);
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

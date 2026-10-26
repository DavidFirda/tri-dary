/* ===== Tri dary – Strážca v mobile (vykresľovanie a logika) =====
   Každá QR kartička otvorí jednu časť hry (prológ, 3 kapitoly, epilóg).
   Časť má niekoľko krokov. Krok je buď heslo (text alebo výber), alebo
   hlavolam, ktorý sa overí sám a hráčka ho iba potvrdí. */
(function (root) {
  "use strict";

  /* ---------- Ikony (pôvodné kresby) ---------- */
  var IKONY = {
    list:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" aria-hidden="true">' +
      '<rect x="8" y="16" width="48" height="34" rx="2"/><path d="M8 18 L32 36 L56 18"/>' +
      '<circle cx="32" cy="36" r="6" fill="currentColor" stroke="none"/></svg>',
    rucho:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" aria-hidden="true">' +
      '<path d="M32 13 V9 a3.5 3.5 0 1 1 3.5 -3.5"/><path d="M32 13 L8 24 H56 Z"/>' +
      '<path d="M15 24 L9 58 H55 L49 24"/><path d="M24 24 L32 40 L40 24"/><path d="M32 40 V58"/>' +
      '<path d="M18 46 h7 M39 46 h7" stroke-width="1.8"/></svg>',
    prutik:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M18 46 L47 17" stroke-width="3"/>' +
      '<path d="M10 54 L19 45" stroke-width="7"/>' +
      '<path d="M20.5 43.5 l2 2 M24 40 l2 2" stroke-width="2"/>' +
      '<path d="M51 4 L53 10.5 L59.5 12.5 L53 14.5 L51 21 L49 14.5 L42.5 12.5 L49 10.5 Z" fill="currentColor" stroke="none"/>' +
      '<circle cx="58" cy="24" r="1.6" fill="currentColor" stroke="none"/><circle cx="40" cy="6" r="1.3" fill="currentColor" stroke="none"/></svg>',
    kamen:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" aria-hidden="true">' +
      '<ellipse cx="32" cy="44" rx="17" ry="11"/><path d="M15 44 C15 30 22 22 32 22 C42 22 49 30 49 44"/>' +
      '<path d="M24 24 L32 8 L40 24 Z" fill="currentColor" stroke="none" opacity=".85"/>' +
      '<path d="M27 37 h10" stroke-width="1.8"/></svg>',
    hviezda:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 L38.5 24.5 L60 25 L42.8 37.8 L49 58.5 L32 46 L15 58.5 L21.2 37.8 L4 25 L25.5 24.5 Z" fill="currentColor"/></svg>',
    galeon:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="currentColor"/>' +
      '<circle cx="32" cy="32" r="23" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>' +
      '<path d="M32 16 L35.4 27.3 L47.2 27.3 L37.7 34.3 L41.3 45.6 L32 38.7 L22.7 45.6 L26.3 34.3 L16.8 27.3 L28.6 27.3 Z" fill="rgba(0,0,0,.35)"/></svg>',
    zamok:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><rect x="14" y="28" width="36" height="28" rx="4"/><path d="M22 28 V20 a10 10 0 0 1 20 0 V28"/><circle cx="32" cy="41" r="3" fill="currentColor"/></svg>',
    ornament:
      '<svg viewBox="0 0 190 18" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M4 9 H76 M114 9 H186" stroke-width="1"/>' +
      '<path d="M76 9 c4 -6 10 -6 12 0 M114 9 c-4 -6 -10 -6 -12 0" stroke-width="1"/>' +
      '<path d="M95 2 L101 9 L95 16 L89 9 Z" fill="currentColor" stroke="none"/>' +
      '<circle cx="82" cy="9" r="1.5" fill="currentColor" stroke="none"/><circle cx="108" cy="9" r="1.5" fill="currentColor" stroke="none"/></svg>'
  };

  /* Pečať – vosková s hviezdou a tromi bodkami (tri dary) */
  var erbPocitadlo = 0;
  function erb(farba, cls) {
    var body = [], n = 22, i, gid = "tdv" + (++erbPocitadlo);
    for (i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2, r = 30 + (i % 2 ? 1.6 : -0.6) + Math.sin(i * 2.7) * 1.2;
      body.push((i ? "L" : "M") + (32 + Math.cos(a) * r).toFixed(1) + " " + (32 + Math.sin(a) * r).toFixed(1));
    }
    var hviezda = [];
    for (i = 0; i < 14; i++) {
      var b = -Math.PI / 2 + (i / 14) * Math.PI * 2, rr = i % 2 ? 6 : 14;
      hviezda.push((i ? "L" : "M") + (32 + Math.cos(b) * rr).toFixed(1) + " " + (31 + Math.sin(b) * rr).toFixed(1));
    }
    return '<svg class="' + (cls || "td-erb") + '" viewBox="0 0 64 64" aria-hidden="true">' +
      '<defs><radialGradient id="' + gid + '" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#b8423a"/><stop offset=".6" stop-color="' + (farba || "#7d1d1b") + '"/><stop offset="1" stop-color="#3f0b0a"/></radialGradient></defs>' +
      '<path d="' + body.join(" ") + 'Z" fill="url(#' + gid + ')"/>' +
      '<circle cx="32" cy="32" r="22.5" fill="none" stroke="rgba(255,220,170,.35)" stroke-width="1.2"/>' +
      '<circle cx="32" cy="32" r="19.5" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>' +
      '<path d="' + hviezda.join(" ") + 'Z" fill="rgba(255,226,170,.55)"/>' +
      '<circle cx="21" cy="45" r="1.8" fill="rgba(255,226,170,.55)"/><circle cx="32" cy="49" r="1.8" fill="rgba(255,226,170,.55)"/><circle cx="43" cy="45" r="1.8" fill="rgba(255,226,170,.55)"/>' +
      "</svg>";
  }

  /* ---------- Pomocné ---------- */
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function nahodny(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function galeonov(n) { n = Math.abs(n); return n === 1 ? "galeón" : n >= 2 && n <= 4 ? "galeóny" : "galeónov"; }
  function hviezdy(n) { var s = ""; for (var i = 0; i < 4; i++) s += i < n ? "★" : "☆"; return s; }
  function radMinci(n) { var h = '<span class="td-minca-rad">'; for (var i = 0; i < n; i++) h += IKONY.galeon; return h + "</span>"; }

  var ZLE_TEXT = [
    "Prútik len zaiskril. Skús to znova.",
    "Triediaci klobúk nespokojne mrmle. To nebude ono.",
    "Strážca pokrúti hlavou. Skontroluj, či je heslo správne napísané.",
    "Hermiona by zdvihla obočie. Skús ešte raz.",
    "Niekde v hrade sa ozval smiech duchov. Toto nie je správna odpoveď."
  ];
  var ZLE_POKUTA = "Goblini sa uškŕňajú. Zlý tip, pokuta 1 galeón.";

  /* ---------- Stav hry (uložený v telefóne) ---------- */
  var PREFIX = "tridary:hra:";
  var pamat = {};            // náhradná pamäť (súkromné okno, náhľad v dielni)
  function citaj(k, demo) {
    if (demo) return pamat[k] ? JSON.parse(pamat[k]) : null;
    try { var v = localStorage.getItem(PREFIX + k); return v ? JSON.parse(v) : (pamat[k] ? JSON.parse(pamat[k]) : null); }
    catch (e) { return pamat[k] ? JSON.parse(pamat[k]) : null; }
  }
  function zapis(k, v, demo) {
    pamat[k] = JSON.stringify(v);
    if (demo) return;
    try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* ostane v pamäti */ }
  }
  function Stav(demo) {
    this.demo = !!demo;
  }
  Stav.prototype.mapa = function (k) { return citaj(k, this.demo) || {}; };
  Stav.prototype.vyriesene = function (id) { return this.mapa("vyriesene")[id] || null; };
  Stav.prototype.vyries = function (id, odh) { var m = this.mapa("vyriesene"); m[id] = odh; zapis("vyriesene", m, this.demo); };
  Stav.prototype.napovedy = function (id) { return this.mapa("napovedy")[id] || 0; };
  Stav.prototype.ukazNapovedu = function (id, n) { var m = this.mapa("napovedy"); m[id] = n; zapis("napovedy", m, this.demo); };
  Stav.prototype.pridaj = function (kde, id, o) { var m = this.mapa(kde); m[id] = (m[id] || 0) + o; zapis(kde, m, this.demo); };
  Stav.prototype.minute = function () {
    var s = 0, m = this.mapa("platene"), p = this.mapa("pokuty"), k;
    for (k in m) s += m[k];
    for (k in p) s += p[k];
    return s;
  };
  Stav.prototype.dary = function () { return citaj("dary", this.demo) || []; };
  Stav.prototype.pridajDar = function (castId) { var d = this.dary(); if (d.indexOf(castId) < 0) { d.push(castId); zapis("dary", d, this.demo); } };
  Stav.prototype.dokoncene = function () { return citaj("dokoncene", this.demo) || []; };
  Stav.prototype.dokonci = function (castId) { var d = this.dokoncene(); if (d.indexOf(castId) < 0) { d.push(castId); zapis("dokoncene", d, this.demo); } };

  /* ---------- Hlas Strážcu (číta iba príbeh a úlohu, nie nadpisy, tlačidlá ani nápovedy) ----------
     Prednostne prehrá hotovú nahrávku (neurónový hlas, zašifrovaná rovnako ako texty: kľúč je v kartičke
     alebo v odhalení). Kde nahrávka nie je, číta hlas zabudovaný v mobile. Nič sa nikam neposiela.
     Úsek = { texty: [..], hlas: { f: súbor, k: kľúč } | undefined }. */
  function usek(texty, hlas) { return { texty: texty, hlas: hlas || null }; }
  var Hlas = (function () {
    var synth = root.speechSynthesis, KLUC = "tridary:hlas";
    var hlas = null, odomknute = false;
    function zapnuty() { try { return localStorage.getItem(KLUC) !== "vyp"; } catch (e) { return true; } }
    function nastav(v) { try { localStorage.setItem(KLUC, v ? "zap" : "vyp"); } catch (e) { /* nevadí */ } if (!v) stop(); }
    function vyberHlas() {
      if (!synth) return null;
      var vs = synth.getVoices() || [], sk = vs.filter(function (v) { return /^sk/i.test(v.lang); });
      // prednosť má kvalitnejší hlas (Laura na iPhone, Google na Androide), inak hocijaký slovenský
      hlas = sk.filter(function (v) { return /laura|google|premium|enhanced|vylepš|natural/i.test(v.name); })[0] || sk[0] || null;
      return hlas;
    }
    if (synth) { vyberHlas(); if ("onvoiceschanged" in synth) synth.addEventListener("voiceschanged", vyberHlas); }
    function cisty(html) {
      var d = document.createElement("div");
      d.innerHTML = String(html || "").replace(/<br\s*\/?>/gi, ". ").replace(/<\/li>/gi, ". ");
      return d.textContent
        .replace(/△/g, " trojuholník ").replace(/○/g, " kruh ").replace(/\s\|\s|\s\|(?=[.,])/g, " zvislá čiarka ").replace(/[✦★✉]/g, " ")
        .replace(/„|“|"/g, "").replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").replace(/([.!?…:])(\s*\.)+/g, "$1").trim();
    }
    function zvuk() { try { navigator.audioSession.type = "playback"; } catch (e) { /* iba novšie iPhony; inak nevadí */ } }

    /* --- nahrávky --- */
    var prehravac = typeof root.Audio === "function" ? new root.Audio() : null, nahrate = {}, beh = 0, hraNahravka = false;
    // krátke ticho: prvým ťuknutím „odomkne“ prehrávač, kým sa skutočná nahrávka ešte odšifrováva
    var TICHO = (function () {
      try {
        var n = 800, b = new DataView(new ArrayBuffer(44 + n)), z = function (o, t) { for (var i = 0; i < t.length; i++) b.setUint8(o + i, t.charCodeAt(i)); };
        z(0, "RIFF"); b.setUint32(4, 36 + n, true); z(8, "WAVEfmt "); b.setUint32(16, 16, true); b.setUint16(20, 1, true); b.setUint16(22, 1, true);
        b.setUint32(24, 8000, true); b.setUint32(28, 8000, true); b.setUint16(32, 1, true); b.setUint16(34, 8, true); z(36, "data"); b.setUint32(40, n, true);
        for (var i = 0; i < n; i++) b.setUint8(44 + i, 128);
        return URL.createObjectURL(new Blob([b.buffer], { type: "audio/wav" }));
      } catch (e) { return null; }
    })();
    function nacitaj(ref) {
      if (!nahrate[ref.f]) {
        nahrate[ref.f] = fetch(ref.f).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
          .then(function (buf) { return Sifra.desifrujSubor(buf, ref.k); })
          .then(function (mp3) { var url = URL.createObjectURL(new Blob([mp3], { type: "audio/mpeg" })); nahrate[ref.f].url = url; return url; });
        nahrate[ref.f].catch(function () { delete nahrate[ref.f]; });
      }
      return nahrate[ref.f];
    }
    function priprav(useky) { if (prehravac) useky.forEach(function (u) { if (u.hlas) nacitaj(u.hlas).catch(function () {}); }); }
    function prehraj(useky, poKonci, poZacati, poZlyhani) {
      var moj = ++beh, i = 0;
      hraNahravka = true;
      function koniec() { if (moj !== beh) return; hraNahravka = false; if (poKonci) poKonci(); }
      function zlyhalo(prvy) {
        if (moj !== beh) return;
        hraNahravka = false;
        // nedá sa prehrať: ak ešte nič nezačalo, nech to skúsi hlas mobilu
        if (prvy && !odomknute && poZlyhani) poZlyhani(); else hovorMobilom(useky.slice(i), poKonci, poZacati);
      }
      function dalsi() {
        if (moj !== beh) return;
        if (i >= useky.length) return koniec();
        var ref = useky[i].hlas, prvy = i === 0;
        nacitaj(ref).then(function (url) {
          if (moj !== beh) return;
          if (prehravac.src !== url) prehravac.src = url;   // prvá už môže hrať z ťuknutia
          prehravac.onended = function () { if (moj === beh) { i++; dalsi(); } };
          var p = prehravac.play();
          var ok = function () { if (prvy) { odomknute = true; if (poZacati) poZacati(); } };
          if (p && p.then) p.then(ok, function (e) { zlyhalo(prvy && e && e.name === "NotAllowedError"); }); else ok();
        }, function () { zlyhalo(false); });
      }
      var prvaUrl = nahrate[useky[0].hlas.f] && nahrate[useky[0].hlas.f].url;
      if (prvaUrl) {
        // nahrávka je pripravená: prehrá sa hneď, ešte počas ťuknutia
        prehravac.src = prvaUrl;
        prehravac.play().catch(function () {});
      } else if (TICHO && !odomknute) {
        prehravac.src = TICHO;
        prehravac.play().catch(function () {});
      }
      dalsi();
    }

    /* --- hlas mobilu --- */
    var drzane = [];   // Safari zahodí udalosti vety, ak na ňu nikto nedrží odkaz
    function hovorMobilom(useky, poKonci, poZacati) {
      if (!synth) return false;
      var texty = [];
      useky.forEach(function (u) { u.texty.forEach(function (t) { t = cisty(t); if (t) texty.push(t); }); });
      if (!texty.length) return false;
      if (!hlas) vyberHlas();
      var vety = texty.map(function (t, i) {
        var u = new root.SpeechSynthesisUtterance(t);
        u.lang = (hlas && hlas.lang) || "sk-SK";
        if (hlas) u.voice = hlas;
        u.rate = 0.9;        // pokojné, dôstojné tempo profesorky
        u.pitch = 0.85;      // o niečo nižší, prísnejší hlas
        if (i === 0) u.onstart = function () { odomknute = true; if (poZacati) poZacati(); };
        if (i === texty.length - 1) u.onend = u.onerror = function () { drzane = []; if (poKonci) poKonci(); };
        return u;
      });
      drzane = vety;
      function pust() { vety.forEach(function (u) { synth.speak(u); }); }
      // Safari stratí vetu, ak sa speak() zavolá hneď po cancel(); rušíme iba keď niečo hrá, a potom chvíľu počkáme
      if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(pust, 120); }
      else pust();
      return true;
    }

    function stop() { beh++; hraNahravka = false; if (prehravac) prehravac.pause(); if (synth && (synth.speaking || synth.pending)) synth.cancel(); }
    function hovor(useky, poKonci, poZacati, poZlyhani) {
      if (!zapnuty()) return false;
      useky = useky.filter(function (u) { return u.texty.some(function (t) { return cisty(t); }); });
      if (!useky.length) return false;
      zvuk();
      beh++; if (prehravac) prehravac.pause();
      if (prehravac && useky.every(function (u) { return u.hlas; })) { if (synth && (synth.speaking || synth.pending)) synth.cancel(); prehraj(useky, poKonci, poZacati, poZlyhani); return true; }
      return hovorMobilom(useky, poKonci, poZacati);
    }
    return { dostupny: !!(synth || prehravac), zapnuty: zapnuty, nastav: nastav, hovor: hovor, priprav: priprav, stop: stop,
      hovori: function () { return hraNahravka || !!(synth && synth.speaking); }, odomknute: function () { return odomknute; } };
  })();

  /* tlačidlo „Prečítať znova“ pri bloku textu */
  function tlacidloHlasu(useky, popis) {
    var b = el("button", "td-hlas-btn", "<span aria-hidden=\"true\">🔊</span> " + esc(popis || "Prečítať znova"));
    b.type = "button";
    b.onclick = function () { if (!Hlas.zapnuty()) Hlas.nastav(true); prepinacHlasu(); Hlas.hovor(useky()); };
    return b;
  }
  function prepinacHlasu() {
    var b = document.querySelector(".td-hlas-prepinac");
    if (b) { var z = Hlas.zapnuty(); b.textContent = z ? "🔊" : "🔇"; b.setAttribute("aria-label", z ? "Hlas Strážcu je zapnutý, ťukni pre vypnutie" : "Hlas Strážcu je vypnutý, ťukni pre zapnutie"); }
  }

  /* ---------- Mešec ---------- */
  function mesecHTML(stav, zaciatok) {
    var minute = stav.minute(), zostava = zaciatok - minute;
    var h = '<div class="td-mesec' + (zostava < 0 ? " je-dlh" : "") + '" aria-label="Galeóny na nápovedy: ' + Math.max(0, zostava) + (zostava < 0 ? ", dlh " + (-zostava) : "") + '"><span class="mince">';
    for (var i = 0; i < zaciatok; i++) h += '<i class="' + (i < zostava ? "ma" : "") + '"></i>';
    h += '</span><span class="pocet">' + (zostava >= 0 ? zostava + " / " + zaciatok : "dlh " + (-zostava)) + "</span></div>";
    return h;
  }

  /* ---------- Certifikát ---------- */
  function certifikatHTML(c, dlh) {
    return '<div class="td-certifikat">' + erb(null, "td-cert-pecat") +
      '<div class="c-nadpis">' + esc(c.nadpis) + '</div><div class="c-pod">' + esc(c.podnadpis) + "</div>" +
      '<p class="c-text">' + esc(c.uvod) + ' <b class="c-meno">' + esc(c.meno || "táto čarodejnica") + "</b> " + esc(c.text) + "</p>" +
      '<div class="c-titul">' + esc(c.titul) + "</div>" +
      '<dl class="c-predmety">' + (c.predmety || []).map(function (p) {
        var hodnota = p[1];
        if (dlh != null && /gringott/i.test(p[0])) hodnota = dlh > 0 ? "Dlhuje goblinom " + dlh + " " + galeonov(dlh) : "Bez dlhov";
        return "<div><dt>" + esc(p[0]) + "</dt><dd>" + esc(hodnota) + "</dd></div>";
      }).join("") + "</dl>" +
      '<div class="c-podpis">' + esc(c.podpis) + "</div></div>";
  }

  /* ---------- Kostra stránky ---------- */
  function kostra(cielEl, casti, aktualna, stav, mesec) {
    cielEl.innerHTML = "";
    var scena = el("div", "td-scena");
    scena.appendChild(el("div", "td-hviezdy"));
    scena.appendChild(el("div", "td-sviecky", "<i></i><i></i><i></i><i></i><i></i>"));
    var hl = el("header", "td-hlavicka");
    hl.innerHTML = erb() + '<div class="td-nazov">Tri dary</div>';
    if (casti && casti.length) {
      var ol = el("ol", "td-kapitoly");
      var dok = stav.dokoncene();
      casti.forEach(function (k) {
        var li = el("li", "", IKONY[k.ikona] || "");
        if (dok.indexOf(k.id) >= 0) li.classList.add("je-najdena");
        if (k.id === aktualna) li.classList.add("je-aktualna");
        li.setAttribute("aria-label", k.nazov + (dok.indexOf(k.id) >= 0 ? " – dokončené" : ""));
        ol.appendChild(li);
      });
      hl.appendChild(ol);
    }
    if (mesec) hl.insertAdjacentHTML("beforeend", mesec);
    if (Hlas.dostupny && casti && casti.length) {
      var pre = el("button", "td-hlas-prepinac"); pre.type = "button";
      pre.onclick = function () { Hlas.nastav(!Hlas.zapnuty()); prepinacHlasu(); };
      hl.appendChild(pre);
    }
    scena.appendChild(hl);
    var main = el("main", "td-pergamen");
    scena.appendChild(main);
    scena.appendChild(el("footer", "td-pata", "Neplecha sa práve deje"));
    cielEl.appendChild(scena);
    return main;
  }

  /* ---------- Iskry pri správnej odpovedi ---------- */
  function iskry(intenzita) {
    if (root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = el("canvas", "td-iskry"), ctx = c.getContext && c.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(2, root.devicePixelRatio || 1);
    document.body.appendChild(c);
    var W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
    c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
    var cast = [], n = Math.round(90 * (intenzita || 1));
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 7) * dpr;
      cast.push({ x: W / 2, y: H * 0.45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3 * dpr, r: (1 + Math.random() * 2.4) * dpr, z: 1, h: 38 + Math.random() * 18 });
    }
    var t0 = performance.now();
    (function krok(t) {
      var dt = t - t0;
      ctx.clearRect(0, 0, W, H);
      cast.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12 * dpr; p.vx *= 0.985; p.z -= 0.011;
        if (p.z <= 0) return;
        ctx.globalAlpha = Math.max(0, p.z);
        ctx.fillStyle = "hsl(" + p.h + ",85%," + (60 + p.z * 25) + "%)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      if (dt < 1800) requestAnimationFrame(krok); else c.remove();
    })(t0);
  }

  /* ---------- Odhalenie (po vyriešení kroku) ---------- */
  function odhalenieHTML(odh, karta, stav, cast) {
    var h = '<div class="td-odh-stitok">Vyriešené</div>' +
      '<h3 class="td-odh-nadpis">' + esc(odh.nadpis) + "</h3>" +
      '<p class="td-odh-text">' + (odh.text || "") + "</p>";
    if (odh.finale) {
      h += '<div class="td-dar"><div class="ikony">' + IKONY.rucho + IKONY.prutik + IKONY.kamen + "</div>" +
        '<div class="poradie">Tri dary</div><div class="veta">a ten štvrtý</div></div>';
    } else if (odh.dar) {
      h += '<div class="td-dar">' + (IKONY[cast.ikona] || "") + '<div class="poradie">' + esc(odh.nadpis.split(":")[0]) + "</div>" +
        '<div class="veta">' + esc(cast.dar || "") + "</div></div>";
    }
    if (odh.certifikat && karta.certifikat) {
      var dlh = karta.mesec ? Math.max(0, stav.minute() - karta.galeonyNaZaciatok) : null;
      h += certifikatHTML(karta.certifikat, dlh);
    }
    if (odh.podpis && !odh.certifikat) h += '<div class="td-odh-podpis">— ' + esc(odh.podpis) + "</div>";
    return h;
  }

  /* ---------- Jedna karta (časť hry) ---------- */
  function vykresliKartu(cielEl, karta, ctx) {
    ctx = ctx || {};
    var stav = ctx.stav || new Stav(ctx.demo);
    var cast = karta.cast;
    var obnov = function (posledny) { vykresliKartu(cielEl, karta, Object.assign({}, ctx, { stav: stav, prave: posledny })); };
    var mesec = karta.mesec ? mesecHTML(stav, karta.galeonyNaZaciatok) : null;
    var main = kostra(cielEl, karta.casti, cast.id, stav, mesec);

    main.appendChild(el("div", "td-stuzka", esc(cast.nazov) + " · " + esc(cast.podnazov) + (cast.znak && cast.id !== "P" && cast.id !== "E" ? " " + esc(cast.znak) : "")));
    main.appendChild(el("h1", "td-titul", esc(karta.nadpis)));
    if (karta.uvod) main.appendChild(el("p", "td-pribeh td-uvod-karty", karta.uvod));
    if (karta.uvod && Hlas.dostupny) main.appendChild(tlacidloHlasu(function () { return [usek([karta.uvod], karta.hlas)]; }, "Prečítať úvod"));
    if (karta.pravidla && karta.pravidla.length) {
      var pr = el("ol", "td-pravidla");
      karta.pravidla.forEach(function (p) { pr.appendChild(el("li", "", p)); });
      main.appendChild(pr);
    }
    main.appendChild(el("div", "td-ornament", IKONY.ornament));

    // body postupu
    var vsetky = karta.kroky.length, hotove = karta.kroky.filter(function (k) { return stav.vyriesene(k.id); }).length;
    var body = el("div", "td-body");
    karta.kroky.forEach(function (k, i) {
      var s = el("span", stav.vyriesene(k.id) ? "je-hotovy" : i === hotove ? "je-teraz" : "");
      body.appendChild(s);
    });
    body.setAttribute("aria-label", "Vyriešené " + hotove + " z " + vsetky);
    main.appendChild(body);

    var zoznam = el("div", "td-kroky");
    main.appendChild(zoznam);
    var aktivny = null;
    karta.kroky.forEach(function (k, i) {
      var odh = stav.vyriesene(k.id);
      if (odh) {
        var det = el("details", "td-krok je-vyriesene");
        if (ctx.prave === k.id || (i === hotove - 1 && hotove === vsetky) || i === hotove - 1) det.open = true;
        det.innerHTML = '<summary><span class="td-kod">' + esc(k.kod) + '</span><span class="td-krok-nazov">' + esc(k.nazov) + '</span><span class="td-fajka" aria-label="vyriešené">✓</span></summary>';
        var sec = el("section", "td-odhalenie");
        sec.innerHTML = erb(null, "td-pecat") + odhalenieHTML(odh, karta, stav, cast);
        if (Hlas.dostupny && odh.text) { (function (o) { sec.insertBefore(tlacidloHlasu(function () { return [usek([o.text], o.hlas)]; }), sec.querySelector(".td-odh-text").nextSibling); })(odh); }
        det.appendChild(sec);
        zoznam.appendChild(det);
        if (ctx.prave === k.id) {
          setTimeout(function () {
            iskry(odh.finale ? 2.6 : odh.dar ? 1.8 : 1);
            if (odh.finale) setTimeout(function () { iskry(1.6); }, 900);
            sec.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 120);
        }
      } else if (!aktivny) {
        aktivny = k;
        zoznam.appendChild(vykresliKrok(k, karta, stav, ctx, obnov));
      }
    });
    var zostava = vsetky - hotove - (aktivny ? 1 : 0);
    if (zostava > 0) zoznam.appendChild(el("div", "td-krok je-zamknute", IKONY.zamok + "<span>" + (zostava === 1 ? "Ešte jedna úloha" : "Ešte " + zostava + (zostava < 5 ? " úlohy" : " úloh")) + "</span>"));

    // hlas: po vyriešení prečíta odhalenie a potom príbeh a úlohu ďalšieho kroku; pri otvorení kartičky úvod a aktuálnu úlohu
    if (Hlas.dostupny) {
      prepinacHlasu();
      var useky = [];
      if (ctx.prave) {
        var o = stav.vyriesene(ctx.prave);
        if (o && o.text) useky.push(usek([o.text], o.hlas));
      } else if (!hotove && karta.uvod) useky.push(usek([karta.uvod], karta.hlas));
      if (aktivny) useky.push(usek([aktivny.pribeh, aktivny.uloha], aktivny.hlas));
      Hlas.priprav(useky);
      if (useky.length && Hlas.zapnuty()) {
        // mobil dovolí hovoriť až po ťuknutí: kým hlas na tejto stránke raz nezačal, ponúkni tlačidlo
        var ponukni = function () {
          if (main.querySelector(".td-hlas-start")) return;
          var st = el("button", "td-hlas-btn td-hlas-start", "<span aria-hidden=\"true\">▶</span> Vypočuj si Strážcu");
          st.type = "button";
          st.onclick = function () { st.remove(); Hlas.hovor(useky); };
          main.insertBefore(st, main.querySelector(".td-titul").nextSibling);
        };
        if (!Hlas.odomknute()) ponukni();
        else {
          var zacal = false;
          Hlas.hovor(useky, null, function () { zacal = true; }, ponukni);
          setTimeout(function () { if (!zacal && !Hlas.hovori()) { Hlas.stop(); ponukni(); } }, 1500);
        }
      }
    }

    if (hotove === vsetky) {
      stav.dokonci(cast.id);
      var li = cielEl.querySelectorAll(".td-kapitoly li")[karta.casti.map(function (c) { return c.id; }).indexOf(cast.id)];
      if (li) li.classList.add("je-najdena");
    }
  }

  /* ---------- Krok (aktívna úloha) ---------- */
  function vykresliKrok(k, karta, stav, ctx, obnov) {
    var box = el("article", "td-krok je-aktivny");
    box.innerHTML = '<div class="td-krok-hlava"><span class="td-kod">' + esc(k.kod) + '</span><span class="td-druh">' + esc(k.druh || "") + '</span><span class="td-obtiaznost" aria-label="obtiažnosť ' + (k.hviezdy || 1) + ' zo 4">' + hviezdy(k.hviezdy || 1) + "</span></div>" +
      '<h2 class="td-krok-titul">' + esc(k.nazov) + "</h2>";
    if (k.pribeh) box.appendChild(el("p", "td-pribeh", k.pribeh));
    if (k.uloha) box.appendChild(el("div", "td-uloha", k.uloha));
    if (Hlas.dostupny && (k.pribeh || k.uloha)) box.appendChild(tlacidloHlasu(function () { return [usek([k.pribeh, k.uloha], k.hlas)]; }));

    var form = el("form", "td-formular");
    form.setAttribute("novalidate", "");
    var ziskaj;
    if (k.typ === "text") {
      var vstup = el("input", "td-vstup");
      vstup.type = "text"; vstup.autocomplete = "off";
      vstup.setAttribute("autocapitalize", "characters"); vstup.setAttribute("autocorrect", "off");
      vstup.spellcheck = false;
      vstup.placeholder = k.placeholder || "Heslo…";
      vstup.setAttribute("aria-label", "Heslo");
      form.appendChild(vstup);
      ziskaj = function () { return vstup.value; };
    } else if (k.typ === "vyber") {
      var polia = el("div", "td-polia"), selecty = [];
      (k.polia || []).forEach(function (p) {
        var lab = el("label", "td-pole", "<span>" + esc(p.nazov) + "</span>");
        var sel = el("select", "td-select");
        sel.innerHTML = '<option value="">vyber…</option>' + p.moznosti.map(function (m) { return '<option value="' + esc(m[0]) + '">' + esc(m[1]) + "</option>"; }).join("");
        lab.appendChild(sel); polia.appendChild(lab); selecty.push(sel);
      });
      form.appendChild(polia);
      ziskaj = function () {
        if (selecty.some(function (s) { return !s.value; })) return "";
        return selecty.map(function (s) { return s.value; }).join("|");
      };
    } else {
      ziskaj = function () { return "OK"; };
    }
    var btn = el("button", "td-tlacidlo", esc(k.tlacidlo || (k.typ === "samo" ? "Hotovo" : "Overiť heslo")));
    btn.type = "submit";
    form.appendChild(btn);
    var hlaska = el("p", "td-hlaska");
    hlaska.setAttribute("aria-live", "polite");
    form.appendChild(hlaska);
    box.appendChild(form);

    /* Pokuta (zlá fľaša) */
    var platba = el("p", "td-platba");
    platba.setAttribute("aria-live", "polite");
    if (k.pokuta) {
      var pb = el("button", "td-pokuta-btn", esc(k.pokuta.tlacidlo));
      pb.type = "button";
      pb.onclick = function () {
        stav.pridaj("pokuty", k.id, 1);
        aktualizujMesec();
        platba.innerHTML = radMinci(1) + "<span>" + esc(k.pokuta.text) + " " + popisMesca() + "</span>";
      };
      box.appendChild(pb);
    }

    /* Nápovedy */
    var napovedy = k.napovedy || [];
    var zadarmo = !karta.mesec || karta.napovedyZadarmo;
    var nap = el("div", "td-napovedy");
    var pomoc = el("button", "td-pomoc-btn"); pomoc.type = "button";
    var zoz = el("ol");
    var pouzite = stav.napovedy(k.id), zle = 0;
    function popisMesca() {
      var zostava = karta.galeonyNaZaciatok - stav.minute();
      return zostava >= 0 ? "V mešci ti ostáva " + zostava + " " + galeonov(zostava) + "." : "Galeóny ti došli, goblini požičali. Dlh: <b>" + (-zostava) + " " + galeonov(zostava) + "</b>.";
    }
    function aktualizujMesec() {
      if (!karta.mesec) return;
      var ms = document.querySelector(".td-mesec");
      if (ms) ms.outerHTML = mesecHTML(stav, karta.galeonyNaZaciatok);
    }
    function popisPomoci() {
      var zost = napovedy.length - pouzite;
      pomoc.textContent = zost > 0
        ? "✦ Potrebujem pomoc (" + (zadarmo ? "zadarmo" : "stojí " + karta.cenaNapovedy + " " + galeonov(karta.cenaNapovedy)) + ", zostáva " + zost + ")"
        : "Viac pomoci už niet, zvládneš to";
      pomoc.disabled = zost <= 0;
    }
    function pridajLi(i) { zoz.appendChild(el("li", "", "<b>Pomoc " + (i + 1) + " z " + napovedy.length + "</b>" + napovedy[i])); }
    for (var i = 0; i < pouzite; i++) pridajLi(i);
    pomoc.onclick = function () {
      if (pouzite >= napovedy.length) return;
      pridajLi(pouzite);
      pouzite++;
      stav.ukazNapovedu(k.id, pouzite);
      pomoc.classList.remove("je-pulz");
      if (!zadarmo) {
        stav.pridaj("platene", k.id, karta.cenaNapovedy);
        aktualizujMesec();
        platba.innerHTML = radMinci(1) + "<span>Goblini si vzali " + karta.cenaNapovedy + " " + galeonov(karta.cenaNapovedy) + ". " + popisMesca() + "</span>";
      }
      popisPomoci();
    };
    if (napovedy.length) { popisPomoci(); nap.appendChild(pomoc); nap.appendChild(zoz); box.appendChild(nap); }
    box.appendChild(platba);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var odp = ziskaj();
      if (odp == null || String(odp).trim() === "") {
        hlaska.className = "td-hlaska";
        hlaska.textContent = k.typ === "vyber" ? "Najprv vyber všetky tri údaje." : "Najprv niečo napíš.";
        return;
      }
      btn.disabled = true;
      hlaska.className = "td-hlaska";
      hlaska.textContent = "Kúzlo sa formuje…";
      Promise.resolve(ctx.over ? ctx.over(k, odp) : null).then(function (odh) {
        btn.disabled = false;
        if (odh) {
          stav.vyries(k.id, odh);
          if (odh.dar || odh.finale) stav.pridajDar(karta.cast.id);
          obnov(k.id);
        } else {
          zle++;
          if (k.pokutaZaZluOdpoved) {
            stav.pridaj("pokuty", k.id, k.pokutaZaZluOdpoved);
            aktualizujMesec();
            hlaska.textContent = ZLE_POKUTA;
            platba.innerHTML = radMinci(1) + "<span>" + popisMesca() + "</span>";
          } else {
            hlaska.textContent = nahodny(ZLE_TEXT);
          }
          form.classList.remove("td-trasenie"); void form.offsetWidth; form.classList.add("td-trasenie");
          if (zle >= 3 && pouzite < napovedy.length) pomoc.classList.add("je-pulz");
        }
      }).catch(function () {
        btn.disabled = false;
        hlaska.textContent = "Niečo sa pokazilo. Skús to znova.";
      });
    });
    return box;
  }

  /* ---------- Úvodná stránka a chyby ---------- */
  function vykresliUvod(cielEl, info) {
    info = info || {};
    var stav = new Stav(false);
    var main = kostra(cielEl, null, null, stav, null);
    var u = el("div", "td-uvod");
    var dary = stav.dary().length;
    u.innerHTML = erb(null, "td-erb-velky") +
      '<h1 class="td-titul">' + esc(info.titul || "Hrad je zamknutý") + "</h1>" +
      '<p class="td-pribeh">' + (info.text || "Tento hrad sa otvára len kartičkám so znakom. Namier fotoaparát mobilu na kartičku a brána sa otvorí.") + "</p>" +
      '<div class="td-ornament">' + IKONY.ornament + "</div>" +
      (dary ? '<p class="td-uloha" style="text-align:center">Nájdené dary: <b>' + Math.min(3, dary) + " z 3</b></p>" : "");
    main.appendChild(u);
  }

  /* ---------- Spustenie na webe (GitHub Pages) ---------- */
  async function spustiWeb(cielEl) {
    var data = root.TRI_DARY_DATA;
    var kod = decodeURIComponent((location.hash || "").replace(/^#/, "")).trim();
    if (!kod) { vykresliUvod(cielEl); return; }
    // adresa …/#zabudni vymaže z tohto mobilu všetok postup (po testovaní, pred ostrou hrou)
    if (kod.toLowerCase() === "zabudni") {
      var zmazane = 0;
      try {
        for (var i = localStorage.length - 1; i >= 0; i--) {
          var k = localStorage.key(i);
          if (k && k.indexOf(PREFIX) === 0) { localStorage.removeItem(k); zmazane++; }
        }
      } catch (e) { /* súkromné okno – nič uložené nie je */ }
      pamat = {};
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* nevadí */ }
      vykresliUvod(cielEl, { titul: "Hrad zabudol", text: "Tento mobil zabudol všetky vyriešené úlohy, nápovedy, galeóny aj dlh u goblinov" + (zmazane ? "" : " (nebolo tu nič uložené)") + ". Hra sa začne odznova od prvej kartičky." });
      return;
    }
    if (!data || !root.crypto || !root.crypto.subtle) {
      vykresliUvod(cielEl, { titul: "Kúzlo sa nedá vykonať", text: "Tento prehliadač nevie čarovať. Skús kartičku otvoriť v Safari alebo v Chrome." });
      return;
    }
    vykresliUvod(cielEl, { titul: "Otváram bránu…", text: "Chvíľku strpenia, kúzlo sa formuje." });
    var id = await Sifra.idKroku(kod);
    var box = data.karty[id];
    if (!box) { vykresliUvod(cielEl, { titul: "Kúzlo nezabralo", text: "Táto kartička nepatrí do tohto hradu. Skús ju naskenovať ešte raz." }); return; }
    var karta;
    try { karta = await Sifra.desifrujKrok(box, kod, data.iterKrok); }
    catch (e) { vykresliUvod(cielEl, { titul: "Kúzlo nezabralo", text: "Kartičku sa nepodarilo prečítať. Skús ju naskenovať ešte raz." }); return; }
    document.title = karta.cast.nazov + " · Tri dary";
    vykresliKartu(cielEl, karta, {
      over: function (krok, odp) {
        if (krok.typ === "samo") return Promise.resolve(krok.odh);
        return Sifra.overOdpoved(krok.odh, odp, data.iterOdp);
      }
    });
  }

  root.TriDary = {
    IKONY: IKONY,
    erb: erb,
    certifikatHTML: certifikatHTML,
    vykresliKartu: vykresliKartu,
    vykresliUvod: vykresliUvod,
    spustiWeb: spustiWeb,
    Stav: Stav
  };
})(window);

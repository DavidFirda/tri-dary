/* ===== Tri dary – hra (vykresľovanie a logika) ===== */
(function (root) {
  "use strict";

  /* ---------- Ikony (pôvodné kresby) ---------- */
  var IKONY = {
    prutik:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M18 46 L47 17" stroke-width="3"/>' +
      '<path d="M10 54 L19 45" stroke-width="7"/>' +
      '<path d="M20.5 43.5 l2 2 M24 40 l2 2" stroke-width="2"/>' +
      '<path d="M51 4 L53 10.5 L59.5 12.5 L53 14.5 L51 21 L49 14.5 L42.5 12.5 L49 10.5 Z" fill="currentColor" stroke="none"/>' +
      '<circle cx="58" cy="24" r="1.6" fill="currentColor" stroke="none"/><circle cx="40" cy="6" r="1.3" fill="currentColor" stroke="none"/></svg>',
    motorka:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" aria-hidden="true">' +
      '<circle cx="15" cy="44" r="9"/><circle cx="15" cy="44" r="2" fill="currentColor"/>' +
      '<circle cx="47" cy="44" r="9"/><circle cx="47" cy="44" r="2" fill="currentColor"/>' +
      '<path d="M15 44 L25 31 H38 L47 44"/><path d="M22 28 H33"/>' +
      '<path d="M38 31 L42 21 H48"/><circle cx="49" cy="25" r="2.2"/>' +
      '<path d="M25 31 L30 40 H38"/>' +
      '<path d="M3 26 H12 M6 33 H14 M2 19 H9" stroke-width="2"/>' +
      '<path d="M54 8 L55.2 11.8 L59 13 L55.2 14.2 L54 18 L52.8 14.2 L49 13 L52.8 11.8 Z" fill="currentColor" stroke="none"/></svg>',
    obraciak:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" aria-hidden="true">' +
      '<path d="M32 2 V12"/><circle cx="32" cy="36" r="21"/>' +
      '<ellipse cx="32" cy="36" rx="21" ry="8" transform="rotate(-25 32 36)"/>' +
      '<path d="M25 24 H39 L32 36 L39 48 H25 L32 36 Z"/>' +
      '<path d="M28.5 46 H35.5 L32 41 Z" fill="currentColor" stroke="none"/></svg>',
    rucho:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" aria-hidden="true">' +
      '<path d="M32 13 V9 a3.5 3.5 0 1 1 3.5 -3.5"/><path d="M32 13 L8 24 H56 Z"/>' +
      '<path d="M15 24 L9 58 H55 L49 24"/><path d="M24 24 L32 40 L40 24"/><path d="M32 40 V58"/>' +
      '<path d="M18 46 h7 M39 46 h7" stroke-width="1.8"/></svg>',
    galeon:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="currentColor"/>' +
      '<circle cx="32" cy="32" r="23" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>' +
      '<path d="M32 16 L35.4 27.3 L47.2 27.3 L37.7 34.3 L41.3 45.6 L32 38.7 L22.7 45.6 L26.3 34.3 L16.8 27.3 L28.6 27.3 Z" fill="rgba(0,0,0,.35)"/></svg>',
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
      '</svg>';
  }

  /* ---------- Tajné písmo (pigpen) ---------- */
  function pismeno(ch) {
    var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(ch);
    if (i < 0) return null;
    if (i < 18) { var j = i % 9; return { t: "m", r: Math.floor(j / 3), c: j % 3, d: i >= 9 }; }
    var q = ["h", "l", "p", "d"][(i - 18) % 4];
    return { t: "x", q: q, d: i >= 22 };
  }
  function tvarZnaku(z, s, p) {
    var m = [], e = s - p, h = s / 2;
    if (z.t === "m") {
      if (z.r > 0) m.push("M" + p + " " + p + " H" + e);
      if (z.r < 2) m.push("M" + p + " " + e + " H" + e);
      if (z.c > 0) m.push("M" + p + " " + p + " V" + e);
      if (z.c < 2) m.push("M" + e + " " + p + " V" + e);
      return { d: m.join(" "), bx: h, by: h };
    }
    if (z.q === "h") return { d: "M" + p + " " + p + " L" + h + " " + e + " L" + e + " " + p, bx: h, by: s * 0.4 };
    if (z.q === "l") return { d: "M" + p + " " + p + " L" + e + " " + h + " L" + p + " " + e, bx: s * 0.4, by: h };
    if (z.q === "p") return { d: "M" + e + " " + p + " L" + p + " " + h + " L" + e + " " + e, bx: s * 0.6, by: h };
    return { d: "M" + p + " " + e + " L" + h + " " + p + " L" + e + " " + e, bx: h, by: s * 0.6 };
  }
  function pigpenSlovo(slovo) {
    var html = '<div class="td-pigpen" role="img" aria-label="Slovo v tajnom písme">';
    String(slovo).toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split("").forEach(function (ch) {
      var z = pismeno(ch);
      if (!z) { html += '<svg viewBox="0 0 40 40"></svg>'; return; }
      var t = tvarZnaku(z, 40, 6);
      html += '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="' + t.d + '"/>' +
        (z.d ? '<circle cx="' + t.bx + '" cy="' + t.by + '" r="3.2" fill="currentColor" stroke="none"/>' : "") + "</svg>";
    });
    return html + "</div>";
  }
  function pigpenKluc() {
    var L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", s = "";
    function mriezka(ox, oy, od, bodky) {
      var g = '<g transform="translate(' + ox + " " + oy + ')" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<path d="M40 4 V116 M80 4 V116 M4 40 H116 M4 80 H116"/></g>';
      for (var k = 0; k < 9; k++) {
        var cx = ox + 20 + (k % 3) * 40, cy = oy + 20 + Math.floor(k / 3) * 40;
        g += '<text x="' + (bodky ? cx - 5 : cx) + '" y="' + (cy + 6) + '" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="17" fill="currentColor">' + L[od + k] + "</text>";
        if (bodky) g += '<circle cx="' + (cx + 9) + '" cy="' + (cy + 1) + '" r="2.6" fill="currentColor"/>';
      }
      return g;
    }
    function kriz(ox, oy, od, bodky) {
      var g = '<g transform="translate(' + ox + " " + oy + ')" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 12 L108 108 M108 12 L12 108"/></g>';
      var pos = [[60, 30], [30, 60], [90, 60], [60, 90]];
      for (var k = 0; k < 4; k++) {
        var cx = ox + pos[k][0], cy = oy + pos[k][1];
        g += '<text x="' + (bodky ? cx - 5 : cx) + '" y="' + (cy + 6) + '" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="17" fill="currentColor">' + L[od + k] + "</text>";
        if (bodky) g += '<circle cx="' + (cx + 9) + '" cy="' + (cy + 1) + '" r="2.6" fill="currentColor"/>';
      }
      return g;
    }
    s += mriezka(0, 0, 0, false) + mriezka(140, 0, 9, true) + kriz(0, 136, 18, false) + kriz(140, 136, 22, true);
    return '<div class="td-pigpen-kluc"><p>Kľúč k tajnému písmu</p><svg viewBox="-4 -4 268 264" role="img" aria-label="Kľúč: dve mriežky a dva krížiky s písmenami">' + s + "</svg></div>";
  }

  /* ---------- Zrkadlo ---------- */
  function zrkadlo(text) {
    return '<div class="td-zrkadlo"><div class="sklo"></div>' +
      '<svg class="ram" viewBox="0 0 300 400" fill="none" aria-hidden="true">' +
      '<ellipse cx="150" cy="200" rx="122" ry="170" stroke="currentColor" stroke-width="10"/>' +
      '<ellipse cx="150" cy="200" rx="108" ry="156" stroke="currentColor" stroke-width="2" opacity=".7"/>' +
      '<ellipse cx="150" cy="200" rx="132" ry="180" stroke="currentColor" stroke-width="1.5" opacity=".6"/>' +
      '<path d="M150 14 c-14 0 -22 10 -22 18 c8 -6 16 -6 22 2 c6 -8 14 -8 22 -2 c0 -8 -8 -18 -22 -18 Z" fill="currentColor"/>' +
      '<path d="M150 386 c-12 0 -18 -8 -18 -14 c6 4 12 4 18 -2 c6 6 12 6 18 2 c0 6 -6 14 -18 14 Z" fill="currentColor"/>' +
      '<circle cx="28" cy="200" r="6" fill="currentColor"/><circle cx="272" cy="200" r="6" fill="currentColor"/>' +
      "</svg><p>" + esc(text) + "</p></div>";
  }

  /* ---------- Fľaštičky ---------- */
  function flasa(m) {
    var f = m.farba || "#3f6fc4", tvar = m.tvar || "vysoka", telo, krk, korok, tekutina, vrch;
    if (tvar === "gulata") {
      vrch = 72;
      krk = '<path d="M25 72 V92 M35 72 V92" />';
      telo = '<path d="M25 92 C10 98 6 108 6 116 a24 22 0 0 0 48 0 c0 -8 -4 -18 -19 -24"/>';
      tekutina = '<path d="M8 112 a22 20 0 0 0 44 0 Z" fill="' + f + '"/>';
    } else if (tvar === "mala") {
      vrch = 92;
      krk = '<path d="M25 92 V104 M35 104 V92"/>';
      telo = '<path d="M25 104 H15 a3 3 0 0 0 -3 3 V135 a3 3 0 0 0 3 3 H45 a3 3 0 0 0 3 -3 V107 a3 3 0 0 0 -3 -3 H35"/>';
      tekutina = '<rect x="14" y="114" width="32" height="22" rx="2" fill="' + f + '"/>';
    } else if (tvar === "najvyssia") {
      vrch = 4;
      krk = '<path d="M25 4 V34 M35 4 V34"/>';
      telo = '<path d="M25 34 C14 40 12 46 12 54 V132 a6 6 0 0 0 6 6 H42 a6 6 0 0 0 6 -6 V54 C48 46 46 40 35 34"/>';
      tekutina = '<path d="M14 70 H46 V132 a5 5 0 0 1 -5 5 H19 a5 5 0 0 1 -5 -5 Z" fill="' + f + '"/>';
    } else {
      vrch = 30;
      krk = '<path d="M25 30 V54 M35 30 V54"/>';
      telo = '<path d="M25 54 C16 58 13 63 13 70 V132 a6 6 0 0 0 6 6 H41 a6 6 0 0 0 6 -6 V70 C47 63 44 58 35 54"/>';
      tekutina = '<path d="M15 86 H45 V132 a5 5 0 0 1 -5 5 H20 a5 5 0 0 1 -5 -5 Z" fill="' + f + '"/>';
    }
    korok = '<rect x="23" y="' + (vrch - 9) + '" width="14" height="11" rx="2.5" fill="#8a5a2b" stroke="#4a2e12" stroke-width="1.2"/>';
    return '<svg viewBox="0 0 60 142" aria-hidden="true"><g opacity=".9">' + tekutina + "</g>" +
      '<g fill="rgba(255,255,255,.12)" stroke="#2a1c10" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + krk + telo + "</g>" +
      '<path d="M18 ' + (tvar === "gulata" ? 104 : tvar === "mala" ? 110 : vrch + 46) + ' v' + (tvar === "mala" ? 14 : 22) + '" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>' +
      korok + "</svg>";
  }

  /* ---------- Pomocné ---------- */
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function spracuj(html) {
    return String(html || "")
      .replace(/\{\{pigpen:([^}]+)\}\}/g, function (_, w) { return pigpenSlovo(w); })
      .replace(/\{\{pigpenKluc\}\}/g, pigpenKluc)
      .replace(/\{\{zrkadlo:([^}]+)\}\}/g, function (_, t) { return zrkadlo(t); });
  }
  var RIMSKE = ["", "I", "II", "III", "IV", "V"];
  var PORADIE = ["", "Prvý", "Druhý", "Tretí", "Štvrtý", "Piaty"];
  var ZLE_TEXT = [
    "Prútik len zaiskril. Skús to znova.",
    "Triediaci klobúk nespokojne mrmle. To nebude ono.",
    "Brána zostáva zatvorená. Skontroluj, či je kúzlo správne napísané.",
    "Hermiona by zdvihla obočie. Skús ešte raz.",
    "Niekde v hrade sa ozval smiech duchov. Toto nie je správna odpoveď."
  ];
  var ZLE_ZAMOK = ["Goblin pokrúti hlavou. Nesprávny kód.", "Zámok ani nehol. Skús iné číslo.", "Goblini si niečo šepkajú. Toto číslo to nie je."];
  function galeonov(n) { return n === 1 ? "galeón" : n >= 2 && n <= 4 ? "galeóny" : "galeónov"; }
  function mesec(ma, celkom) {
    var h = '<div class="td-mesec' + (ma >= celkom ? " je-plny" : "") + '" aria-label="Galeóny: ' + ma + " z " + celkom + '"><span class="mince">';
    for (var i = 0; i < celkom; i++) h += '<i class="' + (i < ma ? "ma" : "") + '"></i>';
    return h + '</span><span class="pocet">' + ma + " / " + celkom + "</span></div>";
  }
  function radMinci(n) { var h = '<span class="td-minca-rad">'; for (var i = 0; i < n; i++) h += IKONY.galeon; return h + "</span>"; }
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
  function nahodny(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Postup (uložený v telefóne) ---------- */
  var KLUC_ULOZ = "tridary:v1:";
  function citaj(k) { try { return JSON.parse(localStorage.getItem(KLUC_ULOZ + k)); } catch (e) { return null; } }
  function zapis(k, v) { try { localStorage.setItem(KLUC_ULOZ + k, JSON.stringify(v)); } catch (e) { /* nevadí */ } }
  var demoPlatene = {};
  function platene(demo) { return demo ? demoPlatene : (citaj("platene") || {}); }
  function zaplatSpolu(demo) { var p = platene(demo), n = 0; for (var k in p) n += p[k]; return n; }
  function zapisPlatene(demo, id, pocet) {
    var p = platene(demo);
    if ((p[id] || 0) >= pocet) return false;
    p[id] = pocet;
    if (demo) demoPlatene = p; else zapis("platene", p);
    return true;
  }
  function najdeneDary() { return citaj("dary") || []; }
  function pridajDar(kap) { var d = najdeneDary(); if (d.indexOf(kap) < 0) { d.push(kap); zapis("dary", d); } }

  /* ---------- Kostra stránky ---------- */
  function kostra(cielEl, kapitoly, aktualna, dary, mesecStav) {
    cielEl.innerHTML = "";
    var scena = el("div", "td-scena");
    scena.appendChild(el("div", "td-hviezdy"));
    scena.appendChild(el("div", "td-sviecky", "<i></i><i></i><i></i><i></i><i></i>"));
    var hl = el("header", "td-hlavicka");
    hl.innerHTML = erb() + '<div class="td-nazov">Tri dary</div>';
    if (kapitoly && kapitoly.length) {
      var ol = el("ol", "td-kapitoly");
      kapitoly.forEach(function (k) {
        var li = el("li", "", IKONY[k.ikona] || "");
        var najdena = dary.indexOf(k.cislo) >= 0;
        if (najdena) li.classList.add("je-najdena");
        if (k.cislo === aktualna) li.classList.add("je-aktualna");
        li.setAttribute("aria-label", "Kapitola " + RIMSKE[k.cislo] + (najdena ? " – dar nájdený" : ""));
        ol.appendChild(li);
      });
      hl.appendChild(ol);
    }
    if (mesecStav) hl.insertAdjacentHTML("beforeend", mesec(mesecStav.ma, mesecStav.celkom));
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
    var c = el("canvas", "td-iskry"), ctx = c.getContext("2d"), dpr = Math.min(2, root.devicePixelRatio || 1);
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

  /* ---------- Krok (úloha) ---------- */
  function vykresliKrok(cielEl, krok, ctx) {
    ctx = ctx || {};
    var dary = ctx.dary || najdeneDary();
    var kap = krok.kapitola;
    var maMince = kap.mince && krok.galeonyCelkom;
    var main = kostra(cielEl, krok.kapitoly, krok.kapitola.cislo, dary, maMince ? { ma: krok.minceDoteraz, celkom: krok.galeonyCelkom } : null);

    main.appendChild(el("div", "td-stuzka", "Kapitola " + RIMSKE[kap.cislo] + " · " + esc(kap.nazov)));
    var body = el("div", "td-body");
    for (var i = 1; i <= krok.pocet; i++) {
      var s = el("span", i < krok.poradie ? "je-hotovy" : i === krok.poradie ? "je-teraz" : "");
      body.appendChild(s);
    }
    body.setAttribute("aria-label", "Krok " + krok.poradie + " z " + krok.pocet);
    main.appendChild(body);
    if (krok.poradie === 1 && kap.uvod) main.appendChild(el("p", "td-uvod-kap", esc(kap.uvod)));
    main.appendChild(el("h1", "td-titul", esc(krok.nazov)));
    if (krok.galeony) main.appendChild(el("div", "td-nalez", radMinci(krok.galeony) + "<span>Pri tejto karte si našla <b>" + krok.galeony + " " + galeonov(krok.galeony) + "</b>. Mešec: " + krok.minceDoteraz + " z " + krok.galeonyCelkom + ".</span>"));
    if (krok.pribeh) main.appendChild(el("p", "td-pribeh", krok.pribeh));
    main.appendChild(el("div", "td-ornament", IKONY.ornament));
    main.appendChild(el("div", "td-uloha", spracuj(krok.uloha)));

    var form = el("form", "td-formular");
    form.setAttribute("novalidate", "");
    var ziskajOdpoved;

    if (krok.typ === "zamok") {
      var cifry = krok.cifry || 3, hodnoty = [];
      var zamok = el("div", "td-zamok");
      zamok.setAttribute("role", "group");
      zamok.setAttribute("aria-label", "Číselný zámok");
      for (var z = 0; z < cifry; z++) {
        hodnoty.push(0);
        (function (idx) {
          var kol = el("div", "td-kolieska");
          var hore = el("button", "", "▲"), dole = el("button", "", "▼"), out = el("output", "", "0");
          hore.type = dole.type = "button";
          hore.setAttribute("aria-label", "Cifra " + (idx + 1) + " o jedna viac");
          dole.setAttribute("aria-label", "Cifra " + (idx + 1) + " o jedna menej");
          function zmen(d) {
            hodnoty[idx] = (hodnoty[idx] + d + 10) % 10; out.textContent = hodnoty[idx];
            out.classList.remove("je-zmena"); void out.offsetWidth; out.classList.add("je-zmena");
          }
          hore.onclick = function () { zmen(1); };
          dole.onclick = function () { zmen(-1); };
          kol.appendChild(hore); kol.appendChild(out); kol.appendChild(dole);
          zamok.appendChild(kol);
        })(z);
      }
      form.appendChild(zamok);
      ziskajOdpoved = function () { return hodnoty.join(""); };
    } else if (krok.typ === "volba") {
      var vybrana = null;
      var rad = el("div", "td-flase");
      rad.setAttribute("role", "group");
      rad.setAttribute("aria-label", "Vyber fľaštičku");
      (krok.moznosti || []).forEach(function (m) {
        var b = el("button", "td-flasa", flasa(m) + '<span class="cislo">' + esc(m.id) + "</span>");
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-label", "Fľaša " + m.id + (m.nazov ? ", " + m.nazov : ""));
        b.onclick = function () {
          vybrana = m.id;
          rad.querySelectorAll(".td-flasa").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
        };
        rad.appendChild(b);
      });
      form.appendChild(rad);
      ziskajOdpoved = function () { return vybrana; };
    } else {
      var vstup = el("input", "td-vstup");
      vstup.type = "text";
      vstup.autocomplete = "off";
      vstup.setAttribute("autocapitalize", "characters");
      vstup.setAttribute("autocorrect", "off");
      vstup.spellcheck = false;
      vstup.placeholder = krok.placeholder || "Tvoja odpoveď…";
      vstup.setAttribute("aria-label", "Odpoveď");
      form.appendChild(vstup);
      ziskajOdpoved = function () { return vstup.value; };
    }

    var btn = el("button", "td-tlacidlo", esc(krok.tlacidlo || "Vysloviť kúzlo"));
    btn.type = "submit";
    form.appendChild(btn);
    var hlaska = el("p", "td-hlaska");
    hlaska.setAttribute("aria-live", "polite");
    form.appendChild(hlaska);
    main.appendChild(form);

    /* Nápovedy */
    var nap = el("div", "td-napovedy"), pouzite = 0, zle = 0;
    var zadarmo = krok.napovedaZadarmo != null ? krok.napovedaZadarmo : 99;
    var bonus = krok.bonusGaleony || 0;
    var platba = el("p", "td-platba");
    platba.setAttribute("aria-live", "polite");
    var napovedy = krok.napovedy || [];
    var pomoc = el("button", "td-pomoc-btn");
    pomoc.type = "button";
    var zoznam = el("ol");
    function popisPomoci() {
      var zostava = napovedy.length - pouzite;
      var dalsiaPlatena = pouzite >= zadarmo && bonus;
      pomoc.textContent = zostava > 0
        ? "✦ Potrebujem pomoc (" + (dalsiaPlatena ? "stojí 1 galeón s hviezdou" : "zadarmo") + ", zostáva " + zostava + ")"
        : "Viac pomoci už niet – zvládneš to";
      pomoc.disabled = zostava <= 0;
    }
    pomoc.onclick = function () {
      if (pouzite >= napovedy.length) return;
      pouzite++;
      pomoc.classList.remove("je-pulz");
      var li = el("li", "", "<b>Pomoc " + pouzite + " z " + napovedy.length + "</b>" + napovedy[pouzite - 1]);
      if (bonus && pouzite > zadarmo) {
        var nova = zapisPlatene(ctx.demo, krok.id, pouzite - zadarmo);
        var spolu = zaplatSpolu(ctx.demo);
        if (nova) {
          platba.innerHTML = spolu <= bonus
            ? radMinci(1) + "<span>Polož jeden <b>galeón s hviezdou</b> do misky goblinov. Zostáva ti " + (bonus - spolu) + " z " + bonus + ".</span>"
            : radMinci(1) + "<span>Galeóny s hviezdou ti došli, tak ti goblini požičali. Dlh: <b>" + (spolu - bonus) + " " + galeonov(spolu - bonus) + "</b>. Nič sa nedeje, len si to zapíšu.</span>";
        }
      }
      zoznam.appendChild(li);
      popisPomoci();
    };
    if (napovedy.length) { popisPomoci(); nap.appendChild(pomoc); nap.appendChild(zoznam); nap.appendChild(platba); main.appendChild(nap); }

    function ukazOdhalenie(odh, uzPredtym) {
      form.remove();
      nap.remove();
      var sec = el("section", "td-odhalenie");
      sec.innerHTML = erb(null, "td-pecat") +
        '<div class="td-odh-stitok">' + (uzPredtym ? "Už vyriešené" : "Správne") + "</div>" +
        '<h2 class="td-odh-nadpis">' + esc(odh.nadpis) + "</h2>" +
        '<p class="td-odh-text">' + (odh.text || "") + "</p>";
      if (odh.galeony) {
        sec.appendChild(el("div", "td-nalez je-odmena", radMinci(odh.galeony) + "<span><b>+" + odh.galeony + " " + galeonov(odh.galeony) + "</b> do mešca. Spolu ich máš " + odh.minceSpolu + " z " + odh.galeonyCelkom + ".</span>"));
        var ms = cielEl.querySelector(".td-mesec");
        if (ms) ms.outerHTML = mesec(odh.minceSpolu, odh.galeonyCelkom);
      }
      if (odh.finale) {
        sec.appendChild(el("div", "td-dar",
          '<div class="ikony">' + (krok.kapitoly || []).map(function (k) { return IKONY[k.ikona] || ""; }).join("") + "</div>" +
          '<div class="poradie">Všetky tri dary</div><div class="veta">sú tvoje</div>'));
      } else if (odh.dar) {
        sec.appendChild(el("div", "td-dar",
          (IKONY[kap.ikona] || "") + '<div class="poradie">' + PORADIE[kap.cislo] + " dar</div>" +
          '<div class="veta">je na dosah</div>'));
      }
      if (odh.certifikat) sec.insertAdjacentHTML("beforeend", certifikatHTML(odh.certifikat, krok.bonusGaleony ? Math.max(0, zaplatSpolu(ctx.demo) - krok.bonusGaleony) : null));
      if (odh.podpis && !odh.certifikat) sec.appendChild(el("div", "td-odh-podpis", "— " + esc(odh.podpis)));
      main.appendChild(sec);
      if (!uzPredtym) {
        iskry(odh.finale ? 2.6 : odh.dar ? 1.8 : 1);
        if (odh.finale) setTimeout(function () { iskry(1.6); }, 900);
        setTimeout(function () { sec.scrollIntoView({ behavior: "smooth", block: "start" }); }, 250);
      }
      if (odh.dar || odh.finale) {
        if (!ctx.demo) pridajDar(kap.cislo);
        var li = cielEl.querySelectorAll(".td-kapitoly li")[kap.cislo - 1];
        if (li) li.classList.add("je-najdena");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var odp = ziskajOdpoved();
      if (odp == null || String(odp).trim() === "") {
        hlaska.className = "td-hlaska";
        hlaska.textContent = krok.typ === "volba" ? "Najprv si vyber jednu fľaštičku." : "Najprv niečo napíš.";
        return;
      }
      btn.disabled = true;
      hlaska.className = "td-hlaska";
      hlaska.textContent = "Kúzlo sa formuje…";
      Promise.resolve(ctx.over ? ctx.over(odp) : null).then(function (odh) {
        btn.disabled = false;
        if (odh) {
          if (ctx.ulozit) ctx.ulozit(odh);
          ukazOdhalenie(odh, false);
        } else {
          zle++;
          hlaska.textContent = nahodny(krok.typ === "zamok" ? ZLE_ZAMOK : ZLE_TEXT);
          form.classList.remove("td-trasenie"); void form.offsetWidth; form.classList.add("td-trasenie");
          if (zle >= 3 && pouzite < napovedy.length) pomoc.classList.add("je-pulz");
        }
      }).catch(function () {
        btn.disabled = false;
        hlaska.textContent = "Niečo sa pokazilo. Skús to znova.";
      });
    });

    if (ctx.ulozene) ukazOdhalenie(ctx.ulozene, true);
  }

  /* ---------- Odpočítavanie (kapitola ešte zamknutá) ---------- */
  function vykresliOdpocet(cielEl, krok, ctx) {
    ctx = ctx || {};
    var kap = krok.kapitola, ciel = new Date(kap.odomknut);
    var main = kostra(cielEl, krok.kapitoly, kap.cislo, ctx.dary || najdeneDary());
    main.appendChild(el("div", "td-stuzka", "Kapitola " + RIMSKE[kap.cislo] + " · " + esc(kap.nazov)));
    main.appendChild(el("h1", "td-titul", "Ešte nie je čas"));
    main.appendChild(el("p", "td-pribeh", "Táto karta zatiaľ spí. Prebudí sa, keď sa otvorí kapitola " + RIMSKE[kap.cislo] + ". Dovtedy ju dobre opatruj."));
    var box = el("div", "td-odpocet");
    box.setAttribute("aria-live", "off");
    main.appendChild(box);
    var dni = ["v nedeľu", "v pondelok", "v utorok", "v stredu", "vo štvrtok", "v piatok", "v sobotu"];
    main.appendChild(el("p", "td-datum", "Otvorí sa " + dni[ciel.getDay()] + " " + ciel.getDate() + ". " + (ciel.getMonth() + 1) + ". " + ciel.getFullYear() + " o " + ciel.getHours() + ":" + String(ciel.getMinutes()).padStart(2, "0") + "."));
    main.appendChild(el("div", "td-ornament", IKONY.ornament));
    if (kap.uvod) main.appendChild(el("p", "td-uvod-kap", esc(kap.uvod)));
    function tik() {
      var ms = ciel - Date.now();
      if (ms <= 0) { clearInterval(int); if (ctx.poOdomknuti) ctx.poOdomknuti(); else location.reload(); return; }
      var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      box.innerHTML = [[d, "dní"], [h, "hod"], [m, "min"], [s, "sek"]].map(function (x) {
        return "<div><b>" + String(x[0]).padStart(2, "0") + "</b><span>" + x[1] + "</span></div>";
      }).join("");
    }
    var int = setInterval(tik, 1000);
    tik();
  }

  /* ---------- Úvodná stránka a chyby ---------- */
  function vykresliUvod(cielEl, info) {
    info = info || {};
    var dary = najdeneDary();
    var main = kostra(cielEl, null, 0, dary);
    var u = el("div", "td-uvod");
    u.innerHTML = erb(null, "td-erb-velky") +
      '<h1 class="td-titul">' + esc(info.titul || "Hrad je zamknutý") + "</h1>" +
      '<p class="td-pribeh">' + (info.text || "Tento hrad sa otvára len kartám so znakom. Namier fotoaparát mobilu na kartu a brána sa otvorí.") + "</p>" +
      '<div class="td-ornament">' + IKONY.ornament + "</div>" +
      (dary.length ? '<p class="td-uloha" style="text-align:center">Nájdené dary: <b>' + dary.length + " z 3</b></p>" : "");
    main.appendChild(u);
  }

  /* ---------- Spustenie na webe (GitHub Pages) ---------- */
  async function spustiWeb(cielEl) {
    var data = root.TRI_DARY_DATA;
    var kod = decodeURIComponent((location.hash || "").replace(/^#/, "")).trim();
    if (!kod) { vykresliUvod(cielEl); return; }
    if (!data || !root.crypto || !root.crypto.subtle) {
      vykresliUvod(cielEl, { titul: "Kúzlo sa nedá vykonať", text: "Tento prehliadač nevie čarovať. Skús kartu otvoriť v Safari alebo v Chrome." });
      return;
    }
    vykresliUvod(cielEl, { titul: "Otváram bránu…", text: "Chvíľku strpenia, kúzlo sa formuje." });
    var id = await Sifra.idKroku(kod);
    var box = data.kroky[id];
    if (!box) {
      vykresliUvod(cielEl, { titul: "Kúzlo nezabralo", text: "Táto karta nepatrí do tohto hradu. Skús ju naskenovať ešte raz." });
      return;
    }
    var krok;
    try { krok = await Sifra.desifrujKrok(box, kod, data.iterKrok); }
    catch (e) { vykresliUvod(cielEl, { titul: "Kúzlo nezabralo", text: "Kartu sa nepodarilo prečítať. Skús ju naskenovať ešte raz." }); return; }

    document.title = krok.nazov + " · Tri dary";
    if (krok.kapitola.odomknut && new Date(krok.kapitola.odomknut).getTime() > Date.now()) {
      vykresliOdpocet(cielEl, krok);
      return;
    }
    vykresliKrok(cielEl, krok, {
      ulozene: citaj("krok:" + id),
      over: function (odp) { return Sifra.overOdpoved(krok.odh, odp, data.iterOdp); },
      ulozit: function (odh) { zapis("krok:" + id, odh); }
    });
  }

  root.TriDary = {
    IKONY: IKONY,
    erb: erb,
    pigpenSlovo: pigpenSlovo,
    pigpenKluc: pigpenKluc,
    zrkadlo: zrkadlo,
    flasa: flasa,
    certifikatHTML: certifikatHTML,
    spracuj: spracuj,
    vykresliKrok: vykresliKrok,
    vykresliOdpocet: vykresliOdpocet,
    vykresliUvod: vykresliUvod,
    spustiWeb: spustiWeb
  };
})(window);

/* Tri dary – šifrovanie úloh a odpovedí (AES-GCM + PBKDF2, Web Crypto).
   Bez správnej karty (kódu v QR) sa nedá prečítať úloha
   a bez správnej odpovede sa nedá prečítať, kam ísť ďalej. */
(function (root) {
  "use strict";
  var C = root.crypto;
  var enc = new TextEncoder();
  var dec = new TextDecoder();

  function norm(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function b64(buf) {
    var bytes = new Uint8Array(buf), s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function unb64(str) {
    var s = atob(str), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  function nahodne(n) {
    var a = new Uint8Array(n);
    C.getRandomValues(a);
    return a;
  }

  async function sha256hex(text) {
    var h = new Uint8Array(await C.subtle.digest("SHA-256", enc.encode(text)));
    return Array.prototype.map.call(h, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  async function odvodKluc(heslo, salt, iter) {
    var zaklad = await C.subtle.importKey("raw", enc.encode(heslo), "PBKDF2", false, ["deriveKey"]);
    return C.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: iter, hash: "SHA-256" },
      zaklad, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }

  async function zasifrujKlucom(obj, kluc) {
    var iv = nahodne(12);
    var ct = await C.subtle.encrypt({ name: "AES-GCM", iv: iv }, kluc, enc.encode(JSON.stringify(obj)));
    return { i: b64(iv), c: b64(ct) };
  }
  async function desifrujKlucom(box, kluc) {
    var pt = await C.subtle.decrypt({ name: "AES-GCM", iv: unb64(box.i) }, kluc, unb64(box.c));
    return JSON.parse(dec.decode(pt));
  }

  var PREFIX_KROK = "tri-dary:krok:";
  var PREFIX_ODPOVED = "tri-dary:odpoved:";

  function idKroku(kod) {
    return sha256hex("tri-dary:id:" + norm(kod)).then(function (h) { return h.slice(0, 24); });
  }

  /* Úloha zašifrovaná kódom z QR karty */
  async function zasifrujKrok(obj, kod, iter) {
    var salt = nahodne(16);
    var k = await odvodKluc(PREFIX_KROK + norm(kod), salt, iter);
    var box = await zasifrujKlucom(obj, k);
    box.s = b64(salt);
    return box;
  }
  async function desifrujKrok(box, kod, iter) {
    var k = await odvodKluc(PREFIX_KROK + norm(kod), unb64(box.s), iter);
    return desifrujKlucom(box, k);
  }

  /* Odhalenie zašifrované každou prijateľnou odpoveďou (spoločná soľ) */
  async function zasifrujOdhalenie(obj, odpovede, iter) {
    var salt = nahodne(16), boxy = [], videne = {};
    for (var i = 0; i < odpovede.length; i++) {
      var n = norm(odpovede[i]);
      if (!n || videne[n]) continue;
      videne[n] = 1;
      var k = await odvodKluc(PREFIX_ODPOVED + n, salt, iter);
      boxy.push(await zasifrujKlucom(obj, k));
    }
    return { s: b64(salt), boxy: boxy };
  }
  async function overOdpoved(zaznam, odpoved, iter) {
    var n = norm(odpoved);
    if (!n) return null;
    var k = await odvodKluc(PREFIX_ODPOVED + n, unb64(zaznam.s), iter);
    for (var i = 0; i < zaznam.boxy.length; i++) {
      try { return await desifrujKlucom(zaznam.boxy[i], k); } catch (e) { /* skúsime ďalší */ }
    }
    return null;
  }

  root.Sifra = {
    norm: norm,
    sha256hex: sha256hex,
    idKroku: idKroku,
    zasifrujKrok: zasifrujKrok,
    desifrujKrok: desifrujKrok,
    zasifrujOdhalenie: zasifrujOdhalenie,
    overOdpoved: overOdpoved
  };
})(typeof window !== "undefined" ? window : globalThis);

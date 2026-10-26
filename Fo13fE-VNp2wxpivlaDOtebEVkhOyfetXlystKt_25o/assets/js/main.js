/* WHYTE CREATIVES — Mason-theme interactions */
(function () {
  "use strict";

  /* ---------- overlay menu ---------- */
  var overlay = document.querySelector(".menu-overlay");
  var openBtn = document.querySelector(".menu-btn");
  var closeBtn = document.querySelector(".menu-close");
  function setMenu(open) {
    overlay.classList.toggle("open", open);
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var first = overlay.querySelector(".menu-links a"); if (first) first.focus(); }
    else openBtn.focus();
  }
  if (overlay) {
    openBtn.addEventListener("click", function () { setMenu(true); });
    closeBtn.addEventListener("click", function () { setMenu(false); });
    overlay.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) setMenu(false);
    });
  }

  /* ---------- carousel strips ---------- */
  document.querySelectorAll(".strip").forEach(function (strip) {
    var track = strip.querySelector(".strip-track");
    var prev = strip.querySelector("[data-dir='-1']");
    var next = strip.querySelector("[data-dir='1']");
    var step = function () { return track.querySelector("img").clientWidth; };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step() * 3, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step() * 3, behavior: "smooth" }); });
    /* drag to scroll */
    var down = false, startX = 0, startL = 0;
    track.addEventListener("pointerdown", function (e) {
      down = true; startX = e.clientX; startL = track.scrollLeft;
      track.style.cursor = "grabbing";
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      track.scrollLeft = startL - (e.clientX - startX);
    });
    window.addEventListener("pointerup", function () { down = false; track.style.cursor = "grab"; });
  });

  /* ---------- scroll reveals ---------- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- lightbox ---------- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var items = Array.prototype.slice.call(document.querySelectorAll(".masonry button"));
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var idx = 0, lastFocus = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var img = items[idx].querySelector("img");
      lbImg.src = img.dataset.full || img.src;
      lbImg.alt = img.alt || "";
      lbCap.textContent = items[idx].dataset.title || "";
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    };
    var close = function () {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    items.forEach(function (it, i) { it.addEventListener("click", function () { open(i); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- contact form (FormSubmit AJAX) ---------- */
  var form = document.querySelector("[data-formsubmit]");
  if (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (data._honey) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
        .then(function () {
          status.className = "form-status ok";
          status.textContent = "Thank you — your message is on its way. I reply within 24–48 hours.";
          form.reset();
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Something went wrong. Please email whytecobby@gmail.com directly.";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        });
    });
  }

  /* ---------- lazy image fade-in ---------- */
  document.querySelectorAll("img[data-fade]").forEach(function (img) {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.8s ease";
    var done = function () { img.style.opacity = "1"; };
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener("load", done); img.addEventListener("error", done); }
  });

  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();

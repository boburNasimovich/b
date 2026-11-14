// BIGBURGER — Render logikasi (Eski Smart TV brauzerlari uchun universal versiya)
var fmt = function(n) {
  return n.toLocaleString("ru-RU") + " so'm";
};

function startClock(selector) {
  var els = document.querySelectorAll(selector);
  if (!els.length) return;
  var tick = function() {
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, "0");
    var mm = String(d.getMinutes()).padStart(2, "0");
    var ss = String(d.getSeconds()).padStart(2, "0");
    els.forEach(function(el) {
      el.innerHTML = hh + ":" + mm + "<span class=\"sec\">:" + ss + "</span>";
    });
  };
  tick();
  setInterval(tick, 1000);
}

function marqueeHTML() {
  var items = window.MARQUEE || ["BIGBURGER"];
  var doubled = items.concat(items).concat(items);
  return `
    <div class="marquee">
      <div class="marquee-track">
        ` + doubled.map(function(t) { return "<span>" + t + "</span>"; }).join("") + `
      </div>
    </div>
  `;
}

function headerHTML(title, subtitle, accent) {
  return `
    <div class="screen-header">
      <div class="screen-mark">
        <div class="m-logo">B</div>
        <div class="m-name">BIG<span>BURGER</span></div>
      </div>
      <div class="center">
        <span class="pill">` + accent + `</span>
        <div class="screen-title">` + title + `</div>
        ` + (subtitle ? `<div class="screen-subtitle">` + subtitle + `</div>` : "") + `
      </div>
      <div class="clock" data-clock>--:--</div>
    </div>
  `;
}

function cardHTML(item) {
  return `
    <div class="menu-card">
      <div class="img-wrap">
        ` + (item.badge ? `<span class="badge">` + item.badge + `</span>` : "") + `
        <img src="` + item.img + `" alt="` + item.name + `" />
        <div class="img-fade"></div>
      </div>
      <div class="info">
        <div class="name">` + item.name + `</div>
        <div class="price">` + fmt(item.price) + `</div>
      </div>
    </div>
  `;
}

// MONITOR 1 — LAVASH + HOT-DOG + PITSA (3x3 dinamik almashinuv)
function monitor1() {
  var l = window.MENU.lavash.items;
  var h = window.MENU.hotdog.items;
  var p = window.MENU.pitsa.items;
  var allItems = l.concat(h).concat(p);
  var initialVisible = allItems.slice(0, 9);

  return `
    <div class="screen-inner">
      ` + headerHTML("LAVASH · HOT-DOG · PITSA", "Yangi tayyorlangan, issiq taomlar", "MONITOR 01") + `
      <div class="grid-area grid-3x3" data-dynamic-grid="monitor1">
        ` + initialVisible.map(cardHTML).join("") + `
      </div>
      ` + marqueeHTML() + `
    </div>
  `;
}

// MONITOR 2 — BURGERLAR (4x2 dinamik almashinuv)
function monitor2() {
  var cat = window.MENU.burger;
  var initialVisible = cat.items.slice(0, 8);

  return `
    <div class="screen-inner">
      ` + headerHTML(cat.title, cat.subtitle, "MONITOR 02") + `
      <div class="grid-area grid-4x2" data-dynamic-grid="monitor2">
        ` + initialVisible.map(cardHTML).join("") + `
      </div>
      ` + marqueeHTML() + `
    </div>
  `;
}

// MONITOR 3 — ICHIMLIKLAR (4x2)
function monitor3() {
  var cat = window.MENU.ichimliklar;
  return `
    <div class="screen-inner">
      ` + headerHTML(cat.title, cat.subtitle, "MONITOR 03") + `
      <div class="grid-area grid-4x2">
        ` + cat.items.map(cardHTML).join("") + `
      </div>
      ` + marqueeHTML() + `
    </div>
  `;
}

// Umumiy dinamik almashinuv funksiyasi (1- va 2-monitorlar uchun)
function setupDynamicSwap(selector, allItems, visibleCount, intervalMs) {
  var grids = document.querySelectorAll(selector);
  if (!grids.length || allItems.length <= visibleCount) return;

  grids.forEach(function(grid) {
    var visibleItems = allItems.slice(0, visibleCount);
    var reserveItems = allItems.slice(visibleCount);
    var lastSlot = -1;

    setInterval(function() {
      var cards = grid.querySelectorAll(".menu-card");
      if (cards.length < visibleCount || !reserveItems.length) return;

      // Ketma-ket bir xil katak tushmasligi uchun random slot tanlaymiz
      var slotIdx = Math.floor(Math.random() * visibleCount);
      if (slotIdx === lastSlot) {
        slotIdx = (slotIdx + 1) % visibleCount;
      }
      lastSlot = slotIdx;

      var incomingItem = reserveItems.shift();
      var outgoingItem = visibleItems[slotIdx];

      visibleItems[slotIdx] = incomingItem;
      reserveItems.push(outgoingItem);

      var targetCard = cards[slotIdx];
      targetCard.classList.add("card-swapping");

      setTimeout(function() {
        var temp = document.createElement("div");
        temp.innerHTML = cardHTML(incomingItem).trim();
        var newCard = temp.firstChild;
        newCard.classList.add("card-swapping");

        grid.replaceChild(newCard, targetCard);

        setTimeout(function() {
          newCard.classList.remove("card-swapping");
        }, 50);
      }, 350);

    }, intervalMs);
  });
}

function initDynamicMonitors() {
  // 1-monitor: 9 ta ko'rinadi, qolgan 4 tasi har 6 soniyada almashadi
  var m1Items = window.MENU.lavash.items
    .concat(window.MENU.hotdog.items)
    .concat(window.MENU.pitsa.items);
  setupDynamicSwap('[data-dynamic-grid="monitor1"]', m1Items, 9, 6000);

  // 2-monitor: 8 ta (4x2) ko'rinadi, ortib qolgan 1 tasi har 6 soniyada almashadi
  var m2Items = window.MENU.burger.items;
  setupDynamicSwap('[data-dynamic-grid="monitor2"]', m2Items, 8, 6000);
}

var MONITORS = { "1": monitor1, "2": monitor2, "3": monitor3 };

document.addEventListener("DOMContentLoaded", function() {
  // Preview rendering
  document.querySelectorAll("[data-monitor-preview]").forEach(function(el) {
    var id = el.getAttribute("data-monitor-preview");
    var fn = MONITORS[id];
    if (fn) el.innerHTML = fn();
  });

  // Full-screen rendering
  var stage = document.getElementById("stage");
  if (stage) {
    var id = new URLSearchParams(location.search).get("id") || "1";
    var fn = MONITORS[id] || monitor1;
    stage.innerHTML = fn();
    
    document.querySelectorAll(".tabs a").forEach(function(a) {
      a.classList.toggle("active", a.getAttribute("data-id") === id);
    });
    document.title = "Monitor 0" + id + " — BIGBURGER";
  }

  startClock("[data-clock]");
  initDynamicMonitors();
  
  if ('wakeLock' in navigator) {
    requestWakeLock();
  }
});

var wakeLock = null;
function requestWakeLock() {
  try {
    navigator.wakeLock.request('screen').then(function(lock) {
      wakeLock = lock;
    });
  } catch (e) {
    console.log('Wake lock xatosi chetlab o\'tildi');
  }
}
BIGBURGER — Digital Menu Board (3 monitor)
==========================================

KIRITILGAN FAYLLAR:
  index.html      — Boshqaruv paneli (3 ta monitor preview)
  monitor.html    — Bitta monitorni to'liq ekranda ochish
                    (?id=1 Lavash, ?id=2 Burger, ?id=3 Mix)
  styles.css      — Stillar (dark theme, orange/yellow brand)
  data.js         — Menyu ma'lumotlari (narxlar, rasmlar)
  app.js          — Render logikasi va jonli soat
  assets/         — 25 ta mahsulot rasmi (.jpg)

ISHGA TUSHIRISH:
  1. Faylni arxivdan chiqaring
  2. index.html ni brauzerda oching
  3. Har bir monitorni alohida ekranda ochish uchun
     "Monitor 0X → To'liq ekran" tugmasini bosing

JONLI MONITOR (kafe ekranlari uchun):
  • Monitor 1 (chap):  monitor.html?id=1   (Lavash — 8 ta)
  • Monitor 2 (o'rta): monitor.html?id=2   (Burgerlar — 9 ta)
  • Monitor 3 (o'ng):  monitor.html?id=3   (Hot-dog + Pitsa + Gazak — 9 ta)

Har bir monitor 16:9 ekranga moslangan, hamma mahsulot
bir vaqtda ekranni to'ldirib turadi.

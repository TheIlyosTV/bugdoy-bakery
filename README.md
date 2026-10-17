# Bug‘doy — nonvoyxona sayti

Bitta sahifali statik sayt: HTML + CSS + JavaScript. Backend va ma’lumotlar bazasi yo‘q.

## Fayllar

```
index.html          — sahifa tuzilishi
css/style.css       — dizayn (ranglar fayl boshida, :root ichida)
js/products.js      — MAHSULOTLAR, NARXLAR va ALOQA ma’lumotlari  ← asosan shu tahrirlanadi
js/app.js           — savat, buyurtma matni, animatsiyalar
assets/img/         — rasmlar (.webp)
favicon.svg         — sayt belgisi
```

## Mahsulot va narxlarni o‘zgartirish

`js/products.js` ni istalgan matn muharririda (Notepad, VS Code) oching.

**Narxni o‘zgartirish** — kerakli qatordagi `price` ni almashtiring (faqat raqam, bo‘sh joysiz):

```js
{ id: "kruassan", ..., price: 12000, ... }   →   price: 13500
```

**Yangi mahsulot qo‘shish** — mavjud qatordan nusxa olib, pastiga qo‘ying va qiymatlarini o‘zgartiring:

```js
{ id: "patir", category: "non", name: "Patir non", desc: "Tandirda yopilgan qatlamli patir.", price: 10000, unit: "dona", image: "assets/img/patir.webp" },
```

- `id` — takrorlanmasin, faqat lotin harf, raqam va `-`.
- `category` — `non`, `shirinlik` yoki `tort`.
- `badge` — ixtiyoriy yorliq (`"Yangi"`, `"Xit"`); kerak bo‘lmasa yozmang.

**Mahsulotni o‘chirish** — uning qatorini butunlay o‘chiring.

**Kategoriya qo‘shish** — `CATEGORIES` ro‘yxatiga `{ id: "pishiriq", name: "Pishiriqlar" }` qo‘shing, so‘ng mahsulotlarda `category: "pishiriq"` yozing.

## Rasmlarni almashtirish

1. Rasmni 640×480 (4:3) o‘lchamga keltiring va `.webp` formatida saqlang (masalan, squoosh.app orqali, sifat ~75). Bitta rasm 30–80 KB atrofida bo‘lsin.
2. Faylni `assets/img/` ga qo‘ying.
3. `products.js` da `image: "assets/img/fayl-nomi.webp"` deb yozing.

Bosh banner: `assets/img/hero.webp` (1800 px) va `hero-sm.webp` (900 px, telefonlar uchun).

## Telefon, Telegram, manzil, ish vaqti

`js/products.js` boshidagi `CONFIG`:

```js
phone: "+998 90 123 45 67",     // ekranda ko‘rinadigani
phoneLink: "+998901234567",     // qo‘ng‘iroq uchun
telegram: "bugdoy_buyurtma",    // @ siz; buyurtmalar shu chatga yuboriladi
instagram: "bugdoy.bakery",
address: "...",
mapUrl: "https://yandex.uz/maps/...",   // Yandex yoki Google Maps havolasi
hours: [["Dushanba – Shanba", "07:00 – 21:00"], ...],
```

Bu qiymatlar sahifaning hamma joyida avtomatik yangilanadi. Faqat `index.html` dagi sayt nomi, tavsifi (`<title>`, `<meta name="description">`) va “Biz haqimizda” matni qo‘lda o‘zgartiriladi.

## Buyurtma qanday ishlaydi

1. Mijoz mahsulotlarni savatga qo‘shadi — savat brauzer xotirasida (localStorage) saqlanadi, sahifa yangilansa ham yo‘qolmaydi.
2. Savatda sonini o‘zgartiradi yoki o‘chiradi, jami narx avtomatik hisoblanadi.
3. “Buyurtma berish” → ism, telefon, yetkazish/olib ketish, manzil.
4. Tayyor buyurtma matni chiqadi. “Telegramda yuborish” bosilganda matn avtomatik nusxalanadi va `t.me/<telegram>` chati ochiladi — mijoz matnni joylab yuboradi.

Bot tokeni yoki boshqa maxfiy kalit ishlatilmaydi.

## Joylash (hosting)

Papka to‘liq statik — hech qanday build kerak emas. Butun papkani yuklash kifoya:

- **Netlify**: app.netlify.com/drop sahifasiga papkani sudrab tashlang.
- **Vercel**: `npx vercel deploy --prod` (papka ichida).
- **GitHub Pages**: repoga yuklab, Settings → Pages → `main` branch.
- **Oddiy hosting (cPanel)**: fayllarni `public_html` ga yuklang.

Lokal ko‘rish: `index.html` ni brauzerda oching yoki `python -m http.server` ishga tushiring.

Demo rasmlar Unsplash’dan olingan (bepul litsenziya); haqiqiy sayt uchun nonvoyxonaning o‘z mahsulot suratlariga almashtirish tavsiya etiladi.

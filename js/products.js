/*
 * Bug‘doy nonvoyxonasi — mahsulotlar va sozlamalar.
 * Narx, nom yoki rasmni o‘zgartirish uchun faqat shu faylni tahrirlang.
 * Batafsil: README.md
 */

const CONFIG = {
  name: "Bug‘doy",
  phone: "+998 90 123 45 67",          // ekranda ko‘rinadigan ko‘rinish
  phoneLink: "+998901234567",         // qo‘ng‘iroq havolasi uchun (bo‘sh joysiz)
  telegram: "bugdoy_buyurtma",        // Telegram username (@ belgisisiz) — buyurtmalar shu chatga keladi
  instagram: "bugdoy.bakery",         // Instagram username
  address: "Toshkent, Chilonzor tumani, Bunyodkor shoh ko‘chasi, 12-uy",
  mapUrl: "https://yandex.uz/maps/?text=Toshkent%20Chilonzor%20Bunyodkor%2012",
  hours: [
    ["Dushanba – Shanba", "07:00 – 21:00"],
    ["Yakshanba", "08:00 – 18:00"],
  ],
  currency: "so‘m",
};

const CATEGORIES = [
  { id: "non", name: "Nonlar" },
  { id: "shirinlik", name: "Shirinliklar" },
  { id: "tort", name: "Tortlar" },
];

/*
 * Har bir mahsulot:
 *   id       — takrorlanmas qisqa nom (lotin harflari, savat shu bo‘yicha saqlanadi)
 *   category — CATEGORIES dagi id lardan biri
 *   name     — mahsulot nomi
 *   desc     — qisqa tavsif (1 jumla)
 *   price    — narx, so‘mda, faqat raqam
 *   unit     — o‘lchov birligi (dona, kg, butun ...)
 *   image    — assets/img/ ichidagi rasm (640×480 .webp tavsiya etiladi)
 *   badge    — ixtiyoriy yorliq ("Yangi", "Xit" ...), kerak bo‘lmasa olib tashlang
 */
const PRODUCTS = [
  // ——— Nonlar ———
  { id: "bugdoy-non", category: "non", name: "Bug‘doy noni", desc: "Har tong yangi pishadigan, yumshoq ichli klassik non.", price: 6000, unit: "dona", image: "assets/img/bugdoy-non.webp", badge: "Xit" },
  { id: "javdar-non", category: "non", name: "Javdar noni", desc: "Kunjut va urug‘lar bilan, to‘q ta’mli foydali non.", price: 9000, unit: "dona", image: "assets/img/javdar-non.webp" },
  { id: "xamirturushli-non", category: "non", name: "Xamirturushli non", desc: "24 soat tabiiy achitqida tindirilgan qarsildoq qobiqli non.", price: 14000, unit: "dona", image: "assets/img/xamirturushli-non.webp", badge: "Yangi" },
  { id: "baton-assorti", category: "non", name: "Non assorti", desc: "Baton, bulochka va kunjutli nonlar to‘plami — oila dasturxoni uchun.", price: 32000, unit: "to‘plam", image: "assets/img/baton-assorti.webp" },

  // ——— Shirinliklar ———
  { id: "kruassan", category: "shirinlik", name: "Sariyog‘li kruassan", desc: "Tabiiy sariyog‘ bilan 27 qatlamli qarsildoq kruassan.", price: 12000, unit: "dona", image: "assets/img/kruassan.webp", badge: "Xit" },
  { id: "shokoladli-bulochka", category: "shirinlik", name: "Shokoladli bulochka", desc: "Ichida qora shokolad, ustida yaltiroq qobiq.", price: 13000, unit: "dona", image: "assets/img/shokoladli-bulochka.webp" },
  { id: "pechenye", category: "shirinlik", name: "Shokoladli pechenye", desc: "Cheti qarsildoq, o‘rtasi yumshoq — 4 donalik qadoq.", price: 18000, unit: "qadoq", image: "assets/img/pechenye.webp" },
  { id: "brauni", category: "shirinlik", name: "Brauni", desc: "Belgiya shokoladidan namli va to‘yimli brauni.", price: 15000, unit: "bo‘lak", image: "assets/img/brauni.webp" },
  { id: "kapkeyk", category: "shirinlik", name: "Qulupnayli kapkeyk", desc: "Yengil biskvit, qaymoqli krem va yangi qulupnay.", price: 16000, unit: "dona", image: "assets/img/kapkeyk.webp" },
  { id: "panna-kotta", category: "shirinlik", name: "Panna-kotta", desc: "Qaymoqli desert, ustida qulupnay sousi.", price: 19000, unit: "stakan", image: "assets/img/panna-kotta.webp" },

  // ——— Tortlar ———
  { id: "mevali-tort", category: "tort", name: "Rezavorli tort", desc: "Ikki qavatli, oq krem va yangi rezavorlar bilan bezatilgan.", price: 280000, unit: "butun (2 kg)", image: "assets/img/mevali-tort.webp", badge: "Bayram uchun" },
  { id: "shokoladli-tort", category: "tort", name: "Shokoladli tort", desc: "Uch qatlam shokolad biskvit va ganash.", price: 240000, unit: "butun (1,8 kg)", image: "assets/img/shokoladli-tort.webp" },
  { id: "tiramisu", category: "tort", name: "Tiramisu", desc: "Qahva shimdirilgan biskvit va maskarpone kremi.", price: 35000, unit: "bo‘lak", image: "assets/img/tiramisu.webp" },
  { id: "malinali-tort", category: "tort", name: "Malinali tort", desc: "Vanilli biskvit, malina murabbosi va qaymoq.", price: 32000, unit: "bo‘lak", image: "assets/img/malinali-tort.webp" },
  { id: "maymunjonli-tort", category: "tort", name: "Maymunjonli tort", desc: "Pishloqli krem va maymunjon — yengil va nafis.", price: 260000, unit: "butun (1,5 kg)", image: "assets/img/maymunjonli-tort.webp" },
  { id: "limonli-tart", category: "tort", name: "Limonli tart", desc: "Qumli xamir, limon kremi va kuydirilgan bezé.", price: 190000, unit: "butun (1,2 kg)", image: "assets/img/limonli-tart.webp" },
];

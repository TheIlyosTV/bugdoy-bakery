/* Bug‘doy — sahifa logikasi: menyu, savat (localStorage), buyurtma matni. */
(() => {
  "use strict";

  const STORAGE_KEY = "bugdoy-cart-v1";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  const money = (n) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " " + CONFIG.currency;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Sozlamalarni sahifaga qo‘yish ---------- */
  const tgUrl = `https://t.me/${CONFIG.telegram}`;
  $$("[data-phone]").forEach((a) => { a.href = `tel:${CONFIG.phoneLink}`; a.textContent = CONFIG.phone; });
  $$("[data-telegram]").forEach((a) => { a.href = tgUrl; a.textContent = `Telegram: @${CONFIG.telegram}`; });
  $$("[data-instagram]").forEach((a) => { a.href = `https://instagram.com/${CONFIG.instagram}`; a.textContent = `Instagram: @${CONFIG.instagram}`; });
  $$("[data-address]").forEach((el) => { el.textContent = CONFIG.address; });
  $$("[data-map]").forEach((a) => { a.href = CONFIG.mapUrl; });
  $$("[data-hours]").forEach((dl) => {
    dl.innerHTML = CONFIG.hours.map(([d, t]) => `<div><dt>${esc(d)}</dt><dd>${esc(t)}</dd></div>`).join("");
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Savat holati ---------- */
  let cart = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      // faqat hali menyuda bor mahsulotlarni qoldiramiz
      return Object.fromEntries(Object.entries(raw).filter(([id, q]) => byId[id] && q > 0).map(([id, q]) => [id, Math.min(99, Math.floor(q))]));
    } catch { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* xususiy rejim — savat faqat shu sessiyada */ }
  }
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const total = () => Object.entries(cart).reduce((s, [id, q]) => s + byId[id].price * q, 0);

  function setQty(id, q) {
    if (q <= 0) delete cart[id];
    else cart[id] = Math.min(99, q);
    save();
    renderCart();
  }

  /* ---------- Menyu ---------- */
  const tabs = $("#tabs");
  const grid = $("#products");
  let activeCat = "all";

  tabs.innerHTML = [{ id: "all", name: "Hammasi" }, ...CATEGORIES]
    .map((c) => `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === activeCat}">${esc(c.name)}</button>`)
    .join("");

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    $$(".tab", tabs).forEach((t) => t.setAttribute("aria-selected", t === btn));
    renderProducts();
  });

  function renderProducts() {
    const list = PRODUCTS.filter((p) => activeCat === "all" || p.category === activeCat);
    grid.innerHTML = list.map((p, i) => `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 40}ms">
        <div class="card__img">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" decoding="async" width="640" height="480">
          ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        </div>
        <div class="card__body">
          <h3>${esc(p.name)}</h3>
          <p class="card__desc">${esc(p.desc)}</p>
          <div class="card__foot">
            <div class="price">${money(p.price)}<small>${esc(p.unit)}</small></div>
            <button class="btn btn--primary add-btn" data-add="${esc(p.id)}">Savatga qo‘shish</button>
          </div>
        </div>
      </article>`).join("");
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.dataset.add;
    setQty(id, (cart[id] || 0) + 1);
    btn.classList.add("is-added");
    btn.textContent = "✓ Qo‘shildi";
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.classList.remove("is-added"); btn.textContent = "Savatga qo‘shish"; }, 1200);
    $$("[data-cart-count]").forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    toast(`${byId[id].name} savatga qo‘shildi`);
  });

  /* ---------- Savat ko‘rinishi ---------- */
  const list = $("#cartList");

  function renderCart() {
    const n = count();
    $$("[data-cart-count]").forEach((el) => { el.textContent = n; if (el.classList.contains("cart-count")) el.hidden = n === 0; });
    $$("[data-cart-total]").forEach((el) => { el.textContent = money(total()); });
    $(".cart-bar").hidden = n === 0;
    document.body.classList.toggle("has-cart", n > 0);

    const items = Object.entries(cart);
    $("#cartEmpty").hidden = items.length > 0;
    $("#toForm").disabled = items.length === 0;
    list.innerHTML = items.map(([id, q]) => {
      const p = byId[id];
      return `
        <li class="cart-item">
          <img src="${esc(p.image)}" alt="" width="72" height="72" loading="lazy">
          <div>
            <div class="cart-item__name">${esc(p.name)}</div>
            <div class="cart-item__price">${money(p.price)} / ${esc(p.unit)}</div>
            <div class="qty">
              <button data-dec="${esc(id)}" aria-label="${esc(p.name)}: kamaytirish">−</button>
              <output aria-live="polite">${q}</output>
              <button data-inc="${esc(id)}" aria-label="${esc(p.name)}: ko‘paytirish">+</button>
            </div>
          </div>
          <div class="cart-item__right">
            <span class="cart-item__sum">${money(p.price * q)}</span>
            <button class="remove" data-remove="${esc(id)}">O‘chirish</button>
          </div>
        </li>`;
    }).join("");

    // savat bo‘shab qolsa, 1-qadamga qaytamiz
    if (items.length === 0 && step !== "cart" && step !== "done") goStep("cart");
  }

  list.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.inc) setQty(t.dataset.inc, cart[t.dataset.inc] + 1);
    if (t.dataset.dec) setQty(t.dataset.dec, cart[t.dataset.dec] - 1);
    if (t.dataset.remove) { const name = byId[t.dataset.remove].name; setQty(t.dataset.remove, 0); toast(`${name} o‘chirildi`); }
  });

  /* ---------- Drawer ochish/yopish ---------- */
  const drawer = $("#cart");
  const overlay = $("#overlay");
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add("is-open"); drawer.classList.add("is-open"); });
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    closeNav();
    setTimeout(() => drawer.focus(), 50);
  }
  function closeCart() {
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");
    setTimeout(() => { overlay.hidden = true; }, 300);
    if (step === "done") goStep("cart");
    lastFocus?.focus?.();
  }

  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
  overlay.addEventListener("click", closeCart);
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeCart(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });

  /* ---------- Buyurtma qadamlari ---------- */
  let step = "cart";
  const steps = {
    cart: { body: "#stepCart", act: "#actCart", title: "Savat" },
    form: { body: "#stepForm", act: "#actForm", title: "Ma’lumotlaringiz" },
    done: { body: "#stepDone", act: "#actDone", title: "Buyurtma tayyor" },
  };
  function goStep(s) {
    step = s;
    Object.entries(steps).forEach(([k, v]) => { $(v.body).hidden = k !== s; $(v.act).hidden = k !== s; });
    $("#drawerTitle").textContent = steps[s].title;
  }

  $("#toForm").addEventListener("click", () => { if (count()) goStep("form"); });
  $("#backToCart").addEventListener("click", () => goStep("cart"));

  const form = $("#stepForm");
  const addrField = $("[data-address-field]");
  form.addEventListener("change", () => { addrField.hidden = form.method.value !== "Yetkazib berish"; });

  // Saqlangan ism/telefonni qayta to‘ldirish
  try {
    const me = JSON.parse(localStorage.getItem("bugdoy-me") || "{}");
    if (me.name) form.name.value = me.name;
    if (me.phone) form.phone.value = me.phone;
  } catch { /* yo‘q bo‘lsa — bo‘sh */ }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#formError");
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const delivery = form.method.value === "Yetkazib berish";
    const address = form.address.value.trim();
    const bad = [];
    if (name.length < 2) bad.push(form.name);
    if (phone.replace(/\D/g, "").length < 9) bad.push(form.phone);
    if (delivery && address.length < 5) bad.push(form.address);
    [form.name, form.phone, form.address].forEach((el) => el.setAttribute("aria-invalid", bad.includes(el)));
    if (bad.length) {
      err.textContent = "Iltimos, belgilangan maydonlarni to‘ldiring.";
      err.hidden = false;
      bad[0].focus();
      return;
    }
    err.hidden = true;
    try { localStorage.setItem("bugdoy-me", JSON.stringify({ name, phone })); } catch { /* ahamiyatsiz */ }

    $("#orderText").value = buildOrder({ name, phone, delivery, address, note: form.note.value.trim(), method: form.method.value });
    $("#tgBtn").href = tgUrl;
    goStep("done");
  });

  function buildOrder(f) {
    const lines = Object.entries(cart).map(([id, q], i) => {
      const p = byId[id];
      return `${i + 1}. ${p.name} — ${q} × ${money(p.price)} = ${money(p.price * q)}`;
    });
    return [
      `🧺 Yangi buyurtma — ${CONFIG.name}`,
      "",
      ...lines,
      "",
      `Jami: ${money(total())}`,
      "",
      `Ism: ${f.name}`,
      `Telefon: ${f.phone}`,
      `Usul: ${f.method}`,
      f.delivery ? `Manzil: ${f.address}` : null,
      f.note ? `Izoh: ${f.note}` : null,
    ].filter((l) => l !== null).join("\n");
  }

  async function copyOrder() {
    const ta = $("#orderText");
    try {
      await navigator.clipboard.writeText(ta.value);
    } catch {
      ta.select();
      document.execCommand("copy");
    }
    $("#copyBtn").textContent = "✓ Nusxalandi";
    toast("Matn nusxalandi — endi Telegramda joylang");
    setTimeout(() => { $("#copyBtn").textContent = "Matnni nusxalash"; }, 2000);
  }
  $("#copyBtn").addEventListener("click", copyOrder);
  // Telegramga o‘tishdan oldin matnni avtomatik nusxalaymiz
  $("#tgBtn").addEventListener("click", () => { copyOrder(); });
  $("#clearAfter").addEventListener("click", () => {
    cart = {};
    save();
    renderCart();
    form.note.value = "";
    closeCart();
    toast("Savat tozalandi. Rahmat!");
  });

  /* ---------- Mobil menyu ---------- */
  const burger = $("#burger");
  const nav = $("#nav");
  function closeNav() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeNav(); });

  /* ---------- Header soyasi va scroll animatsiyalari ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Bildirishnoma ---------- */
  const toastEl = $("#toast");
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  }

  // Boshqa tabda savat o‘zgarsa — sinxronlash
  window.addEventListener("storage", (e) => { if (e.key === STORAGE_KEY) { cart = load(); renderCart(); } });

  renderProducts();
  renderCart();
})();

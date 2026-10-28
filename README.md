# Raqamli to‘y taklifnomasi + Zarhal Studio

- `/` — to‘y taklifnomasi (hero, kelin-kuyov, countdown, tafsilotlar, dastur, galereya, musiqa, to‘yxona, RSVP, ulashish)
- `/studio` — kreativ studiya sahifasi (xizmatlar, portfolio, narxlar, jarayon, FAQ, buyurtma formasi)

## Ishga tushirish
```
bun install
bun run dev      # ishlab chiqish
bun run build    # production build
bunx vitest run  # testlar
```

## Sozlash
Hamma ma’lumot `src/config/site.ts` faylida:
- `wedding` — ismlar, sana (`date` ISO formatda), manzil, `mapsUrl`, dastur, galereya suratlari.
- `wedding.musicSrc` — audio fayl (masalan, `public/music.mp3` → `"/music.mp3"`). Bo‘sh bo‘lsa yumshoq ambient ohang brauzerda yaratiladi.
- `wedding.rsvpEndpoint`, `studio.orderEndpoint` — forma endpointi (masalan Formspree). Bo‘sh bo‘lsa formalar **demo rejimda** ishlaydi va saqlanmaganini ochiq aytadi.
- `studio` — Telegram/Instagram havolalari, xizmatlar, narxlar, FAQ. Fikrlar real bo‘lmasa `demo: true` qoldiring.

Suratlarni `src/assets/` ga qo‘yib, configda import qiling.

## Joylash
Lovable’da **Publish** tugmasi orqali.

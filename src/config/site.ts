/**
 * Markaziy sozlamalar. Barcha matn, sana, manzil, havola va narxlarni shu yerda tahrirlang.
 */
import hero from "@/assets/hero.jpg";
import couple from "@/assets/couple.jpg";
import venue from "@/assets/venue.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const wedding = {
  heading: "Nikoh to‘yi taklifnomasi",
  eyebrow: "Biz turmush quramiz",
  groom: "Jasur",
  bride: "Madina",
  /** ISO format, mahalliy vaqt zonasi bilan */
  date: "2026-12-19T17:00:00+05:00",
  dateLabel: "19 dekabr 2026",
  timeLabel: "17:00",
  timezone: "Toshkent vaqti (UTC+5)",
  venue: {
    name: "Navro‘z Saroyi",
    address: "Amir Temur ko‘chasi, 108, Yunusobod tumani, Toshkent",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Amir+Temur+108+Tashkent",
    arrival:
      "Mehmonlar uchun bepul avtoturargoh saroy ortida joylashgan. Metro: «Bodomzor» bekatidan 5 daqiqa piyoda.",
    image: venue,
  },
  dressCode: "Klassik kechki libos — iliq pastel va oltin ranglar mamnuniyat bilan",
  notes: "Iltimos, kelishingizni 10 dekabrgacha tasdiqlang. Gul o‘rniga yaxshi tilaklaringiz kifoya.",
  message:
    "Hayotimizning eng baxtli kunida siz bilan birga bo‘lishni istaymiz. Muhabbatimiz guvohi bo‘lib, duolaringiz bilan bu kunni yanada nurli qiling.",
  heroImage: hero,
  portrait: couple,
  schedule: [
    { time: "17:00", title: "Mehmonlarni kutib olish", desc: "Iliq choy, shirinliklar va jonli musiqa", icon: "users" },
    { time: "18:00", title: "Nikoh marosimi", desc: "Oila va yaqinlar davrasida tantanali lahza", icon: "rings" },
    { time: "18:45", title: "Fotosessiya", desc: "Yaqinlar bilan xotira suratlari", icon: "camera" },
    { time: "19:30", title: "Bayram dasturxoni", desc: "Milliy taomlar va kechki ziyofat", icon: "utensils" },
    { time: "21:00", title: "Bayram kechasi", desc: "Raqs, qo‘shiq va quvonch", icon: "music" },
  ],
  gallery: [
    { src: g2, alt: "Kelin-kuyov Samarqand ravog‘i ostida quyosh botishida", w: 1280, h: 832 },
    { src: g3, alt: "Kelinning qo‘lidagi pushti va oq gulchambar", w: 832, h: 1216 },
    { src: g1, alt: "Ipak mato ustidagi oltin uzuklar va atirgul yaproqlari", w: 1024, h: 1024 },
    { src: g4, alt: "Bayram dasturxonidagi milliy palov", w: 1024, h: 1280 },
    { src: couple, alt: "Kelin va kuyovning portreti", w: 896, h: 1200 },
    { src: hero, alt: "Kelin-kuyov naqshinkor saroy hovlisida", w: 1088, h: 1600 },
  ],
  /** Audio fayl manzili (masalan "/music.mp3"). Bo‘sh bo‘lsa, brauzerda yumshoq ambient ohang yaratiladi. */
  musicSrc: "",
  /** RSVP uchun forma endpoint (masalan Formspree). Bo‘sh bo‘lsa — demo rejim. */
  rsvpEndpoint: "",
};

export const studio = {
  name: "Zarhal Studio",
  telegram: "https://t.me/zarhal_studio",
  instagram: "https://instagram.com/zarhal.studio",
  /** Buyurtma formasi endpointi. Bo‘sh bo‘lsa — demo rejim. */
  orderEndpoint: "",
  services: [
    { title: "Raqamli taklifnomalar", desc: "Musiqa, xarita va RSVP bilan interaktiv sayt-taklifnoma." },
    { title: "Video taklifnomalar", desc: "Kinematografik 30–60 soniyali to‘y video-taklifnomasi." },
    { title: "Restoran va mahsulot reklamasi", desc: "Taom va mahsulotlar uchun premium vizual kontent." },
    { title: "Brend reelslar", desc: "Instagram va TikTok uchun qisqa, ta’sirli videolar." },
    { title: "Maxsus veb-saytlar", desc: "Brendingizga moslab yaratilgan tezkor va chiroyli saytlar." },
  ],
  portfolio: [
    { title: "Jasur & Madina", category: "Taklifnoma", image: hero, desc: "Interaktiv to‘y sayti: countdown, galereya, RSVP." },
    { title: "Oltin Dasturxon", category: "Restoran", image: g4, desc: "Milliy restoran uchun taom fotosuratlari va reels." },
    { title: "Samarqand oqshomi", category: "Video", image: g2, desc: "Quyosh botishidagi kinematografik video-taklifnoma." },
    { title: "Ipak & Oltin", category: "Brend", image: g1, desc: "Zargarlik brendi uchun mahsulot kampaniyasi." },
    { title: "Bahor guldastasi", category: "Taklifnoma", image: g3, desc: "Pastel uslubdagi minimal raqamli taklifnoma." },
    { title: "Navro‘z Saroyi", category: "Sayt", image: venue, desc: "To‘yxona uchun bron qilish imkoniyatli sayt." },
  ],
  pricing: [
    { name: "Classic", price: "490 000", unit: "so‘m", features: ["Raqamli taklifnoma", "Countdown va xarita", "3 kunda tayyor"] },
    { name: "Premium", price: "990 000", unit: "so‘m", featured: true, features: ["Galereya va musiqa", "RSVP formasi", "Shaxsiy dizayn", "2 marta tuzatish"] },
    { name: "Cinematic", price: "2 400 000", unit: "so‘m", features: ["Premium sayt", "Video taklifnoma", "Brend reels", "Ustuvor yordam"] },
  ],
  process: [
    { title: "Brif", desc: "G‘oya, sana va uslubni birga aniqlaymiz." },
    { title: "Konsepsiya", desc: "Moodboard, ranglar va kompozitsiya." },
    { title: "Ishlab chiqarish", desc: "Dizayn, animatsiya va montaj." },
    { title: "Topshirish", desc: "Tayyor havola yoki video — ulashishga tayyor." },
  ],
  testimonials: [
    { name: "Namuna mijoz", text: "Taklifnoma mehmonlarimizni hayratda qoldirdi — hamma ulashib yubordi.", demo: true },
    { name: "Namuna restoran", text: "Reelslardan keyin bron qilishlar sezilarli oshdi.", demo: true },
  ],
  faq: [
    { q: "Taklifnoma qancha vaqtda tayyor bo‘ladi?", a: "Classic paket — 3 kun, Premium — 5 kun, Cinematic — 10 kungacha." },
    { q: "Matn va suratlarni keyin o‘zgartirsa bo‘ladimi?", a: "Ha, paketga kiritilgan tuzatishlar doirasida bepul o‘zgartiramiz." },
    { q: "To‘lov qanday amalga oshiriladi?", a: "50% oldindan, qolgani topshirishda. Click, Payme yoki naqd." },
    { q: "Rus yoki ingliz tilida ham qilasizmi?", a: "Albatta — bir nechta tilli taklifnoma ham mumkin." },
  ],
};

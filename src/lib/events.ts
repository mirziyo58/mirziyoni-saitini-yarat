import hero from "@/assets/hero.jpg";
import couple from "@/assets/couple.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import sunnat1 from "@/assets/sunnat1.jpg";
import sunnat2 from "@/assets/sunnat2.jpg";
import beshik1 from "@/assets/beshik1.jpg";
import fotiha1 from "@/assets/fotiha1.jpg";
import birthday1 from "@/assets/birthday1.jpg";
import birthday2 from "@/assets/birthday2.jpg";
import yubiley1 from "@/assets/yubiley1.jpg";

export type Photo = { src: string; alt: string };
export type ScheduleItem = { time: string; title: string; desc: string; icon: string };

export type EventDef = {
  slug: string;
  name: string;
  heading: string;
  defaultMessage: string;
  /** true = two names (kuyov & kelin), false = one celebrant */
  couple: boolean;
  nameLabel: string;
  namePlaceholder: string;
  eyebrow: string;
  photos: Photo[];
  schedule: ScheduleItem[];
};

const feast: ScheduleItem[] = [
  { time: "", title: "Mehmonlarni kutib olish", desc: "Iliq choy va shirinliklar", icon: "users" },
  { time: "", title: "Bayram dasturxoni", desc: "Milliy taomlar va ziyofat", icon: "utensils" },
  { time: "", title: "Bayram kechasi", desc: "Musiqa, raqs va quvonch", icon: "music" },
];

export const builtInEvents: EventDef[] = [
  {
    slug: "nikoh", name: "Nikoh to‘yi", heading: "Nikoh to‘yi taklifnomasi", couple: true,
    nameLabel: "Kuyov ismi", namePlaceholder: "Jasur", eyebrow: "Biz turmush quramiz",
    defaultMessage: "Hayotimizning eng baxtli kunida siz bilan birga bo‘lishni istaymiz.",
    photos: [
      { src: hero, alt: "Kelin-kuyov saroy hovlisida" },
      { src: g2, alt: "Kelin-kuyov Samarqand ravog‘i ostida" },
      { src: g3, alt: "Kelin guldastasi" },
      { src: g1, alt: "Oltin uzuklar" },
      { src: couple, alt: "Kelin va kuyov portreti" },
      { src: g4, alt: "Bayram dasturxoni" },
    ],
    schedule: [
      { time: "", title: "Mehmonlarni kutib olish", desc: "Iliq choy, shirinliklar va jonli musiqa", icon: "users" },
      { time: "", title: "Nikoh marosimi", desc: "Oila va yaqinlar davrasida", icon: "rings" },
      { time: "", title: "Bayram dasturxoni", desc: "Milliy taomlar va kechki ziyofat", icon: "utensils" },
      { time: "", title: "Bayram kechasi", desc: "Raqs, qo‘shiq va quvonch", icon: "music" },
    ],
  },
  {
    slug: "fotiha", name: "Fotiha to‘yi", heading: "Fotiha to‘yi taklifnomasi", couple: true,
    nameLabel: "Kuyov ismi", namePlaceholder: "Jasur", eyebrow: "Fotiha to‘yimizga marhamat",
    defaultMessage: "Farzandlarimizning fotiha to‘yiga sizni taklif qilamiz.",
    photos: [
      { src: fotiha1, alt: "Non, shirinliklar va uzuk qutisi" },
      { src: g1, alt: "Oltin uzuklar" },
      { src: g3, alt: "Guldasta" },
    ],
    schedule: feast,
  },
  {
    slug: "sunnat", name: "Sunnat to‘yi", heading: "Sunnat to‘yi taklifnomasi", couple: false,
    nameLabel: "O‘g‘il ismi", namePlaceholder: "Abdulloh", eyebrow: "O‘g‘limizning to‘yi",
    defaultMessage: "O‘g‘limizning sunnat to‘yi munosabati bilan dasturxonimizga marhamat qiling.",
    photos: [
      { src: sunnat1, alt: "To‘n va do‘ppidagi bola otda" },
      { src: sunnat2, alt: "Palov va non bilan bayram dasturxoni" },
      { src: g4, alt: "Milliy palov" },
    ],
    schedule: feast,
  },
  {
    slug: "beshik", name: "Beshik to‘yi", heading: "Beshik to‘yi taklifnomasi", couple: false,
    nameLabel: "Chaqaloq ismi", namePlaceholder: "Oysha", eyebrow: "Farzandimiz beshik to‘yi",
    defaultMessage: "Farzandimizning beshik to‘yida siz bilan birga bo‘lishni istaymiz.",
    photos: [
      { src: beshik1, alt: "Naqshinkor beshik va atlas" },
      { src: sunnat2, alt: "Bayram dasturxoni" },
      { src: g3, alt: "Gullar" },
    ],
    schedule: feast,
  },
  {
    slug: "tugilgan", name: "Tug‘ilgan kun", heading: "Tug‘ilgan kun taklifnomasi", couple: false,
    nameLabel: "Bayram egasi", namePlaceholder: "Madina", eyebrow: "Tug‘ilgan kunimga marhamat",
    defaultMessage: "Tug‘ilgan kunimni siz bilan birga nishonlashni istayman.",
    photos: [
      { src: birthday1, alt: "Shamli tort va sharlar" },
      { src: birthday2, alt: "Sovg‘alar va gullar" },
    ],
    schedule: feast,
  },
  {
    slug: "yubiley", name: "Yubiley", heading: "Yubiley taklifnomasi", couple: false,
    nameLabel: "Yubilyar ismi", namePlaceholder: "Karim aka", eyebrow: "Yubiley tantanasi",
    defaultMessage: "Yubiley tantanamizga sizni samimiy taklif qilamiz.",
    photos: [
      { src: yubiley1, alt: "Bezatilgan ziyofat zali" },
      { src: g4, alt: "Bayram dasturxoni" },
      { src: birthday1, alt: "Bayram torti" },
    ],
    schedule: feast,
  },
];

export type EventRow = {
  slug: string; name: string; heading: string; default_message: string;
  extra_images: string[]; active: boolean; sort: number;
};

/** Merge admin-edited rows (from Cloud) over built-in definitions. */
export function mergeEvents(rows: EventRow[] | null | undefined): EventDef[] {
  if (!rows?.length) return builtInEvents;
  const out: EventDef[] = [];
  for (const r of [...rows].sort((a, b) => a.sort - b.sort)) {
    if (!r.active) continue;
    const base = builtInEvents.find((e) => e.slug === r.slug) ?? {
      ...builtInEvents[builtInEvents.length - 1]!, slug: r.slug, photos: [],
    };
    out.push({
      ...base,
      name: r.name || base.name,
      heading: r.heading || base.heading,
      defaultMessage: r.default_message || base.defaultMessage,
      photos: [...r.extra_images.filter(Boolean).map((src) => ({ src, alt: r.name })), ...base.photos],
    });
  }
  return out.length ? out : builtInEvents;
}

export function findEvent(slug: string | undefined, list: EventDef[] = builtInEvents): EventDef {
  return list.find((e) => e.slug === slug) ?? builtInEvents.find((e) => e.slug === slug) ?? builtInEvents[0]!;
}

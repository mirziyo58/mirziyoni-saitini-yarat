import { wedding } from "@/config/site";
import type { WeddingData } from "@/components/wedding/Invitation";
import { findEvent, type EventDef } from "@/lib/events";

/** Data a visitor enters in the builder. Stored in the link itself (no server). */
export type InviteInput = {
  /** event type slug, e.g. "nikoh", "sunnat". Missing = nikoh (old links). */
  type?: string;
  groom: string;
  bride: string;
  date: string; // "YYYY-MM-DDTHH:mm" Tashkent time
  venueName: string;
  address: string;
  dressCode: string;
  notes: string;
  message: string;
  photo: number;
  /** chosen photo URL (set by builder); falls back to photo index */
  photoUrl?: string;
};

export const photoChoices = wedding.gallery;

const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

export function encodeInvite(i: InviteInput): string {
  const bytes = new TextEncoder().encode(JSON.stringify(i));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeInvite(s: string): InviteInput | null {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const o = JSON.parse(new TextDecoder().decode(bytes));
    if (!o || typeof o.groom !== "string" || typeof o.bride !== "string") return null;
    return o as InviteInput;
  } catch {
    return null;
  }
}

export function toWeddingData(i: InviteInput, events?: EventDef[]): WeddingData {
  const ev = findEvent(i.type ?? "nikoh", events);
  const [d = "", t = ""] = i.date.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const dateLabel = y && m && day ? `${day} ${months[m - 1]} ${y}` : "Sana belgilanmagan";
  const photos = ev.photos.length ? ev.photos : photoChoices;
  const hero = i.photoUrl || (photos[i.photo] ?? photos[0]!).src;
  const q = encodeURIComponent(i.address || i.venueName);
  const isWedding = ev.slug === "nikoh";
  return {
    ...wedding,
    heading: ev.heading,
    eyebrow: ev.eyebrow,
    groom: i.groom || (ev.couple ? "Kuyov" : "Bayram egasi"),
    bride: ev.couple ? i.bride || "Kelin" : "",
    date: i.date ? `${i.date}:00+05:00` : "",
    dateLabel,
    timeLabel: t || "—",
    venue: {
      ...wedding.venue,
      name: i.venueName || "Bayram joyi",
      address: i.address,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
    },
    dressCode: i.dressCode || (isWedding ? wedding.dressCode : "Bayramona libos"),
    notes: i.notes || (isWedding ? wedding.notes : "Kelishingizni oldindan tasdiqlang."),
    message: i.message || ev.defaultMessage,
    heroImage: hero,
    portrait: photos[1]?.src ?? hero,
    schedule: ev.schedule,
    gallery: isWedding ? wedding.gallery : photos.map((p) => ({ ...p, w: 832, h: 1216 })),
  };
}

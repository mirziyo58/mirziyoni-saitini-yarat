import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import { encodeInvite, type InviteInput } from "@/lib/invite-link";
import { findEvent } from "@/lib/events";
import { useEvents } from "@/lib/use-events";
import { fieldCls } from "@/components/wedding/Rsvp";
import { Ornament } from "@/components/site/Reveal";

export const Route = createFileRoute("/yaratish")({
  head: () => ({
    meta: [
      { title: "Taklifnoma yaratish — to‘y va marosimlar uchun" },
      { name: "description", content: "Nikoh, sunnat, beshik to‘yi, tug‘ilgan kun va yubiley uchun raqamli taklifnoma yarating." },
      { property: "og:title", content: "O‘z to‘y taklifnomangizni yarating" },
      { property: "og:description", content: "Bir necha daqiqada nafis raqamli taklifnoma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Builder,
});

const empty: InviteInput = {
  type: "nikoh", photoUrl: "", groom: "", bride: "", date: "", venueName: "", address: "", dressCode: "", notes: "", message: "", photo: 0,
};
const KEY = "invite-draft";

function Builder() {
  const [f, setF] = useState<InviteInput>(empty);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const { events } = useEvents();
  const ev = findEvent(f.type, events);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setF({ ...empty, ...JSON.parse(s) });
    } catch { /* ignore */ }
  }, []);

  const set = <K extends keyof InviteInput>(k: K, v: InviteInput[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    setLink("");
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const create = () => {
    if (f.groom.trim().length < 2 || (ev.couple && f.bride.trim().length < 2))
      return setError(ev.couple ? "Kuyov va kelin ismlarini kiriting" : `${ev.nameLabel}ni kiriting`);
    if (!f.date) return setError("Sana va vaqtni tanlang");
    if (!f.venueName.trim()) return setError("Bayram joyi nomini kiriting");
    setError("");
    const out = { ...f, bride: ev.couple ? f.bride : "", photoUrl: f.photoUrl || ev.photos[0]?.src || "" };
    setLink(`${window.location.origin}/t?d=${encodeInvite(out)}`);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); toast.success("Havola nusxalandi"); }
    catch { toast.error("Nusxalab bo‘lmadi"); }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: ev.couple ? `${f.groom} & ${f.bride}` : f.groom, text: ev.heading, url: link }); } catch { /* cancelled */ }
    } else copy();
  };

  const input = (k: keyof InviteInput, label: string, props: Record<string, unknown> = {}) => (
    <div>
      <label htmlFor={k} className="eyebrow">{label}</label>
      <input id={k} value={String(f[k])} onChange={(e) => set(k, e.target.value as never)} className={fieldCls} {...props} />
    </div>
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link to="/" className="eyebrow">← Namuna</Link>
      <h1 className="section-title mt-6 text-center">Taklifnoma yaratish</h1>
      <p className="mt-4 text-center text-muted-foreground">Ma’lumotlarni kiriting — tayyor havolani mehmonlarga yuboring.</p>
      <Ornament className="my-10" />

      <div className="space-y-7">
        <fieldset>
          <legend className="eyebrow">Marosim turi *</legend>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {events.map((e) => {
              const on = ev.slug === e.slug;
              return (
                <button key={e.slug} type="button" aria-pressed={on}
                  onClick={() => { const next = { ...f, type: e.slug, photo: 0, photoUrl: e.photos[0]?.src ?? "" }; setF(next); setLink(""); localStorage.setItem(KEY, JSON.stringify(next)); }}
                  className={`group relative aspect-[4/5] overflow-hidden border-2 text-left transition ${on ? "border-gold" : "border-transparent opacity-80 hover:opacity-100"}`}>
                  {e.photos[0] && <img src={e.photos[0].src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                  <span className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-3 font-serif text-lg text-ivory">{e.name}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="grid gap-7 sm:grid-cols-2">
          {input("groom", `${ev.nameLabel} *`, { placeholder: ev.namePlaceholder })}
          {ev.couple && input("bride", "Kelin ismi *", { placeholder: "Madina" })}
        </div>
        {input("date", "Sana va vaqt *", { type: "datetime-local" })}
        <div className="grid gap-7 sm:grid-cols-2">
          {input("venueName", "Bayram joyi *", { placeholder: "Navro‘z Saroyi" })}
          {input("address", "Manzil", { placeholder: "Ko‘cha, uy, shahar" })}
        </div>
        {input("dressCode", "Kiyinish uslubi", { placeholder: "Klassik kechki libos" })}
        {input("notes", "Eslatma", { placeholder: "Kelishingizni oldindan tasdiqlang" })}
        <div>
          <label htmlFor="message" className="eyebrow">Mehmonlarga xabar</label>
          <textarea id="message" rows={3} value={f.message} onChange={(e) => set("message", e.target.value)} className={fieldCls} placeholder={ev.defaultMessage} />
        </div>
        <fieldset>
          <legend className="eyebrow">Asosiy surat</legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ev.photos.map((p, i) => {
              const on = (f.photoUrl || ev.photos[0]?.src) === p.src;
              return (
              <button key={p.src + i} type="button" onClick={() => { const next = { ...f, photo: i, photoUrl: p.src }; setF(next); setLink(""); localStorage.setItem(KEY, JSON.stringify(next)); }} aria-pressed={on} aria-label={p.alt}
                className={`aspect-[3/4] overflow-hidden border-2 transition ${on ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={p.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
              );
            })}
          </div>
        </fieldset>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button type="button" onClick={create} className="w-full bg-primary py-4 eyebrow !text-primary-foreground hover:opacity-90">
          Taklifnomani yaratish
        </button>

        {link && (
          <div role="status" className="border border-gold p-6 text-center animate-fade-up">
            <p className="font-serif text-2xl">Taklifnomangiz tayyor!</p>
            <p className="mt-3 break-all text-xs text-muted-foreground">{link}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-primary py-3 eyebrow !text-primary"><ExternalLink className="h-4 w-4" />Ochish</a>
              <button onClick={copy} className="flex items-center justify-center gap-2 border border-primary py-3 eyebrow !text-primary"><Copy className="h-4 w-4" />Nusxalash</button>
              <button onClick={share} className="flex items-center justify-center gap-2 bg-primary py-3 eyebrow !text-primary-foreground"><Share2 className="h-4 w-4" />Ulashish</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

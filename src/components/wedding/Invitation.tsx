import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, Gem, MapPin, Music, Share2, Users, UtensilsCrossed } from "lucide-react";
import { wedding } from "@/config/site";
import { Reveal, Ornament } from "@/components/site/Reveal";
import { Gallery } from "@/components/wedding/Gallery";
import { MusicControl } from "@/components/wedding/Music";
import { Rsvp } from "@/components/wedding/Rsvp";
import { getRemaining, type Remaining } from "@/lib/countdown";
import { shareLink } from "@/lib/share";

const icons = { users: Users, rings: Gem, camera: Camera, utensils: UtensilsCrossed, music: Music } as const;

export type WeddingData = typeof wedding;

export function Invitation({ data = wedding, showCreate = true }: { data?: WeddingData; showCreate?: boolean }) {
  const names = data.bride ? `${data.groom} & ${data.bride}` : data.groom;
  const title = `${names} — ${data.heading}`;
  const description = `${data.dateLabel}, ${data.venue.name}`;
  const [opened, setOpened] = useState(false);
  const [musicSignal, setMusicSignal] = useState(0);

  const open = () => {
    setOpened(true);
    setMusicSignal((n) => n + 1);
    setTimeout(() => document.getElementById("couple")?.scrollIntoView({ behavior: "smooth" }), 900);
  };

  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
        <img
          src={data.heroImage}
          alt={names}
          width={1088}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-overlay" />
        <div
          className={`relative w-full max-w-md text-center text-ivory transition-all duration-1000 ${opened ? "scale-95 opacity-90" : ""}`}
        >
          <div className="glass relative px-6 py-12 sm:px-10">
            <span className="pointer-events-none absolute inset-2 border border-gold/40" />
            <p className="eyebrow animate-fade-up">{data.heading}</p>
            <h1 className="display mt-6 animate-fade-up" style={{ animationDelay: ".2s" }}>
              {data.groom}
              {data.bride && <span className="block py-2 font-serif text-3xl italic text-gold">&amp;</span>}
              {data.bride}
            </h1>
            <Ornament className="mt-6 animate-fade-up [animation-delay:.5s]" />
            <p className="mt-6 font-serif text-2xl animate-fade-up" style={{ animationDelay: ".6s" }}>{data.dateLabel}</p>
            <p className="mt-1 text-sm text-ivory/80 animate-fade-up" style={{ animationDelay: ".7s" }}>{data.venue.name}</p>
            <button
              type="button"
              onClick={open}
              className="mt-9 border border-gold bg-gold/90 px-8 py-4 eyebrow !text-burgundy transition hover:bg-gold animate-fade-up"
              style={{ animationDelay: ".9s" }}
            >
              {opened ? "Taklifnoma ochildi" : "Taklifnomani ochish"}
            </button>
          </div>
        </div>
        {showCreate && <Link to="/yaratish" className="absolute right-4 top-4 border border-gold/60 px-3 py-2 eyebrow !text-ivory hover:bg-gold hover:!text-burgundy">
          + Taklifnoma yaratish
        </Link>}
        <Link to="/studio" className="absolute left-4 top-4 eyebrow !text-ivory/80 hover:!text-gold">
          Studio
        </Link>
      </section>

      {/* COUPLE */}
      <section id="couple" className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <div className="relative">
            <img src={data.portrait} alt={names} width={896} height={1200} loading="lazy" className="w-full shadow-soft" />
            <span className="pointer-events-none absolute -inset-3 border border-gold/50" />
          </div>
        </Reveal>
        <div className="text-center md:text-left">
          <Reveal><p className="eyebrow">{data.eyebrow}</p></Reveal>
          <Reveal delay={120}>
            <h2 className="section-title mt-4">
              {data.groom} {data.bride && <><em className="text-rose">va</em> {data.bride}</>}
            </h2>
          </Reveal>
          <Reveal delay={240}><Ornament className="my-8 md:justify-start" /></Reveal>
          <Reveal delay={360}>
            <p className="font-serif text-xl leading-relaxed text-muted-foreground">{data.message}</p>
          </Reveal>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="bg-primary px-6 py-24 text-center text-primary-foreground">
        <Reveal><p className="eyebrow">Bayramgacha qoldi</p></Reveal>
        <Countdown date={data.date} />
      </section>

      {/* DETAILS */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <Reveal className="text-center">
          <p className="eyebrow">Tadbir tafsilotlari</p>
          <h2 className="section-title mt-4">Muhim ma’lumotlar</h2>
        </Reveal>
        <dl className="mt-14 grid gap-px bg-border sm:grid-cols-2">
          {[
            ["Sana", data.dateLabel],
            ["Vaqt", `${data.timeLabel} · ${data.timezone}`],
            ["Joy", data.venue.name],
            ["Manzil", data.venue.address],
            ["Kiyinish uslubi", data.dressCode],
            ["Eslatma", data.notes],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={(i % 2) * 100} className="bg-background p-6">
              <dt className="eyebrow">{k}</dt>
              <dd className="mt-2 font-serif text-xl">{v}</dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-10 text-center">
          <a href={data.venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-primary px-7 py-4 eyebrow !text-primary transition hover:bg-primary hover:!text-primary-foreground">
            <MapPin className="h-4 w-4" /> Xaritada ko‘rish
          </a>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="bg-secondary px-6 py-24">
        <Reveal className="text-center">
          <p className="eyebrow">Kun tartibi</p>
          <h2 className="section-title mt-4">Bayram dasturi</h2>
        </Reveal>
        <ol className="relative mx-auto mt-14 max-w-xl border-l border-gold/50 pl-8">
          {data.schedule.map((s, i) => {
            const Icon = icons[s.icon as keyof typeof icons] ?? Gem;
            return (
              <Reveal as="li" key={s.title} delay={i * 100} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full border border-gold bg-background text-gold">
                  <Icon className="h-4 w-4" />
                </span>
                {s.time && <p className="eyebrow">{s.time}</p>}
                <h3 className="mt-1 text-2xl">{s.title}</h3>
                <p className="mt-1 text-muted-foreground">{s.desc}</p>
              </Reveal>
            );
          })}
        </ol>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Xotiralar</p>
          <h2 className="section-title mt-4">Fotogalereya</h2>
        </Reveal>
        <Gallery items={data.gallery} />
      </section>

      {/* VENUE */}
      <section className="relative overflow-hidden">
        <img src={data.venue.image} alt={data.venue.name} width={1600} height={1008} loading="lazy" className="h-[60vh] w-full object-cover md:h-[75vh]" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-12 text-ivory">
          <Reveal>
            <p className="eyebrow">Bayram joyi</p>
            <h2 className="section-title mt-3">{data.venue.name}</h2>
            <p className="mt-3 text-ivory/85">{data.venue.address}</p>
            <p className="mt-2 max-w-xl text-sm text-ivory/70">{data.venue.arrival}</p>
            <a href={data.venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 eyebrow !text-burgundy">
              <MapPin className="h-4 w-4" /> Yo‘nalishni ochish
            </a>
          </Reveal>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="mx-auto max-w-lg px-6 py-24">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Javob bering</p>
          <h2 className="section-title mt-4">Kelishingizni tasdiqlang</h2>
        </Reveal>
        <Reveal delay={150}><Rsvp /></Reveal>
      </section>

      {/* FINAL */}
      <section className="relative overflow-hidden bg-primary px-6 py-28 text-center text-primary-foreground">
        <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl animate-shimmer" />
        <Reveal>
          <p className="font-serif text-2xl italic text-rose">Sizni kutib qolamiz</p>
          <h2 className="display mt-6">{data.groom} {data.bride && <><span className="text-gold">&amp;</span> {data.bride}</>}</h2>
          <Ornament className="my-8" />
          <p className="eyebrow">{data.dateLabel}</p>
          <button onClick={() => shareLink(title, description)} className="mt-10 inline-flex items-center gap-2 border border-gold px-7 py-4 eyebrow transition hover:bg-gold hover:!text-burgundy">
            <Share2 className="h-4 w-4" /> Taklifnomani ulashish
          </button>
          <p className="mt-16 text-xs text-primary-foreground/50">
            Taklifnoma <Link to="/studio" className="underline underline-offset-4 hover:text-gold">Zarhal Studio</Link> tomonidan
          </p>
        </Reveal>
      </section>

      <MusicControl startSignal={musicSignal} />
    </main>
  );
}

function Countdown({ date }: { date: string }) {
  const [r, setR] = useState<Remaining | null>(null);
  useEffect(() => {
    const tick = () => setR(getRemaining(date));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (r?.status === "invalid") return <p className="mt-8 font-serif text-2xl">Sana noto‘g‘ri kiritilgan</p>;
  if (r?.status === "expired") return <p className="mt-8 font-serif text-3xl">Bayram boshlandi — bizning baxtli kunimiz!</p>;
  const parts = [
    ["Kun", r?.status === "running" ? r.days : 0],
    ["Soat", r?.status === "running" ? r.hours : 0],
    ["Daqiqa", r?.status === "running" ? r.minutes : 0],
    ["Soniya", r?.status === "running" ? r.seconds : 0],
  ] as const;
  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-4 gap-2 sm:gap-6" aria-live="polite">
      {parts.map(([l, v]) => (
        <div key={l} className="border border-gold/30 py-5">
          <div className="font-serif text-4xl tabular-nums sm:text-6xl">{r ? String(v).padStart(2, "0") : "--"}</div>
          <div className="mt-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold">{l}</div>
        </div>
      ))}
    </div>
  );
}

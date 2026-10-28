import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowUpRight, Instagram, Loader2, Send, X } from "lucide-react";
import { studio } from "@/config/site";
import studioHero from "@/assets/studio-hero.jpg";
import { Reveal } from "@/components/site/Reveal";
import { fieldCls } from "@/components/wedding/Rsvp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Zarhal Studio — Premium taklifnomalar va brend kontent" },
      { name: "description", content: "Raqamli va video taklifnomalar, restoran reklamasi, brend reelslar va maxsus saytlar." },
      { property: "og:title", content: "Zarhal Studio — G‘oyangizni premium tajribaga aylantiring" },
      { property: "og:description", content: "Raqamli taklifnomalar, video, reels va maxsus saytlar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const nav = [
  ["Xizmatlar", "#services"],
  ["Portfolio", "#portfolio"],
  ["Narxlar", "#pricing"],
  ["Savollar", "#faq"],
  ["Buyurtma", "#order"],
];

function Studio() {
  const [preview, setPreview] = useState<number | null>(null);
  const [filter, setFilter] = useState("Barchasi");
  const cats = ["Barchasi", ...Array.from(new Set(studio.portfolio.map((p) => p.category)))];
  const sel = preview !== null ? studio.portfolio[preview] : undefined;
  const items = studio.portfolio.filter((p) => filter === "Barchasi" || p.category === filter);

  return (
    <div className="studio min-h-screen overflow-x-clip">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-charcoal/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/studio" className="font-serif text-xl italic gold-text">{studio.name}</Link>
          <nav className="hidden gap-7 md:flex">
            {nav.map(([l, h]) => <a key={h} href={h} className="eyebrow !text-foreground/70 hover:!text-gold">{l}</a>)}
          </nav>
          <Link to="/" className="eyebrow hover:underline">Namuna →</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-32 md:grid-cols-2 md:pt-40">
        <div>
          <p className="eyebrow animate-fade-up">Kreativ studiya · Toshkent</p>
          <h1 className="mt-6 font-serif text-[clamp(2.6rem,7vw,5rem)] font-light italic leading-[1] animate-fade-up [animation-delay:.15s]">
            G‘oyangizni <span className="gold-text">premium</span> tajribaga aylantiring
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground animate-fade-up [animation-delay:.3s]">
            To‘y taklifnomalari, brend videolari va saytlar — kinematografik uslubda, har bir tafsilotga e’tibor bilan.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up [animation-delay:.45s]">
            <a href="#order" className="bg-primary px-7 py-4 eyebrow !text-primary-foreground glow-gold">Buyurtma berish</a>
            <a href="#portfolio" className="border border-gold/50 px-7 py-4 eyebrow">Ishlarimiz</a>
          </div>
        </div>
        <div className="relative animate-fade-up [animation-delay:.3s]">
          <div className="absolute -inset-10 rounded-full bg-gold/10 blur-3xl" />
          <img src={studioHero} alt="Oltin harfli taklifnoma va telefon maketi" width={1600} height={1008} className="relative w-full glow-gold animate-floaty" />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <Reveal><p className="eyebrow">Xizmatlar</p><h2 className="section-title mt-3 italic">Nima qilamiz</h2></Reveal>
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {studio.services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 100} className="group bg-charcoal p-8 transition hover:bg-burgundy">
              <span className="font-serif text-4xl italic text-gold/60">0{i + 1}</span>
              <h3 className="mt-6 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <Reveal><p className="eyebrow">Portfolio</p><h2 className="section-title mt-3 italic">Tanlangan loyihalar</h2></Reveal>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${filter === c ? "border-gold bg-gold text-charcoal" : "border-border hover:border-gold"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const idx = studio.portfolio.indexOf(p);
            return (
              <button key={p.title} onClick={() => setPreview(idx)} className="group relative aspect-[4/5] overflow-hidden text-left">
                <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div><p className="eyebrow">{p.category}</p><p className="mt-1 font-serif text-2xl italic">{p.title}</p></div>
                  <ArrowUpRight className="h-5 w-5 text-gold transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {sel && (
        <div role="dialog" aria-modal="true" aria-label={sel.title} onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur animate-in fade-in"
          onKeyDown={(e) => e.key === "Escape" && setPreview(null)}>
          <div onClick={(e) => e.stopPropagation()} className="relative grid max-h-[90vh] w-full max-w-4xl overflow-auto border border-border bg-burgundy md:grid-cols-2">
            <img src={sel.image} alt={sel.title} className="h-full max-h-[50vh] w-full object-cover md:max-h-none" />
            <div className="p-8">
              <p className="eyebrow">{sel.category}</p>
              <h3 className="mt-3 text-4xl italic">{sel.title}</h3>
              <p className="mt-4 text-muted-foreground">{sel.desc}</p>
              <a href="#order" onClick={() => setPreview(null)} className="mt-8 inline-block bg-primary px-6 py-3 eyebrow !text-primary-foreground">Shunga o‘xshashini buyurtma qilish</a>
            </div>
            <button autoFocus onClick={() => setPreview(null)} aria-label="Yopish" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/70"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <Reveal className="text-center"><p className="eyebrow">Narxlar</p><h2 className="section-title mt-3 italic">Paketlar</h2></Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {studio.pricing.map((p, i) => (
            <Reveal key={p.name} delay={i * 100} className={`border p-8 ${p.featured ? "border-gold bg-burgundy glow-gold" : "border-border bg-card"}`}>
              {p.featured && <p className="eyebrow mb-4">Eng mashhur</p>}
              <h3 className="text-3xl italic">{p.name}</h3>
              <p className="mt-4 font-serif text-4xl">{p.price} <span className="text-base text-muted-foreground">{p.unit}</span></p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {p.features.map((f) => <li key={f} className="flex gap-3"><span className="text-gold">✦</span>{f}</li>)}
              </ul>
              <a href="#order" className={`mt-8 block py-3 text-center eyebrow ${p.featured ? "bg-primary !text-primary-foreground" : "border border-gold/50"}`}>Tanlash</a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><p className="eyebrow">Jarayon</p><h2 className="section-title mt-3 italic">Qanday ishlaymiz</h2></Reveal>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {studio.process.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className="border-t border-gold/50 pt-6">
              <span className="eyebrow">Bosqich {i + 1}</span>
              <h3 className="mt-3 text-2xl italic">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal><p className="eyebrow">Fikrlar</p><h2 className="section-title mt-3 italic">Mijozlar nima deydi</h2></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {studio.testimonials.map((t) => (
            <Reveal key={t.name} className="border border-border bg-card p-8">
              <p className="font-serif text-2xl italic leading-snug">“{t.text}”</p>
              <p className="mt-6 eyebrow">{t.name}{t.demo && <span className="ml-2 text-muted-foreground">· demo kontent</span>}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20">
        <Reveal className="text-center"><p className="eyebrow">FAQ</p><h2 className="section-title mt-3 italic">Ko‘p beriladigan savollar</h2></Reveal>
        <Accordion type="single" collapsible className="mt-10">
          {studio.faq.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="font-serif text-xl hover:no-underline hover:text-gold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ORDER + CONTACT */}
      <section id="order" className="mx-auto grid max-w-6xl scroll-mt-20 gap-12 px-5 py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow">Aloqa</p>
          <h2 className="section-title mt-3 italic">Loyihangizni boshlaymiz</h2>
          <p className="mt-5 text-muted-foreground">Formani to‘ldiring yoki bevosita yozing — 24 soat ichida javob beramiz.</p>
          <div className="mt-8 flex flex-col gap-3">
            <a href={studio.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><Send className="h-4 w-4 text-gold" /> Telegram</a>
            <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><Instagram className="h-4 w-4 text-gold" /> Instagram</a>
          </div>
        </div>
        <OrderForm />
      </section>

      <footer className="border-t border-border px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <span className="font-serif text-lg italic gold-text">{studio.name}</span>
          <span>© {new Date().getFullYear()} · Barcha huquqlar himoyalangan</span>
          <Link to="/" className="hover:text-gold">Taklifnoma namunasi</Link>
        </div>
      </footer>

      <a href={studio.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegramda yozish"
        className="fixed right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground glow-gold safe-bottom">
        <Send className="h-5 w-5" />
      </a>
    </div>
  );
}

const orderSchema = z.object({
  service: z.string().min(1, "Xizmatni tanlang"),
  name: z.string().trim().min(2, "Ismingizni kiriting").max(100),
  contact: z.string().trim().min(5, "Telefon yoki Telegram kiriting").max(100),
  deadline: z.string().optional(),
  brief: z.string().trim().min(10, "Kamida 10 belgi").max(1000),
});

function OrderForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "demo" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const parsed = orderSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    if (!studio.orderEndpoint) {
      await new Promise((r) => setTimeout(r, 700));
      return setStatus("demo");
    }
    try {
      const r = await fetch(studio.orderEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(parsed.data) });
      if (!r.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };
  if (status === "done" || status === "demo")
    return (
      <div role="status" className="border border-gold/50 p-10 text-center">
        <p className="font-serif text-3xl italic">Rahmat!</p>
        <p className="mt-3 text-muted-foreground">{status === "done" ? "So‘rovingiz yuborildi." : "Demo rejim: so‘rov saqlanmadi. Iltimos, Telegram orqali yozing."}</p>
        <button onClick={() => setStatus("idle")} className="mt-6 eyebrow underline">Yangi so‘rov</button>
      </div>
    );
  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-destructive">{errors[k]}</p>;
  return (
    <form onSubmit={submit} noValidate className="space-y-6 border border-border bg-card p-6 sm:p-8">
      {!studio.orderEndpoint && <p className="text-xs text-muted-foreground">Demo rejim — so‘rovlar hozircha saqlanmaydi</p>}
      <div>
        <label htmlFor="service" className="eyebrow">Xizmat *</label>
        <select id="service" name="service" defaultValue="" className={`${fieldCls} [&>option]:bg-burgundy`}>
          <option value="" disabled>Tanlang</option>
          {studio.services.map((s) => <option key={s.title}>{s.title}</option>)}
        </select>
        {err("service")}
      </div>
      <div><label htmlFor="oname" className="eyebrow">Ism *</label><input id="oname" name="name" className={fieldCls} />{err("name")}</div>
      <div><label htmlFor="contact" className="eyebrow">Telefon / Telegram *</label><input id="contact" name="contact" className={fieldCls} placeholder="+998 ..." />{err("contact")}</div>
      <div><label htmlFor="deadline" className="eyebrow">Muddat</label><input id="deadline" name="deadline" type="date" className={`${fieldCls} [color-scheme:dark]`} /></div>
      <div><label htmlFor="brief" className="eyebrow">Loyiha haqida *</label><textarea id="brief" name="brief" rows={4} className={fieldCls} />{err("brief")}</div>
      {status === "error" && <p role="alert" className="text-sm text-destructive">Yuborishda xatolik. Qayta urinib ko‘ring.</p>}
      <button disabled={status === "loading"} className="flex w-full items-center justify-center gap-2 bg-primary py-4 eyebrow !text-primary-foreground disabled:opacity-60">
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />} Yuborish
      </button>
    </form>
  );
}

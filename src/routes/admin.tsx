import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fieldCls } from "@/components/wedding/Rsvp";
import { Ornament } from "@/components/site/Reveal";
import { builtInEvents, type EventRow } from "@/lib/events";
import { eventsQueryKey } from "@/lib/use-events";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin panel — taklifnoma sayti" },
      { name: "description", content: "Marosim turlari, matnlar va suratlarni boshqarish." },
      { property: "og:title", content: "Admin panel" },
      { property: "og:description", content: "Sayt sozlamalarini boshqarish." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin")
      .then(({ data }) => setIsAdmin(!!data?.length));
  }, [session]);

  if (!ready) return null;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="eyebrow">← Saytga qaytish</Link>
      <h1 className="section-title mt-6 text-center">Admin panel</h1>
      <Ornament className="my-10" />
      {!session ? <AuthForm /> : isAdmin === null ? <p className="text-center text-muted-foreground">Tekshirilmoqda…</p>
        : !isAdmin ? (
          <div className="text-center">
            <p className="text-muted-foreground">Bu hisobda admin huquqi yo‘q.</p>
            <button onClick={() => supabase.auth.signOut()} className="mt-6 border border-primary px-6 py-3 eyebrow !text-primary">Chiqish</button>
          </div>
        ) : <EventsEditor email={session.user.email ?? ""} />}
    </main>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error, data } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password: pass })
      : await supabase.auth.signUp({ email, password: pass, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up" && !data.session) toast.success("Emailingizga tasdiqlash xati yuborildi");
  };
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-6">
      <p className="text-center text-sm text-muted-foreground">Birinchi ro‘yxatdan o‘tgan foydalanuvchi avtomatik admin bo‘ladi.</p>
      <div><label className="eyebrow" htmlFor="em">Email</label><input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} /></div>
      <div><label className="eyebrow" htmlFor="pw">Parol</label><input id="pw" type="password" required minLength={6} value={pass} onChange={(e) => setPass(e.target.value)} className={fieldCls} /></div>
      <button disabled={busy} className="w-full bg-primary py-4 eyebrow !text-primary-foreground hover:opacity-90 disabled:opacity-50">
        {mode === "in" ? "Kirish" : "Ro‘yxatdan o‘tish"}
      </button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-sm text-muted-foreground underline underline-offset-4">
        {mode === "in" ? "Hisob yo‘qmi? Ro‘yxatdan o‘ting" : "Hisobingiz bormi? Kiring"}
      </button>
    </form>
  );
}

function EventsEditor({ email }: { email: string }) {
  const qc = useQueryClient();
  const [rows, setRows] = useState<EventRow[]>([]);
  const load = async () => {
    const { data } = await supabase.from("event_types").select("*").order("sort");
    setRows((data as EventRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (r: EventRow) => {
    const { error } = await supabase.from("event_types").upsert({ ...r, updated_at: new Date().toISOString() });
    if (error) { toast.error(error.message); return; }
    toast.success(`“${r.name}” saqlandi`);
    qc.invalidateQueries({ queryKey: eventsQueryKey });
  };
  const remove = async (slug: string) => {
    if (!confirm("O‘chirilsinmi?")) return;
    await supabase.from("event_types").delete().eq("slug", slug);
    qc.invalidateQueries({ queryKey: eventsQueryKey });
    load();
  };
  const add = () => {
    const slug = prompt("Yangi marosim kodi (lotin harflarda, masalan: kelin-salom)")?.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!slug) return;
    setRows([...rows, { slug, name: "Yangi marosim", heading: "Taklifnoma", default_message: "", extra_images: [], active: true, sort: rows.length + 1 }]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{email}</p>
        <div className="flex gap-2">
          <button onClick={add} className="bg-primary px-5 py-3 eyebrow !text-primary-foreground">+ Marosim</button>
          <button onClick={() => supabase.auth.signOut()} className="border border-primary px-5 py-3 eyebrow !text-primary">Chiqish</button>
        </div>
      </div>
      <p className="eyebrow">Marosim turlari</p>
      {rows.map((r, idx) => <EventCard key={r.slug} row={r} onChange={(n) => setRows(rows.map((x, i) => (i === idx ? n : x)))} onSave={() => save(r)} onDelete={() => remove(r.slug)} />)}
    </div>
  );
}

function EventCard({ row, onChange, onSave, onDelete }: { row: EventRow; onChange: (r: EventRow) => void; onSave: () => void; onDelete: () => void }) {
  const built = builtInEvents.find((e) => e.slug === row.slug);
  const set = <K extends keyof EventRow>(k: K, v: EventRow[K]) => onChange({ ...row, [k]: v });
  const thumbs = [...row.extra_images.filter(Boolean), ...(built?.photos.map((p) => p.src) ?? [])];
  return (
    <div className="space-y-5 border border-border p-6">
      <div className="flex flex-wrap gap-2">
        {thumbs.slice(0, 8).map((src, i) => <img key={src + i} src={src} alt="" loading="lazy" className="h-16 w-12 object-cover" />)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="eyebrow">Nomi</label><input value={row.name} onChange={(e) => set("name", e.target.value)} className={fieldCls} /></div>
        <div><label className="eyebrow">Taklifnoma sarlavhasi</label><input value={row.heading} onChange={(e) => set("heading", e.target.value)} className={fieldCls} /></div>
      </div>
      <div><label className="eyebrow">Standart xabar</label><textarea rows={2} value={row.default_message} onChange={(e) => set("default_message", e.target.value)} className={fieldCls} /></div>
      <div>
        <label className="eyebrow">Qo‘shimcha suratlar (har qatorda bitta havola)</label>
        <textarea rows={3} value={row.extra_images.join("\n")} placeholder="https://..." onChange={(e) => set("extra_images", e.target.value.split("\n").map((s) => s.trim()))} className={fieldCls} />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={row.active} onChange={(e) => set("active", e.target.checked)} /> Saytda ko‘rinsin</label>
        <label className="flex items-center gap-2 text-sm">Tartib <input type="number" value={row.sort} onChange={(e) => set("sort", Number(e.target.value))} className="w-16 border-b border-border bg-transparent" /></label>
        <div className="ml-auto flex gap-2">
          <button onClick={onDelete} className="px-4 py-2 text-sm text-destructive">O‘chirish</button>
          <button onClick={onSave} className="bg-primary px-5 py-2 eyebrow !text-primary-foreground">Saqlash</button>
        </div>
      </div>
    </div>
  );
}

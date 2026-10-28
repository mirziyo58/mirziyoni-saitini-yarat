import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { wedding } from "@/config/site";

const schema = z.object({
  name: z.string().trim().min(2, "Ismingizni kiriting").max(100),
  attending: z.enum(["yes", "no"], { errorMap: () => ({ message: "Javobni tanlang" }) }),
  guests: z.coerce.number().int().min(1, "Kamida 1").max(10, "Ko‘pi bilan 10"),
  message: z.string().max(500).optional(),
});

type Status = "idle" | "loading" | "success" | "demo" | "error";

export const fieldCls =
  "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-base outline-none transition placeholder:text-muted-foreground/60 focus:border-gold";

export function Rsvp() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attending, setAttending] = useState<"yes" | "no" | "">("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse({ ...data, guests: attending === "no" ? 1 : data["guests"] });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    if (!wedding.rsvpEndpoint) {
      await new Promise((r) => setTimeout(r, 700));
      setStatus("demo");
      return;
    }
    try {
      const res = await fetch(wedding.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success" || status === "demo") {
    return (
      <div role="status" className="py-10 text-center">
        <p className="font-serif text-3xl">Rahmat!</p>
        <p className="mt-3 text-muted-foreground">
          {status === "success"
            ? "Javobingiz qabul qilindi."
            : "Demo rejim: javob saqlanmadi, chunki forma hali serverga ulanmagan."}
        </p>
        <button onClick={() => setStatus("idle")} className="mt-6 eyebrow underline underline-offset-4">
          Yana yuborish
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {!wedding.rsvpEndpoint && (
        <p className="border border-border px-4 py-2 text-center text-xs text-muted-foreground">
          Demo rejim — javoblar hozircha saqlanmaydi
        </p>
      )}
      <div>
        <label htmlFor="name" className="eyebrow">To‘liq ismingiz *</label>
        <input id="name" name="name" autoComplete="name" className={fieldCls} placeholder="Ism Familiya" aria-invalid={!!errors["name"]} />
        {errors["name"] && <p className="mt-1 text-sm text-destructive">{errors["name"]}</p>}
      </div>
      <fieldset>
        <legend className="eyebrow">Kela olasizmi? *</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ["yes", "Albatta kelaman"],
            ["no", "Afsuski, kela olmayman"],
          ].map(([v, l]) => (
            <label
              key={v}
              className={`cursor-pointer border px-3 py-3 text-center text-sm transition ${attending === v ? "border-gold bg-primary text-primary-foreground" : "border-input hover:border-gold"}`}
            >
              <input type="radio" name="attending" value={v} className="sr-only" onChange={() => setAttending(v as "yes" | "no")} />
              {l}
            </label>
          ))}
        </div>
        {errors["attending"] && <p className="mt-1 text-sm text-destructive">{errors["attending"]}</p>}
      </fieldset>
      {attending !== "no" && (
        <div>
          <label htmlFor="guests" className="eyebrow">Mehmonlar soni</label>
          <input id="guests" name="guests" type="number" min={1} max={10} defaultValue={1} className={fieldCls} />
          {errors["guests"] && <p className="mt-1 text-sm text-destructive">{errors["guests"]}</p>}
        </div>
      )}
      <div>
        <label htmlFor="message" className="eyebrow">Tilaklaringiz</label>
        <textarea id="message" name="message" rows={3} maxLength={500} className={fieldCls} placeholder="Yosh oilaga tilak..." />
      </div>
      {status === "error" && <p role="alert" className="text-sm text-destructive">Yuborishda xatolik. Qaytadan urinib ko‘ring.</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 bg-primary py-4 eyebrow !text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Tasdiqlash
      </button>
    </form>
  );
}

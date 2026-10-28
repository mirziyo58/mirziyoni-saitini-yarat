import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { wedding } from "@/config/site";
import { Reveal } from "@/components/site/Reveal";

export function Gallery({ items = wedding.gallery }: { items?: typeof wedding.gallery }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % items.length)), [items.length]);
  const prev = useCallback(() => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  if (!items.length) return <p className="text-center text-muted-foreground">Suratlar tez orada qo‘shiladi.</p>;

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {items.map((img, i) => (
          <Reveal key={i} delay={(i % 3) * 120} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden bg-muted"
              aria-label={`Kattalashtirish: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                loading="lazy"
                className="h-auto w-full transition duration-[1.2s] ease-out group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-2 border border-ivory/0 transition group-hover:border-ivory/60" />
            </button>
          </Reveal>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Surat ko‘rish"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 animate-in fade-in"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0]!.clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0]!.clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
            touchX.current = null;
          }}
        >
          <img
            src={items[open]!.src}
            alt={items[open]!.alt}
            className="max-h-[85vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-0 right-0 px-6 text-center text-sm text-ivory/80">
            {open + 1} / {items.length} — {items[open]!.alt}
          </p>
          <button ref={closeRef} onClick={() => setOpen(null)} aria-label="Yopish" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full glass text-ivory">
            <X className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Oldingi" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass text-ivory">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Keyingi" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass text-ivory">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}

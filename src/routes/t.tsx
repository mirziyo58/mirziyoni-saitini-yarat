import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Invitation } from "@/components/wedding/Invitation";
import { decodeInvite, toWeddingData } from "@/lib/invite-link";
import { useEvents } from "@/lib/use-events";

export const Route = createFileRoute("/t")({
  validateSearch: z.object({ d: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sizga taklifnoma" },
      { name: "description", content: "Sizni to‘yimizga taklif qilamiz — taklifnomani oching." },
      { property: "og:title", content: "Sizga taklifnoma" },
      { property: "og:description", content: "Sizni to‘yimizga taklif qilamiz — taklifnomani oching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SharedInvite,
});

function SharedInvite() {
  const { d } = Route.useSearch();
  const input = d ? decodeInvite(d) : null;
  const { events } = useEvents();
  if (!input)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="section-title">Taklifnoma topilmadi</h1>
        <p className="mt-4 text-muted-foreground">Havola noto‘g‘ri yoki to‘liq nusxalanmagan.</p>
        <Link to="/yaratish" className="mt-8 bg-primary px-7 py-4 eyebrow !text-primary-foreground">Taklifnoma yaratish</Link>
      </main>
    );
  return <Invitation data={toWeddingData(input, events)} showCreate={false} />;
}

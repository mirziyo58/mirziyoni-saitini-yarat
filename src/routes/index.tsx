import { createFileRoute } from "@tanstack/react-router";
import { wedding } from "@/config/site";
import { Invitation } from "@/components/wedding/Invitation";

const title = `${wedding.groom} & ${wedding.bride} — To‘y taklifnomasi`;
const description = `${wedding.dateLabel}, ${wedding.venue.name}. Sizni to‘yimizga taklif qilamiz.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Invitation />,
});

import { toast } from "sonner";

export async function shareLink(title: string, text: string) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Havola nusxalandi");
  } catch {
    toast.error("Havolani nusxalab bo‘lmadi: " + url);
  }
}

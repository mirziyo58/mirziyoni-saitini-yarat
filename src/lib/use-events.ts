import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { builtInEvents, mergeEvents, type EventRow } from "@/lib/events";

export const eventsQueryKey = ["event_types"];

export function useEvents() {
  const q = useQuery({
    queryKey: eventsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from("event_types").select("*").order("sort");
      if (error) throw error;
      return data as EventRow[];
    },
    staleTime: 60_000,
  });
  return { events: q.data ? mergeEvents(q.data) : builtInEvents, rows: q.data, ...q };
}

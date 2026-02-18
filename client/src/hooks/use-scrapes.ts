import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertScrape, type Scrape, type Lead } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch all scrapes
export function useScrapes() {
  return useQuery({
    queryKey: [api.scrapes.list.path],
    queryFn: async () => {
      const res = await fetch(api.scrapes.list.path);
      if (!res.ok) throw new Error("Failed to fetch scrapes");
      return api.scrapes.list.responses[200].parse(await res.json());
    },
    // Poll every 5 seconds to update status
    refetchInterval: 5000,
  });
}

// Fetch a single scrape with leads
export function useScrape(id: number) {
  return useQuery({
    queryKey: [api.scrapes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.scrapes.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) throw new Error("Scrape not found");
      if (!res.ok) throw new Error("Failed to fetch scrape details");
      return api.scrapes.get.responses[200].parse(await res.json());
    },
    // Poll if status is pending
    refetchInterval: (query) => {
      const data = query.state.data as (Scrape & { leads: Lead[] }) | undefined;
      return data?.status === "pending" ? 3000 : false;
    },
  });
}

// Create a new scrape
export function useCreateScrape() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertScrape) => {
      const res = await fetch(api.scrapes.create.path, {
        method: api.scrapes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to start scrape");
      }
      return api.scrapes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scrapes.list.path] });
      toast({
        title: "Scrape Started",
        description: "Your scraping job has been queued successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

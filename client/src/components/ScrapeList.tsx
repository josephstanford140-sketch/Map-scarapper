import { useScrapes } from "@/hooks/use-scrapes";
import { Link } from "wouter";
import { StatusBadge } from "./status-badge";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function ScrapeList() {
  const { data: scrapes, isLoading, error } = useScrapes();

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center mt-8">
        Failed to load recent scrapes. Please try again.
      </div>
    );
  }

  if (!scrapes?.length) {
    return (
      <div className="text-center py-12 mt-8 rounded-xl border border-dashed border-white/10">
        <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-white">No scrapes yet</h3>
        <p className="text-muted-foreground text-sm mt-1">Create your first extraction job above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-10">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-display font-semibold text-white">Recent Extractions</h3>
        <span className="text-xs text-muted-foreground">{scrapes.length} total jobs</span>
      </div>
      
      <div className="grid gap-3">
        {scrapes.map((scrape) => (
          <Link key={scrape.id} href={`/scrapes/${scrape.id}`} className="group block">
            <div className="bg-card/50 hover:bg-card border border-white/5 hover:border-primary/20 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="font-display font-bold text-sm">#{scrape.id}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Search className="w-3.5 h-3.5 text-muted-foreground" />
                      {scrape.keyword}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {scrape.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <StatusBadge status={scrape.status as any} />
                    <span className="text-xs text-muted-foreground">
                      {scrape.createdAt ? format(new Date(scrape.createdAt), 'MMM d, h:mm a') : '-'}
                    </span>
                  </div>
                  
                  <div className="md:hidden">
                    <StatusBadge status={scrape.status as any} />
                  </div>

                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

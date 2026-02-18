import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertScrapeSchema, type InsertScrape } from "@shared/schema";
import { useCreateScrape } from "@/hooks/use-scrapes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export function CreateScrapeForm() {
  const [, setLocation] = useLocation();
  const createScrape = useCreateScrape();

  const form = useForm<InsertScrape>({
    resolver: zodResolver(insertScrapeSchema),
    defaultValues: {
      keyword: "",
      location: "",
    },
  });

  const onSubmit = (data: InsertScrape) => {
    createScrape.mutate(data, {
      onSuccess: (newScrape) => {
        form.reset();
        // Optionally redirect, but standard pattern is to show in list below
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-2xl p-8 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-white">New Extraction</h2>
            <p className="text-muted-foreground text-sm">Launch a new scraper job to find leads.</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground ml-1">Business Type</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g. HVAC, Plumbers, Cafes" 
                          className="pl-10 h-12 glass-input rounded-xl"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-semibold text-muted-foreground ml-1">Target Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g. Surrey, London, NYC" 
                          className="pl-10 h-12 glass-input rounded-xl"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ShinyButton 
              type="submit" 
              className="w-full h-12 text-base font-semibold"
              isLoading={createScrape.isPending}
            >
              {createScrape.isPending ? "Starting Scraper..." : "Start Extraction Job"}
            </ShinyButton>
          </form>
        </Form>
      </div>
    </div>
  );
}

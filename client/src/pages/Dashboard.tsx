import { CreateScrapeForm } from "@/components/CreateScrapeForm";
import { ScrapeList } from "@/components/ScrapeList";
import { Activity, Globe2, Database } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-secondary/20 border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white animate-in">
              Lead<span className="text-gradient">Scraper</span>
            </h1>
            <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto animate-in" style={{ animationDelay: "100ms" }}>
              Extract high-quality business leads directly from Google Maps with precision and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 animate-in" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white">Global Reach</h3>
              <p className="text-sm text-muted-foreground">Target any city worldwide</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white">Real-time Extraction</h3>
              <p className="text-sm text-muted-foreground">Live status updates</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white">CSV Export</h3>
              <p className="text-sm text-muted-foreground">Download clean data instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <CreateScrapeForm />
        <ScrapeList />
      </div>
    </div>
  );
}

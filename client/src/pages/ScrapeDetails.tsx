import { useScrape } from "@/hooks/use-scrapes";
import { Link, useRoute } from "wouter";
import { StatusBadge } from "@/components/status-badge";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Download, 
  Globe, 
  MapPin, 
  Phone, 
  Star,
  Building2,
  RefreshCw
} from "lucide-react";
import { buildUrl, api } from "@shared/routes";

export default function ScrapeDetails() {
  const [, params] = useRoute("/scrapes/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: scrape, isLoading, error } = useScrape(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !scrape) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Scrape not found</h2>
          <Link href="/" className="text-primary hover:underline block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const url = buildUrl(api.scrapes.download.path, { id });
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-display font-bold text-white">
                  {scrape.keyword}
                </h1>
                <StatusBadge status={scrape.status as any} />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-lg">{scrape.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {scrape.status === 'completed' && (
                <ShinyButton onClick={handleDownload} variant="primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </ShinyButton>
              )}
              {scrape.status === 'pending' && (
                <ShinyButton disabled variant="outline" className="animate-pulse">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </ShinyButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-white">{scrape.leads?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With Phone Numbers</p>
                <p className="text-2xl font-bold text-white">
                  {scrape.leads?.filter(l => l.phone).length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With Websites</p>
                <p className="text-2xl font-bold text-white">
                  {scrape.leads?.filter(l => l.website).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-card rounded-xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">Business Name</th>
                  <th className="px-6 py-4 font-semibold">Address</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scrape.leads && scrape.leads.length > 0 ? (
                  scrape.leads.map((lead, idx) => (
                    <tr 
                      key={idx} 
                      className="bg-card/50 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-xs truncate" title={lead.address || ''}>
                        {lead.address || '-'}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                            {lead.phone}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {lead.rating ? (
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current mr-1" />
                            <span className="text-white">{lead.rating}</span>
                            <span className="text-muted-foreground ml-1">({lead.reviews})</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {lead.website ? (
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Visit <Globe className="w-3 h-3" />
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {scrape.status === 'pending' ? (
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                          <p>Scraping in progress... this might take a minute.</p>
                        </div>
                      ) : (
                        "No leads found for this search."
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

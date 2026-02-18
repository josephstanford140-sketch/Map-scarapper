import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { runScraper } from "./scraper.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.scrapes.list.path, async (req, res) => {
    const scrapes = await storage.getScrapes();
    res.json(scrapes);
  });

  app.post(api.scrapes.create.path, async (req, res) => {
    try {
      const input = api.scrapes.create.input.parse(req.body);
      const scrape = await storage.createScrape(input);
      
      // Start scraping in background
      runScraper(scrape.id, scrape.keyword, scrape.location).catch(console.error);
      
      res.status(201).json(scrape);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.scrapes.get.path, async (req, res) => {
    const scrape = await storage.getScrape(Number(req.params.id));
    if (!scrape) {
      return res.status(404).json({ message: 'Scrape not found' });
    }
    const leads = await storage.getLeadsByScrapeId(scrape.id);
    res.json({ ...scrape, leads });
  });

  app.get('/api/scrapes/:id/download', async (req, res) => {
    const scrape = await storage.getScrape(Number(req.params.id));
    if (!scrape) {
      return res.status(404).json({ message: 'Scrape not found' });
    }
    const leads = await storage.getLeadsByScrapeId(scrape.id);
    
    // Generate CSV
    const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Reviews', 'Is Ad'];
    const rows = leads.map(l => [
      l.name, 
      l.address || '', 
      l.phone || '', 
      l.website || '', 
      l.rating || '', 
      l.reviews || '',
      l.isAd ? 'Yes' : 'No'
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${scrape.id}.csv"`);
    res.send(csv);
  });

  return httpServer;
}

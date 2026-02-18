import { db } from "./db";
import { scrapes, leads, type Scrape, type InsertScrape, type Lead, type InsertLead } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createScrape(scrape: InsertScrape): Promise<Scrape>;
  getScrapes(): Promise<Scrape[]>;
  getScrape(id: number): Promise<Scrape | undefined>;
  updateScrapeStatus(id: number, status: "pending" | "completed" | "failed"): Promise<Scrape>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadsByScrapeId(scrapeId: number): Promise<Lead[]>;
}

export class DatabaseStorage implements IStorage {
  async createScrape(insertScrape: InsertScrape): Promise<Scrape> {
    const [scrape] = await db.insert(scrapes).values(insertScrape).returning();
    return scrape;
  }

  async getScrapes(): Promise<Scrape[]> {
    return await db.select().from(scrapes).orderBy(desc(scrapes.createdAt));
  }

  async getScrape(id: number): Promise<Scrape | undefined> {
    const [scrape] = await db.select().from(scrapes).where(eq(scrapes.id, id));
    return scrape;
  }

  async updateScrapeStatus(id: number, status: "pending" | "completed" | "failed"): Promise<Scrape> {
    const [scrape] = await db.update(scrapes)
      .set({ status })
      .where(eq(scrapes.id, id))
      .returning();
    return scrape;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLeadsByScrapeId(scrapeId: number): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.scrapeId, scrapeId));
  }
}

export const storage = new DatabaseStorage();

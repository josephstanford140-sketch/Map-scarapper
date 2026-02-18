import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const scrapes = pgTable("scrapes", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  location: text("location").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  scrapeId: integer("scrape_id").notNull(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  rating: text("rating"),
  reviews: text("reviews"),
  isAd: boolean("is_ad").default(false),
});

export const scrapesRelations = relations(scrapes, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  scrape: one(scrapes, {
    fields: [leads.scrapeId],
    references: [scrapes.id],
  }),
}));

export const insertScrapeSchema = createInsertSchema(scrapes).omit({ 
  id: true, 
  createdAt: true,
  status: true 
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true });

export type Scrape = typeof scrapes.$inferSelect;
export type InsertScrape = z.infer<typeof insertScrapeSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

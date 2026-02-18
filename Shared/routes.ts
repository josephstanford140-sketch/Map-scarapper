import { z } from 'zod';
import { insertScrapeSchema, scrapes, leads } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scrapes: {
    list: {
      method: 'GET' as const,
      path: '/api/scrapes' as const,
      responses: {
        200: z.array(z.custom<typeof scrapes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scrapes' as const,
      input: insertScrapeSchema,
      responses: {
        201: z.custom<typeof scrapes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/scrapes/:id' as const,
      responses: {
        200: z.custom<typeof scrapes.$inferSelect & { leads: typeof leads.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    download: { // Endpoint to download CSV
        method: 'GET' as const,
        path: '/api/scrapes/:id/download' as const,
        responses: {
            200: z.any(), // File download
            404: errorSchemas.notFound,
        }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

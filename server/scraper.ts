import { storage } from "./storage";
import puppeteer from "puppeteer";
import { execSync } from "child_process";

// Get chromium path
const getChromiumPath = () => {
  try {
    return execSync("which chromium").toString().trim();
  } catch (e) {
    return null;
  }
};

export async function runScraper(scrapeId: number, keyword: string, location: string) {
  console.log(`Starting scrape job ${scrapeId} for ${keyword} in ${location}`);
  let browser;
  try {
    const executablePath = getChromiumPath();
    console.log(`Using chromium at: ${executablePath}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath || undefined
    });
    
    const page = await browser.newPage();
    
    // Construct search query
    const query = `${keyword} in ${location}`;
    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, {
      waitUntil: 'networkidle2'
    });

    try {
        // Accept cookies if prompted (this selector might change)
        const acceptButton = await page.$('button[aria-label="Accept all"]');
        if (acceptButton) {
            await acceptButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for dialog to close
        }
    } catch (e) {
        // Ignore if no cookie dialog
    }

    // Identify the scrollable container.
    // Google Maps usually has a sidebar with role="feed"
    const feedSelector = 'div[role="feed"]';
    
    try {
        await page.waitForSelector(feedSelector, { timeout: 10000 });
    } catch (e) {
        console.error(`Could not find feed selector for scrape ${scrapeId}`);
        await storage.updateScrapeStatus(scrapeId, "failed");
        return;
    }

    // Scroll to load more results
    // We'll scroll more times to get around 500 results
    // Each scroll typically loads 20 results, so 25-30 scrolls
    for (let i = 0; i < 30; i++) {
        await page.evaluate((selector) => {
            const feed = document.querySelector(selector);
            if (feed) {
                feed.scrollTop = feed.scrollHeight;
            }
        }, feedSelector);
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Check if we reached the end
        const endOfList = await page.evaluate(() => {
          return document.body.innerText.includes("You've reached the end of the list");
        });
        if (endOfList) break;
    }

    // Extract data
    const leadsData = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('div[role="feed"] > div > div[jsaction]'));
        
        return items.map(item => {
            let data = {
                name: '',
                address: '',
                phone: '',
                website: '',
                rating: '',
                reviews: '',
                isAd: false
            };
            
            try {
                // Ad detection
                const isSponsored = item.textContent?.includes('Sponsored') || item.querySelector('.q2vSnd') !== null;
                data.isAd = !!isSponsored;

                const textContent = item.textContent || "";
                const lines = textContent.split('\n').filter(line => line.trim().length > 0);
                
                if (lines.length > 0) {
                    data.name = lines[0];
                }
                
                const links = Array.from(item.querySelectorAll('a'));
                for (const link of links) {
                    const href = (link as HTMLAnchorElement).href;
                    if (href && !href.includes('google.com/maps')) {
                        data.website = href;
                        break;
                    }
                }
                
                const ratingMatch = textContent.match(/(\d\.\d)\s*\(([\d,]+)\)/);
                if (ratingMatch) {
                    data.rating = ratingMatch[1];
                    data.reviews = ratingMatch[2];
                }
                
                const phoneMatch = textContent.match(/(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/);
                if (phoneMatch) {
                   data.phone = phoneMatch[0];
                }
                
                if (lines.length > 2) {
                     data.address = lines[2];
                }

            } catch (e) {
                // error parsing item
            }
            return data;
        }).filter(item => item.name && item.name.length > 0);
    });

    console.log(`Found ${leadsData.length} leads for scrape ${scrapeId}`);

    for (const lead of leadsData) {
        await storage.createLead({
            scrapeId,
            name: lead.name,
            address: lead.address || null,
            phone: lead.phone || null,
            website: lead.website || null,
            rating: lead.rating || null,
            reviews: lead.reviews || null,
            isAd: lead.isAd || false
        });
    }

    await storage.updateScrapeStatus(scrapeId, "completed");

  } catch (error) {
    console.error(`Scrape job ${scrapeId} failed:`, error);
    await storage.updateScrapeStatus(scrapeId, "failed");
  } finally {
    if (browser) {
        await browser.close();
    }
  }
}

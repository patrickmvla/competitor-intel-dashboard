import { router, publicProcedure } from "../trpc";
import { ScraperService } from "@/server/core/scraper";
import { priceSnapshots } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { EmailService } from "@/server/core/email";

export const scraperRouter = router({
  runForAllProducts: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        const allProducts = await ctx.db.query.products.findMany({
          with: {
            competitor: true,
          },
        });

        if (allProducts.length === 0) {
          return { message: "No products to scrape." };
        }

        const productsToScrape = allProducts.map(p => ({
          url: p.productUrl,
          productId: p.id,
          isHighRisk: p.competitor.isHighRisk,
        }));

        const scraper = new ScraperService(process.env.FIRECRAWL_API_KEY!);
        const scrapeResults = await scraper.batchScrape(productsToScrape);

        const changedProducts = scrapeResults.filter(
          result => result && (result.changeStatus === 'changed' || result.changeStatus === 'new')
        );

        if (changedProducts.length > 0) {
          const snapshotsToInsert = changedProducts.map(result => ({
            productId: result!.productId,
            price: result!.price.toString(),
            stockStatus: result!.stockStatus,
            screenshotUrl: result!.screenshotUrl,
          }));

          await ctx.db.insert(priceSnapshots).values(snapshotsToInsert);

          const priceDrops = changedProducts.filter(
            p => p && p.changeStatus === 'changed' && p.previousPrice && p.price < p.previousPrice
          );

          if (priceDrops.length > 0) {
            console.log(`PRICE DROP DETECTED FOR ${priceDrops.length} PRODUCTS! Sending alerts...`);
            const emailService = new EmailService();
            
            // Send an email for each price drop
            for (const drop of priceDrops) {
              const productInfo = allProducts.find(p => p.id === drop!.productId);
              if (productInfo) {
                await emailService.sendPriceDropAlert({
                  productName: productInfo.name,
                  competitorName: productInfo.competitor.name,
                  oldPrice: drop!.previousPrice!,
                  newPrice: drop!.price,
                  productUrl: productInfo.productUrl,
                });
              }
            }
          }
        }
        
        return {
          message: `Scraping complete. Found ${changedProducts.length} updates out of ${allProducts.length} products.`
        };
      } catch (error) {
        console.error("Scraping job failed:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'The scraping job failed. This may be due to a server timeout or an issue with the scraping service.',
          cause: error,
        });
      }
    }),
});

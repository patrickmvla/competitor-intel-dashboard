import { alertRecipientRouter } from "./routers/alert-recipient";
import { competitorRouter } from "./routers/competitor";
import { dashboardRouter } from "./routers/dashboard";
import { priceSnapshotRouter } from "./routers/price-snapshot";
import { productRouter } from "./routers/product";
import { scraperRouter } from "./routers/scraper";
import { router } from "./trpc";

export const appRouter = router({
  competitor: competitorRouter,
  product: productRouter,
  scraper: scraperRouter,
  priceSnapshot: priceSnapshotRouter,
  dashboard: dashboardRouter,
  alertRecipient: alertRecipientRouter,
});

export type AppRouter = typeof appRouter;

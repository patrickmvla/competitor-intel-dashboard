import {
  competitorTargets,
  priceSnapshots,
  products,
} from "@/server/db/schema";
import { count, gte } from "drizzle-orm";
import { publicProcedure, router } from "../trpc";

export const dashboardRouter = router({
  getStats: publicProcedure.query(async ({ ctx }) => {
    const totalCompetitors = await ctx.db
      .select({ value: count() })
      .from(competitorTargets);

    const totalProducts = await ctx.db
      .select({ value: count() })
      .from(products);

    // This is a placeholder for price drops. A real implementation would be more complex.
    // For now, we'll just count recent snapshots.
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const priceDropsToday = await ctx.db
      .select({ value: count() })
      .from(priceSnapshots)
      .where(gte(priceSnapshots.extractedAt, twentyFourHoursAgo));

    return {
      totalCompetitors: totalCompetitors[0].value,
      totalProducts: totalProducts[0].value,
      priceDropsToday: priceDropsToday[0].value,
    };
  }),
});

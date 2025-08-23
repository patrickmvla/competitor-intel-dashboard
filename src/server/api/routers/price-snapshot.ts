import { z } from "zod";
import { db } from "@/server/db";
import { router, publicProcedure } from "../trpc";
import { desc } from "drizzle-orm";
import { priceSnapshots } from "@/server/db/schema";

export const priceSnapshotRouter = router({
  getLatestByProductId: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await db.query.priceSnapshots.findFirst({
        where: (snapshots, { eq }) => eq(snapshots.productId, input.productId),
        orderBy: [desc(priceSnapshots.extractedAt)],
      });
    }),

  getHistoryByProductId: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return await db.query.priceSnapshots.findMany({
        where: (snapshots, { eq }) => eq(snapshots.productId, input.productId),
        orderBy: [desc(priceSnapshots.extractedAt)],
        limit: 30,
      });
    }),
});

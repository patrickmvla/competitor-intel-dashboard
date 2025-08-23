import { z } from "zod";
import { products } from "@/server/db/schema";
import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        productUrl: z.string().url(),
        competitorId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newProduct = await ctx.db
        .insert(products)
        .values(input)
        .returning();
      return newProduct[0];
    }),

  getByCompetitorId: publicProcedure
    .input(z.object({ competitorId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.products.findMany({
        where: (products, { eq }) =>
          eq(products.competitorId, input.competitorId),
      });
    }),
});

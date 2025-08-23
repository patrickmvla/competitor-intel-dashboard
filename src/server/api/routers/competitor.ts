import { z } from "zod";
import { db } from "@/server/db";
import { competitorTargets } from "@/server/db/schema";
import { router, publicProcedure } from "../trpc";

export const competitorRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        baseUrl: z.url(),
        isHighRisk: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const newTarget = await db
        .insert(competitorTargets)
        .values(input)
        .returning();
      return newTarget[0];
    }),

  getAll: publicProcedure.query(async () => {
    return await db.query.competitorTargets.findMany();
  }),
});

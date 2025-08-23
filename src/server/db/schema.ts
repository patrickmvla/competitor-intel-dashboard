import {
  pgTable,
  text,
  boolean,
  timestamp,
  serial,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const competitorTargets = pgTable("competitor_targets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  isHighRisk: boolean("is_high_risk").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const competitorTargetsRelations = relations(
  competitorTargets,
  ({ many }) => ({
    products: many(products),
  })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  productUrl: text("product_url").notNull(),
  competitorId: integer("competitor_id")
    .references(() => competitorTargets.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  competitor: one(competitorTargets, {
    fields: [products.competitorId],
    references: [competitorTargets.id],
  }),
}));

export const priceSnapshots = pgTable("price_snapshots", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockStatus: text("stock_status").notNull(),
  screenshotUrl: text("screenshot_url"),
  extractedAt: timestamp("extracted_at").defaultNow().notNull(),
});

export const priceSnapshotsRelations = relations(priceSnapshots, ({ one }) => ({
  product: one(products, {
    fields: [priceSnapshots.productId],
    references: [products.id],
  }),
}));

export const alertRecipients = pgTable("alert_recipients", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

CREATE TABLE "competitor_targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"base_url" text NOT NULL,
	"is_high_risk" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock_status" text NOT NULL,
	"screenshot_url" text,
	"extracted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"product_url" text NOT NULL,
	"competitor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "price_snapshots" ADD CONSTRAINT "price_snapshots_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_competitor_id_competitor_targets_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitor_targets"("id") ON DELETE no action ON UPDATE no action;
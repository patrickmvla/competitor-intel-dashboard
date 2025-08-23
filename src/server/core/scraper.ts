import Firecrawl from "@mendable/firecrawl-js";
import { z } from "zod";

const ScrapeDataSchema = z.object({
  price: z.number().describe("The final numeric price of the product."),
  stockStatus: z
    .enum(["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"])
    .describe("The current stock status of the product."),
});

const jsonSchema = {
  type: "object",
  properties: {
    price: {
      type: "number",
      description: "The final numeric price of the product.",
    },
    stockStatus: {
      type: "string",
      enum: ["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"],
      description: "The current stock status of the product.",
    },
  },
  required: ["price", "stockStatus"],
};

interface ProductToScrape {
  url: string;
  productId: number;
  isHighRisk: boolean;
}

export class ScraperService {
  private app: Firecrawl;

  constructor(apiKey: string) {
    this.app = new Firecrawl({ apiKey });
  }

  async batchScrape(products: ProductToScrape[]) {
    const urls = products.map((p) => p.url);
    const isHighRisk = products.some((p) => p.isHighRisk);

    const results = await this.app.batchScrape(urls, {
      options: {
        formats: [
          "markdown",
          {
            type: "json",
            schema: jsonSchema,
            prompt: "Extract the product price and stock status from the page.",
          },
          {
            type: "changeTracking",
            modes: ["json"],
            schema: jsonSchema,
          },
          "screenshot",
        ],
        proxy: isHighRisk ? "stealth" : "basic",
        maxAge: 0,
      },
    });

    return results.data
      .map((result) => {
        const originalProduct = products.find(
          (p) => p.url === result.metadata?.sourceURL
        );

        if (!originalProduct || !result.json || !result.changeTracking) {
          return null;
        }

        const validatedData = ScrapeDataSchema.parse(result.json);
        const changeData = result.changeTracking;

        const typedChangeJson = changeData.json as {
          price?: { previous?: number };
        };

        return {
          productId: originalProduct.productId,
          price: validatedData.price,
          stockStatus: validatedData.stockStatus,
          screenshotUrl: result.screenshot,
          changeStatus: changeData.changeStatus,
          previousPrice: typedChangeJson.price?.previous,
        };
      })
      .filter(Boolean);
  }
}

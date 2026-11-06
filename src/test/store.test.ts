import { describe, expect, it } from "vitest";
import { months, platforms, categories, filterProducts, planPrice, startingPrice, projectSchema } from "@/lib/store";
import type { Bot } from "@/lib/content";
const product: Bot = { id: "1", slug: "telegram-ai-admin", title_fa: "ادمین AI", title_en: "AI admin", short_fa: "", short_en: "", features_fa: [], features_en: [], image_url: "", link: "", created_at: "", sort_order: 1, published: true, platform: "telegram", category: "ai", price_1: 100, price_3: 250, price_6: 450, price_12: 800 };
describe("Store rules", () => {
  it("offers only 1, 3, 6 and 12 months", () => { expect(months).toEqual([1,3,6,12]); expect(months.map(m => planPrice(product,m))).toEqual([100,250,450,800]); });
  it("supports the five requested platforms", () => { expect(platforms.map(p => p.id)).toEqual(["telegram","instagram","bale","eitaa","rubika"]); });
  it("supports the four requested topics", () => { expect(categories.map(c => c.id)).toEqual(expect.arrayContaining(["group","account","ai","business"])); });
  it("never mixes platforms in a filtered selection", () => { expect(filterProducts([product,{ ...product,id:"2",platform:"instagram" }],"telegram","all").map(b => b.id)).toEqual(["1"]); });
  it("combines topic and platform filters", () => { expect(filterProducts([product],"telegram","account")).toEqual([]); expect(filterProducts([product],"telegram","ai")).toHaveLength(1); });
  it("excludes unpublished products", () => { expect(filterProducts([{ ...product,published:false }],"all","all")).toEqual([]); });
  it("does not invent missing prices", () => { expect(startingPrice({ ...product,price_1:null,price_3:null,price_6:null,price_12:null })).toBeNull(); });
  it("rejects invalid project submissions", () => { expect(projectSchema.safeParse({ name:"",contact:"",idea:"",kind:"bot" }).success).toBe(false); });
});
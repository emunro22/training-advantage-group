import { getPublishedWebsiteProducts, type WebsiteProduct } from "./storage";

/** Public-safe product list: only rows an admin has moved all the way to Published. */
export async function getPublishedProductsByCategory(category: string): Promise<WebsiteProduct[]> {
  const products = await getPublishedWebsiteProducts();
  return products.filter((p) => p.category === category);
}

export async function getPublishedProductsByCategories(categories: string[]): Promise<WebsiteProduct[]> {
  const products = await getPublishedWebsiteProducts();
  const set = new Set(categories);
  return products.filter((p) => set.has(p.category));
}

import { apiFetch } from "@/shared/lib";

import { Product } from "../types";

export const getProduct = async (id: string): Promise<Product> => {
  return apiFetch<Product>(`/products/${id}`);
};

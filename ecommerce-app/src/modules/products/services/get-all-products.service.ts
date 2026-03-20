import { apiFetch } from "@/shared/lib";

import { Product } from "../types";

export const getProducts = async (): Promise<Product[]> => {
  return apiFetch<Product[]>("/products");
};

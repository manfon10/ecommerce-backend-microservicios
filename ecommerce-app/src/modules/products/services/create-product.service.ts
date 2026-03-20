import { apiFetch } from "@/shared/lib";

import { CreateProductDto, Product } from "../types";

export const createProduct = async (data: CreateProductDto): Promise<Product> => {
  return apiFetch<Product>(`/products`, { method: "POST", body: JSON.stringify(data) });
};

import { apiFetch } from "@/shared/lib";

import { Product, UpdateProductDto } from "../types";

export const updateProduct = async (id: string, data: UpdateProductDto): Promise<Product> => {
  return apiFetch<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) });
};

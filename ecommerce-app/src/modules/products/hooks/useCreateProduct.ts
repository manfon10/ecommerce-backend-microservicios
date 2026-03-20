import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateProductDto } from "../types";
import { createProduct } from "../services";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductDto } from "../types";
import { updateProduct } from "../services";

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) => updateProduct(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["producs"] });
      qc.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}

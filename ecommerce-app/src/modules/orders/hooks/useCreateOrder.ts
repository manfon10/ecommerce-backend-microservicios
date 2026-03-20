import { useQueryClient, useMutation } from "@tanstack/react-query";

import { CreateOrderDto } from "../types";
import { createOrder } from "../services";

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => createOrder(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

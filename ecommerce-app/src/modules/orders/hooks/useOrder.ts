import { useQuery } from "@tanstack/react-query";

import { getOrder } from "../services";

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}

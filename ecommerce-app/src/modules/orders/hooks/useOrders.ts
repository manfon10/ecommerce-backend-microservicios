import { useQuery } from "@tanstack/react-query";

import { getOrders } from "../services";

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: getOrders });
}

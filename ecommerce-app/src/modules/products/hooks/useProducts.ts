import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services";

export const key = ["products"];

export function useProducts() {
  return useQuery({ queryKey: key, queryFn: getProducts });
}

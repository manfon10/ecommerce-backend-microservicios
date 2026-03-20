import { apiFetch } from "@/shared/lib";

import { Order } from "../types/order.type";

export const getOrders = async (): Promise<Order[]> => {
  return apiFetch<Order[]>("/orders");
};

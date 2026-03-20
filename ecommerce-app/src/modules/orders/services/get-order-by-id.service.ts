import { apiFetch } from "@/shared/lib";

import { Order } from "../types/order.type";

export const getOrder = async (id: string): Promise<Order> => {
  return apiFetch<Order>(`/orders/${id}`);
};

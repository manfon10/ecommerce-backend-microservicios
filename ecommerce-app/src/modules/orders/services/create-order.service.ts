import { apiFetch } from "@/shared/lib";

import { CreateOrderDto, Order } from "../types";

export const createOrder = async (data: CreateOrderDto): Promise<Order> => {
  return apiFetch<Order>(`/orders`, { method: "POST", body: JSON.stringify(data) });
};

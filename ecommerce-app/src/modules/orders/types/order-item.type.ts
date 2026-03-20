export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderItemDto {
  product_id: string;
  quantity: number;
}

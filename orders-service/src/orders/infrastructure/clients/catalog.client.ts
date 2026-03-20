import { OrderItemDto } from "../controllers/dtos";

export interface ProductInfo {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
}

export interface CatalogClient {
  getProduct(product_id: string): Promise<ProductInfo>;
  orderCreated(items: OrderItemDto[]): void;
  validateStock(product_id: string, quantity: number): Promise<void>;
}

export const CATALOG_CLIENT = "CATALOG_CLIENT";

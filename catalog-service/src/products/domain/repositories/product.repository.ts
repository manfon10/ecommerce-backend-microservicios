import { Product } from "../entities";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  decreaseStock(id: string, quantity: number): Promise<void>;
  update(id: string, product: Partial<Product>): Promise<void>;
}

export const PRODUCT_REPOSITORY = "PRODUCT_REPOSITORY";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/products/domain/entities";
import { ProductRepository } from "src/products/domain/repositories";
import { Repository } from "typeorm";
import { ProductEntity } from "../schemas";

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const products = await this.repository.find({ where: { is_active: true } });

    return products.map(Product.fromObject);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findOne({ where: { id } });

    return product ? Product.fromObject(product) : null;
  }

  async create(product: Product): Promise<Product> {
    const row = this.repository.create({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      is_active: product.is_active,
    });

    const productSaved = await this.repository.save(row);

    return Product.fromObject(productSaved);
  }

  async decreaseStock(id: string, quantity: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(ProductEntity)
      .set({ stock: () => `stock - ${quantity}` })
      .where("id = :id", { id })
      .execute();
  }

  async update(id: string, product: Partial<Product>): Promise<void> {
    await this.repository.update({ id }, product);
  }
}

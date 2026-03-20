import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";

import { PRODUCT_REPOSITORY, ProductRepository } from "src/products/domain/repositories";

@Injectable()
export class ValidateStockUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, quantity: number): Promise<true> {
    const product = await this.productRepository.findById(id);

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    if (product.is_active && product.stock <= quantity) {
      throw new BadRequestException(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
    }

    return true;
  }
}

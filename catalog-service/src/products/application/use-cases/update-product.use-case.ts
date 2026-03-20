import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PRODUCT_REPOSITORY, ProductRepository } from "src/products/domain/repositories";

import { CreateProductDto } from "../dtos";

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, dto: Partial<CreateProductDto>): Promise<boolean> {
    const product = await this.productRepository.findById(id);

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    await this.productRepository.update(id, dto);

    return true;
  }
}

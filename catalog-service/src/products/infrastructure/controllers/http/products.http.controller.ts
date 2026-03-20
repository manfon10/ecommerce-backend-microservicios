import { Controller, Get, Post, Patch, Param, Body, ParseUUIDPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";

import { ProductResponseDto, CreateProductDto, UpdateProductDto } from "src/products/infrastructure/controllers/dtos";
import {
  GetAllProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
} from "src/products/application/use-cases";

@ApiTags("products")
@Controller("products")
export class ProductsHttpController {
  constructor(
    private readonly listProducts: GetAllProductsUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "List all active products" })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  findAll() {
    return this.listProducts.execute();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiParam({ name: "id", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404, description: "Product not found" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.getProduct.execute(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a product" })
  @ApiParam({ name: "id", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.updateProduct.execute(id, dto);
  }
}

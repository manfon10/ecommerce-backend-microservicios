import { Controller, Get, Post, Param, Body, ParseUUIDPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";

import { ListOrdersUseCase, GetOrderUseCase, CreateOrderUseCase } from "src/orders/application/use-cases";
import { OrderResponseDto, CreateOrderDto } from "../dtos";

@ApiTags("orders")
@Controller("orders")
export class OrdersHttpController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly createOrder: CreateOrderUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "List all orders" })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findAll() {
    return this.listOrders.execute();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order by ID" })
  @ApiParam({ name: "id", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.getOrder.execute(id);
  }

  @Post()
  @ApiOperation({
    summary: "Create a new order",
    description: "Validates stock in Catalog Service before saving. Snapshots product name and price at order time.",
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  @ApiResponse({ status: 400, description: "Validation error or insufficient stock" })
  @ApiResponse({ status: 502, description: "Could not reach Catalog Service" })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto) {
    return this.createOrder.execute(dto);
  }
}

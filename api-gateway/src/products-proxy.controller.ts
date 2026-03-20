import { Controller, Get, Post, Patch, Param, Body, Inject, HttpCode, HttpStatus } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { firstValueFrom, timeout } from "rxjs";

@ApiTags("products")
@Controller("products")
export class ProductsProxyController {
  constructor(@Inject("CATALOG_SERVICE") private readonly catalog: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: "List all products" })
  async findAll() {
    return firstValueFrom(this.catalog.send("catalog.products.findAll", {}).pipe(timeout(5000)));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  async findOne(@Param("id") id: string) {
    return firstValueFrom(this.catalog.send("catalog.products.findOne", { id }).pipe(timeout(5000)));
  }

  @Post()
  @ApiOperation({ summary: "Create product" })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    return firstValueFrom(this.catalog.send("catalog.products.create", body).pipe(timeout(5000)));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update product" })
  async update(@Param("id") id: string, @Body() body: any) {
    return firstValueFrom(this.catalog.send("catalog.products.update", { id, dto: body }).pipe(timeout(5000)));
  }
}

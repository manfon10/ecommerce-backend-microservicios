import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';

@ApiTags('orders')
@Controller('orders')
export class OrdersProxyController {
  constructor(@Inject('ORDERS_SERVICE') private readonly orders: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  async findAll() {
    return firstValueFrom(
      this.orders.send('orders.findAll', {}).pipe(timeout(5000)),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.orders.send('orders.findOne', { id }).pipe(timeout(5000)),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    return firstValueFrom(
      this.orders.send('orders.create', body).pipe(timeout(5000)),
    );
  }
}

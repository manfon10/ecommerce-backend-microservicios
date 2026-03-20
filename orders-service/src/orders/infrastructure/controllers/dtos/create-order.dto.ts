import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsUUID,
  IsInt,
  IsPositive,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @ApiProperty({ example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: "Juan Pérez", minLength: 2 })
  @IsString()
  @MinLength(2)
  customer_name: string;

  @ApiProperty({ example: "juan@email.com" })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ type: [OrderItemDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

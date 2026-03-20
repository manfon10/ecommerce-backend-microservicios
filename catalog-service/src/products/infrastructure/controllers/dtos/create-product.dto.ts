import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsPositive, IsInt, IsOptional, Min, MinLength } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "Laptop Dell XPS 15", minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: "High-performance laptop with OLED display" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 12000 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50, minimum: 0 })
  @IsInt()
  @Min(0)
  stock: number;
}

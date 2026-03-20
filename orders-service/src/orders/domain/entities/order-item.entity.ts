export class OrderItem {
  constructor(
    public readonly product_name: string,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly product_id: string,
    public readonly id?: string,
  ) {}
}

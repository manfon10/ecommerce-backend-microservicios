export class Product {
  constructor(
    public name: string,
    public description: string | null,
    public price: number,
    public stock: number,
    public is_active?: boolean,
    public created_at?: Date,
    public updated_at?: Date,
    public readonly id?: string,
  ) {}

  static fromObject(object: { [key: string]: any }): Product {
    const { id, name, description, price, stock, created_at, updated_at, is_active } = object;

    return new Product(name, description, price, stock, is_active, created_at, updated_at, id);
  }
}

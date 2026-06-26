export class CreateProductDto {
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  isAvailable?: boolean;
}

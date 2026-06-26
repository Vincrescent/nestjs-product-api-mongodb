import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  stock?: number;
  isAvailable?: boolean;
}

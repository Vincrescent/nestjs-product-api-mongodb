import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.validateCreateProductDto(createProductDto);
    return this.productModel.create(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    this.ensureValidObjectId(id);
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    this.ensureValidObjectId(id);
    this.validateUpdateProductDto(updateProductDto);
    const updated = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Product> {
    this.ensureValidObjectId(id);
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Product not found');
    }
    return deleted;
  }

  async search(query: string): Promise<Product[]> {
    if (!query?.trim()) {
      return [];
    }

    return this.productModel
      .find({ name: { $regex: query, $options: 'i' } })
      .exec();
  }

  private validateCreateProductDto(createProductDto: CreateProductDto): void {
    if (!createProductDto) {
      throw new BadRequestException('Product data is required');
    }
    if (!createProductDto.name || !createProductDto.name.trim()) {
      throw new BadRequestException('Product name is required');
    }
    if (createProductDto.price === undefined || createProductDto.price === null) {
      throw new BadRequestException('Product price is required');
    }
    if (typeof createProductDto.price !== 'number' || createProductDto.price < 0) {
      throw new BadRequestException('Product price must be a non-negative number');
    }
    if (
      createProductDto.stock !== undefined &&
      (typeof createProductDto.stock !== 'number' || createProductDto.stock < 0)
    ) {
      throw new BadRequestException('Stock must be a non-negative number');
    }
    if (
      createProductDto.isAvailable !== undefined &&
      typeof createProductDto.isAvailable !== 'boolean'
    ) {
      throw new BadRequestException('isAvailable must be a boolean');
    }
  }

  private validateUpdateProductDto(updateProductDto: UpdateProductDto): void {
    if (!updateProductDto || Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException('Update data is required');
    }
    if (
      updateProductDto.name !== undefined &&
      (!updateProductDto.name || !updateProductDto.name.trim())
    ) {
      throw new BadRequestException('Product name cannot be empty');
    }
    if (
      updateProductDto.price !== undefined &&
      (typeof updateProductDto.price !== 'number' || updateProductDto.price < 0)
    ) {
      throw new BadRequestException('Product price must be a non-negative number');
    }
    if (
      updateProductDto.stock !== undefined &&
      (typeof updateProductDto.stock !== 'number' || updateProductDto.stock < 0)
    ) {
      throw new BadRequestException('Stock must be a non-negative number');
    }
    if (
      updateProductDto.isAvailable !== undefined &&
      typeof updateProductDto.isAvailable !== 'boolean'
    ) {
      throw new BadRequestException('isAvailable must be a boolean');
    }
  }

  private ensureValidObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Product not found');
    }
  }
}

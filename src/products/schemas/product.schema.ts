import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: String, default: null })
  description?: string;

  @Prop({ type: String, default: null })
  category?: string;

  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

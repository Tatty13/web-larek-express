import { HydratedDocument, model, Schema } from 'mongoose';

import utils from '../../utils';
import { Product } from './types';

const imageSchema = new Schema<Product.Image>(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const productSchema = new Schema<Product.Item>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    unique: true,
    required: true,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
}, { versionKey: false });

productSchema.post('findOneAndDelete', async (product: HydratedDocument<Product.Item> | null) => {
  if (product?.image?.fileName) {
    await utils.file.removePublicImage(product.image.fileName);
  }
});

export default model<Product.Item>('product', productSchema);

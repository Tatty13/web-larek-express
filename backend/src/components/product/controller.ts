import { Request, Response, NextFunction } from 'express';

import utils from '../../utils';
import { PublicImageSaveResult } from '../../utils/file';
import Product from './model';
import { Product as ProductTypes } from './types';

const removeProductImage = async (fileName: string | undefined) => {
  if (fileName) {
    await utils.file.removePublicImage(fileName);
  }
};

const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find().lean();
    res.send({
      items,
      total: items.length,
    });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (
  req: Request<Record<string, never>, unknown, ProductTypes.Item>,
  res: Response,
  next: NextFunction,
) => {
  let publicImage: PublicImageSaveResult | undefined;
  try {
    publicImage = await utils.file.savePublicImage(req.body.image.fileName);
    const product = await Product.create(req.body);
    return res.status(utils.statusCode.CREATED_201).send(product);
  } catch (err) {
    if (publicImage?.copied) {
      try {
        await utils.file.removeImageByPath(publicImage.destination);
      } catch (cleanupError) {
        return next(cleanupError);
      }
    }

    if (utils.errors.mongoose.isConflictError(err)) {
      return next(
        new utils.errors.ConflictError(
          'Товар с таким названием уже существует',
        ),
      );
    }

    if (utils.errors.mongoose.isValidationError(err)) {
      const message = utils.errors.mongoose.createValidationErrorMessage(err);
      return next(new utils.errors.BadRequestError(message));
    }

    return next(err);
  }
};

const deleteProduct = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      throw new utils.errors.NotFoundError('Товар не найден');
    }
    return res.send(product);
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async (
  req: Request<
    { productId: string },
    unknown,
    Partial<ProductTypes.Item>
  >,
  res: Response,
  next: NextFunction,
) => {
  let publicImage: PublicImageSaveResult | undefined;
  let oldImageFileName: string | undefined;
  let isProductUpdated = false;
  try {
    const existingProduct = await Product.findById(req.params.productId);
    if (!existingProduct) {
      throw new utils.errors.NotFoundError('Товар не найден');
    }

    const update = req.body;
    if (update.image && update.image.fileName !== existingProduct.image.fileName) {
      oldImageFileName = existingProduct.image.fileName;
      publicImage = await utils.file.savePublicImage(update.image.fileName);
    }

    const product = await Product.findByIdAndUpdate(req.params.productId, update, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new utils.errors.NotFoundError('Товар не найден');
    }
    isProductUpdated = true;

    if (oldImageFileName) {
      await removeProductImage(oldImageFileName);
    }
    return res.send(product);
  } catch (err) {
    if (!isProductUpdated && publicImage?.copied) {
      try {
        await utils.file.removeImageByPath(publicImage.destination);
      } catch (cleanupError) {
        return next(cleanupError);
      }
    }

    if (utils.errors.mongoose.isConflictError(err)) {
      return next(
        new utils.errors.ConflictError(
          'Товар с таким названием уже существует',
        ),
      );
    }

    if (utils.errors.mongoose.isValidationError(err)) {
      const message = utils.errors.mongoose.createValidationErrorMessage(err);
      return next(new utils.errors.BadRequestError(message));
    }
    return next(err);
  }
};

const controllerProduct = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
};

export default controllerProduct;

import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

import utils from '../../utils';
import Product from '../product/model';

interface CreateOrderRequest {
  items: string[];
  total: number;
}

const createOrder = async (
  req: Request<Record<string, never>, unknown, CreateOrderRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    const products = await Product.find({ _id: { $in: items } })
      .select('price')
      .lean();
    const productsById = new Map(
      products.map((product) => [String(product._id), product]),
    );

    const currentTotal = items.reduce((sum, itemId) => {
      const product = productsById.get(itemId);

      if (!product) {
        throw new utils.errors.NotFoundError(`Товар с id ${itemId} не найден`);
      }
      if (product.price === null || product.price === undefined) {
        throw new utils.errors.BadRequestError(
          `Товар с id ${itemId} недоступен для заказа`,
        );
      }

      return sum + product.price;
    }, 0);

    if (total !== currentTotal) {
      throw new utils.errors.BadRequestError(
        'Сумма заказа не совпадает со стоимостью товаров',
      );
    }

    res.status(utils.statusCode.CREATED_201).send({ id: randomUUID(), total });
  } catch (err) {
    next(err);
  }
};

const controllerOrder = {
  createOrder,
};

export default controllerOrder;

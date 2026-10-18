import { Router } from 'express';

import middlewares from '../../middlewares';
import validatorProduct from './validator';
import controllerProduct from './controller';

const routerProduct = Router();

routerProduct.get('/', controllerProduct.getProducts);

routerProduct.post(
  '/',
  middlewares.auth,
  validatorProduct.validateProduct,
  controllerProduct.createProduct,
);

routerProduct.patch(
  '/:productId',
  middlewares.auth,
  validatorProduct.validateProductUpdate,
  controllerProduct.updateProduct,
);

routerProduct.delete(
  '/:productId',
  middlewares.auth,
  controllerProduct.deleteProduct,
);

export default routerProduct;

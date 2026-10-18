import { Router } from 'express';

import validatorOrder from './validator';
import controllerOrder from './controller';

const routerOrder = Router();

routerOrder.post(
  '/',
  validatorOrder.validateOrder,
  controllerOrder.createOrder,
);

export default routerOrder;

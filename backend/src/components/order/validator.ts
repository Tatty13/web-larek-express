import { celebrate, Joi, Segments } from 'celebrate';

import utils from '../../utils';
import { Order } from './types';

const orderSchema = Joi.object({
  items: Joi.array().items(Joi.string().required()).min(1).required(),
  total: Joi.number().min(0).precision(2).required(),
  payment: Joi.string()
    .valid(Order.PaymentMethod.Card, Order.PaymentMethod.Online)
    .required(),
  email: Joi.string().pattern(utils.regExp.email).required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

const validateOrder = celebrate({
  [Segments.BODY]: orderSchema,
});

const validatorOrder = {
  validateOrder,
};

export default validatorOrder;

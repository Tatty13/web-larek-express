import { celebrate, Joi, Segments } from 'celebrate';

const productSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).precision(2).optional()
    .allow(null),
});

const validateProduct = celebrate({
  [Segments.BODY]: productSchema,
});

const validateProductUpdate = celebrate({
  [Segments.BODY]: productSchema
    .fork(['title', 'image', 'category'], (field) => field.optional())
    .min(1),
});

const validatorProduct = {
  validateProduct,
  validateProductUpdate,
};

export default validatorProduct;

import { celebrate, Joi, Segments } from 'celebrate';

import utils from '../../utils';

const joiName = Joi.string().min(2).max(30);
const joiPassword = Joi.string().min(6).required();
const joiEmail = Joi.string().pattern(utils.regExp.email).required();

const credentialsSchema = {
  email: joiEmail,
  password: joiPassword,
};

const loginSchema = Joi.object(credentialsSchema);

const registrationSchema = Joi.object({
  name: joiName,
  ...credentialsSchema,
});

const validateUserCredentialOnLogin = celebrate({
  [Segments.BODY]: loginSchema,
});

const validateUserCredentialOnRegister = celebrate({
  [Segments.BODY]: registrationSchema,
});

const validatorAuth = {
  validateUserCredentialOnRegister,
  validateUserCredentialOnLogin,
};

export default validatorAuth;

import AuthError from './authError';
import BadRequestError from './badRequestError';
import ConflictError from './conflictError';
import CustomError from './customError';
import ForbiddenError from './forbiddenError';
import utilsMongoose from './mongoos';
import NotFoundError from './notFoundError';
import ValidationError from './validationError';

const isCustomError = (error: Error): error is CustomError => error instanceof CustomError;

const utilsErrors = {
  CustomError,
  AuthError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  isCustomError,
  mongoose: utilsMongoose,
};

export default utilsErrors;

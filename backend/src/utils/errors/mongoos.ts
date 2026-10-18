import { Error as MongooseError } from 'mongoose';

const createValidationErrorMessage = (
  err: MongooseError.ValidationError,
): string => {
  const { errors } = err;
  const messages = Object.values(errors).map((error) => error.message);
  return messages.join('. ');
};

const createCastErrorMessage = (err: MongooseError.CastError): string => {
  const message = `"${err.value}" incorrect. ${err.reason?.message} || "Неверный формат данных"`;
  return message;
};

const isValidationError = (
  err: unknown,
): err is MongooseError.ValidationError => err instanceof MongooseError.ValidationError;

const isCastError = (
  err: unknown,
): err is MongooseError.CastError => err instanceof MongooseError.CastError;

const isConflictError = (err: unknown): err is MongooseError => err instanceof MongooseError && 'code' in err && err.code === 11000;

const utilsMongoose = {
  isValidationError,
  createValidationErrorMessage,
  isCastError,
  createCastErrorMessage,
  isConflictError,
};

export default utilsMongoose;

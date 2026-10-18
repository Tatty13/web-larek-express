import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

import utils from '../utils';

const handleCelebrateErrors = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    const [errData] = err.details.values().next().value?.details || [];
    return next(new utils.errors.BadRequestError(errData.message));
  }

  return next(err);
};

const handleMulterErrors = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (utils.errors.multer.isMulterError(err)) {
    const message = utils.errors.multer.isLimitError(err)
      ? 'Размер файла не должен превышать 5 МБ'
      : 'Не удалось загрузить файл';
    return next(new utils.errors.BadRequestError(message));
  }

  return next(err);
};

const handleError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = utils.errors.isCustomError(err)
    ? err.statusCode
    : utils.statusCode.INTERNAL_SERVER_ERROR_500;
  const message = err.message || 'На сервере произошла ошибка';

  return res.status(statusCode).send({ message });
};

const errorMiddleware = {
  handleCelebrateErrors,
  handleMulterErrors,
  handleError,
};

export default errorMiddleware;

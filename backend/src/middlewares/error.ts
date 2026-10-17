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
    next(new utils.errors.BadRequestError(errData.message));
    return;
  }

  next(err);
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

  res.status(statusCode).send({ message });
};

const errorMiddleware = {
  handleCelebrateErrors,
  handleError,
};

export default errorMiddleware;

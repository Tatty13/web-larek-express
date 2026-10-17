import { Request, Response, NextFunction } from 'express';

import utils from '../../utils';

function handleUnknownRoute(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new utils.errors.NotFoundError('Страница не найдена'));
}

const controllerNotFound = {
  handleUnknownRoute,
};

export default controllerNotFound;

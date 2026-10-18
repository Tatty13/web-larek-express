import { Request, Response, NextFunction } from 'express';

import utils from '../../utils';

function handleUnknownRoute(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new utils.errors.NotFoundError('Путь не найден'));
}

const controllerNotFound = {
  handleUnknownRoute,
};

export default controllerNotFound;

import { Router } from 'express';

import controllerNotFound from './controller';

const routerNotFound = Router();

routerNotFound.use('*', controllerNotFound.handleUnknownRoute);

export default routerNotFound;

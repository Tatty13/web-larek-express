import { Router } from 'express';

import middlewares from '../../middlewares';
import controllerUpload from './controller';

const routerUpload = Router();

routerUpload.post(
  '/',
  middlewares.auth,
  middlewares.file.single('file'),
  controllerUpload.uploadFile,
);

export default routerUpload;

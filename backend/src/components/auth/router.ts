import { Router } from 'express';

import middlewares from '../../middlewares';
import validatorAuth from './validator';
import controllerAuth from './controller';

const routerAuth = Router();

routerAuth.post('/login', validatorAuth.validateUserCredentialOnLogin, controllerAuth.login);
routerAuth.post('/register', validatorAuth.validateUserCredentialOnRegister, controllerAuth.register);
routerAuth.get('/logout', controllerAuth.logout);
routerAuth.get('/user', middlewares.auth, controllerAuth.getCurrentUser);
routerAuth.get('/token', controllerAuth.refreshAccessToken);

export default routerAuth;

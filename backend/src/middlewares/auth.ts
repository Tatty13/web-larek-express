import { Response, NextFunction } from 'express';

import { Auth } from '../components/auth/types';
import configs from '../configs';
import utils from '../utils';

const isBearerToken = (token: string): boolean => token.startsWith('Bearer ');
const getTokenFromHeader = (authorization: string): string => authorization.split(' ')[1];

function auth(req: Auth.SessionRequest, _res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization || !isBearerToken(authorization)) {
    throw new utils.errors.AuthError('Требуется авторизация');
  }

  const token = getTokenFromHeader(authorization);
  const payload = utils.token.verifyToken(token, configs.env.accessToken.secret!);

  req.user = payload;

  return next();
}

export default auth;

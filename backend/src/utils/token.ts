import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

import utilsErrors from './errors';

const verifyToken = (token: string, secret: string): {_id: string} => {
  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    throw new utilsErrors.AuthError('Передан невалидный токен');
  }

  const userId = payload?._id;

  if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
    throw new utilsErrors.BadRequestError('Некорректный идентификатор пользователя');
  }

  return { _id: userId };
};

const utilsToken = {
  verifyToken,
};

export default utilsToken;

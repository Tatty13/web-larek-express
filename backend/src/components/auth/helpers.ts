import bcrypt from 'bcryptjs';
import { CookieOptions } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

import configs from '../../configs';
import utils from '../../utils';
import { Auth } from './types';

const cookieOptionsToken: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: ms(configs.env.refreshToken.maxAge as ms.StringValue),
  path: '/',
};

const DEFAULT_USER_NAME = 'Ё-мое';

const generateHash = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

const checkPassword = async (password: string, hash: string) => {
  const isIdentic = await bcrypt.compare(password, hash);
  return isIdentic;
};

async function findUserByCredentials(
  this: Auth.UserModel,
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).select('+password +tokens');
  if (!user) throw new utils.errors.AuthError('Неправильные почта или пароль');

  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) throw new utils.errors.AuthError('Неправильные почта или пароль');

  return user;
}

const generateRefreshToken = (payload: { _id: string }) => {
  const refreshToken = jwt.sign(
    payload,
    configs.env.refreshToken.secret!,
    { expiresIn: configs.env.refreshToken.maxAge as SignOptions['expiresIn'] },
  );
  return refreshToken;
};

const generateAccessToken = (payload: { _id: string }) => {
  const accessToken = jwt.sign(
    payload,
    configs.env.accessToken.secret!,
    { expiresIn: configs.env.accessToken.maxAge as SignOptions['expiresIn'] },
  );
  return accessToken;
};

const helpersAuth = {
  cookieOptionsToken,
  DEFAULT_USER_NAME,
  findUserByCredentials,
  generateHash,
  generateRefreshToken,
  generateAccessToken,
};

export default helpersAuth;

import { Request, Response, NextFunction } from 'express';

import utils from '../../utils';
import configs from '../../configs';
import User from './model';
import { Auth } from './types';
import helpersAuth from './helpers';

const login = async (
  req: Request<Record<string, never>, unknown, Auth.LoginRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const payload = { _id: user._id.toString() };
    const accessToken = helpersAuth.generateAccessToken(payload);
    const refreshToken = helpersAuth.generateRefreshToken(payload);

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, helpersAuth.cookieOptionsToken);

    return res.send({
      user: {
        email,
        name: user.name,
      },
      accessToken,
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

const register = async (
  req: Request<Record<string, never>, unknown, Auth.RegisterRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name = helpersAuth.DEFAULT_USER_NAME } = req.body;

    const hash = await helpersAuth.generateHash(password);
    const user = await User.create({ email, name, password: hash });

    const payload = { _id: user._id.toString() };
    const accessToken = helpersAuth.generateAccessToken(payload);
    const refreshToken = helpersAuth.generateRefreshToken(payload);

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, helpersAuth.cookieOptionsToken);

    return res.status(utils.statusCode.CREATED_201).send({
      user: {
        email,
        name: user.name,
      },
      accessToken,
      success: true,
    });
  } catch (err) {
    if (utils.errors.mongoose.isConflictError(err)) {
      return next(
        new utils.errors.ConflictError(
          'Пользователь с указанным email уже существует',
        ),
      );
    }

    if (utils.errors.mongoose.isValidationError(err)) {
      const message = utils.errors.mongoose.createValidationErrorMessage(err);
      return next(new utils.errors.BadRequestError(message));
    }

    return next(err);
  }
};

const logout = async (
  req: Auth.SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new utils.errors.AuthError('Требуется авторизация');
    }

    const payload = utils.token.verifyToken(
      refreshToken,
      configs.env.refreshToken.secret!,
    );
    const user = await User.findById(payload._id).select('+tokens');

    if (!user) {
      throw new utils.errors.NotFoundError('Пользователь не найден');
    }

    const storedToken = user.tokens.find(({ token }) => token === refreshToken);
    if (!storedToken) {
      throw new utils.errors.AuthError('Refresh-токен недействителен');
    }

    user.tokens = user.tokens.filter(({ token }) => token !== refreshToken);
    await user.save();

    res.clearCookie('refreshToken', helpersAuth.cookieOptionsToken);
    return res.send({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = async (
  req: Auth.SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new utils.errors.NotFoundError('Пользователь не найден');
    }

    return res.send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

const refreshAccessToken = async (
  req: Auth.SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new utils.errors.AuthError('Требуется авторизация');
    }

    const payload = utils.token.verifyToken(
      refreshToken,
      configs.env.refreshToken.secret!,
    );

    const user = await User.findById(payload._id).select('+tokens');

    if (!user) {
      throw new utils.errors.NotFoundError('Пользователь не найден');
    }

    const storedToken = user.tokens.find(({ token }) => token === refreshToken);
    if (!storedToken) {
      throw new utils.errors.AuthError('Refresh-токен недействителен');
    }

    user.tokens = user.tokens.filter(({ token }) => token !== refreshToken);

    const accessToken = helpersAuth.generateAccessToken({
      _id: user._id.toString(),
    });
    const newRefreshToken = helpersAuth.generateRefreshToken({
      _id: user._id.toString(),
    });
    user.tokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('refreshToken', newRefreshToken, helpersAuth.cookieOptionsToken);

    return res.send({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

const controllerAuth = {
  login,
  register,
  logout,
  getCurrentUser,
  refreshAccessToken,
};

export default controllerAuth;

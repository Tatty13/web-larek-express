import { Request } from 'express';
import { HydratedDocument, Model } from 'mongoose';

export namespace Auth {
  export type Token = {
    token: string;
  };

  export interface User {
    name?: string;
    email: string;
    password: string;
    tokens: Token[];
  }

  export interface UserModel extends Model<User> {
    findUserByCredentials(
      email: string,
      password: string,
    ): Promise<HydratedDocument<User>>;
  }

  export interface SessionRequest extends Request {
    user?: { _id?: string };
  }

  export type LoginRequestBody = Pick<Auth.User, 'email' | 'password'>;

  export type RegisterRequestBody = LoginRequestBody & Pick<Auth.User, 'name'>;
}

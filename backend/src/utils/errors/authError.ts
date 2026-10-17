import statusCode from '../statusCode';
import CustomError from './customError';

class AuthError extends CustomError {
  constructor(message: string) {
    super(message, statusCode.UNAUTHORIZED_401, 'AuthError');
  }
}

export default AuthError;

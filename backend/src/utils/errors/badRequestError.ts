import statusCode from '../statusCode';
import CustomError from './customError';

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, statusCode.BAD_REQUEST_400, 'BadRequestError');
  }
}

export default BadRequestError;

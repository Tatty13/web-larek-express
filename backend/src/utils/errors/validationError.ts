import statusCode from '../statusCode';
import CustomError from './customError';

class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, statusCode.BAD_REQUEST_400, 'ValidationError');
  }
}

export default ValidationError;

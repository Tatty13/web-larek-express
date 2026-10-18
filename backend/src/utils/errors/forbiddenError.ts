import statusCode from '../statusCode';
import CustomError from './customError';

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, statusCode.FORBIDDEN_403, 'ForbiddenError');
  }
}

export default ForbiddenError;

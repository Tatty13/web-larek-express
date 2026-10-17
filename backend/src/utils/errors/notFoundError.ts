import statusCode from '../statusCode';
import CustomError from './customError';

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, statusCode.NOT_FOUND_404, 'NotFoundError');
  }
}

export default NotFoundError;

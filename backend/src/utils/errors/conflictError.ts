import statusCode from '../statusCode';
import CustomError from './customError';

class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, statusCode.CONFLICT_409, 'ConflictError');
  }
}

export default ConflictError;

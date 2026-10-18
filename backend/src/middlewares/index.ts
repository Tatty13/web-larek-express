import auth from './auth';
import error from './error';
import file from './file';
import logger from './logger';

const middlewares = {
  logger,
  error,
  auth,
  file,
};

export default middlewares;

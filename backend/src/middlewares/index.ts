import auth from './auth';
import error from './error';
import logger from './logger';

const middlewares = {
  logger,
  error,
  auth,
};

export default middlewares;

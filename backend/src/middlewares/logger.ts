import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';

const logFolderPath = '../logs';

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, logFolderPath, 'request.log'),
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, logFolderPath, 'error.log'),
    }),
  ],
  format: winston.format.json(),
});

const loggerMiddleware = {
  requestLogger,
  errorLogger,
};

export default loggerMiddleware;

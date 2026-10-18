import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

import configs from './configs';
import middlewares from './middlewares';
import router from './router';
import utils from './utils';

const app = express();

app.use(configs.limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.logger.requestLogger);
app.use(
  cors({
    origin: configs.env.originAllow,
    credentials: true,
  }),
);
app.use(router);
app.use(middlewares.logger.errorLogger);

app.use(middlewares.error.handleCelebrateErrors);
app.use(middlewares.error.handleMulterErrors);
app.use(middlewares.error.handleError);

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(configs.env.dbAddress);
    await utils.file.startTempUploadCleanup();
  } catch (error) {
    const message = error instanceof Error ? error.stack ?? error.message : String(error);
    process.stderr.write(`Не удалось запустить сервер:\n${message}\n`);
    process.exitCode = 1;
    return;
  }

  app.listen(configs.env.port);
};

startServer();

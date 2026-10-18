import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

import configs from './configs';
import middlewares from './middlewares';
import router from './router';

const app = express();
mongoose.connect(configs.env.dbAddress);

app.use(configs.limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.logger.requestLogger);
app.use(cors({
  origin: configs.env.originAllow,
  credentials: true,
}));
app.use(router);
app.use(middlewares.logger.errorLogger);

app.use(middlewares.error.handleCelebrateErrors);
app.use(middlewares.error.handleError);

app.listen(configs.env.port);

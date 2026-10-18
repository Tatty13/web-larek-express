import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
  port: process.env.PORT ?? 5000,
  dbAddress: process.env.DB_ADDRESS ?? '',
  originAllow: process.env.ORIGIN_ALLOW ?? 'http://localhost:5173',
  accessToken: {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    maxAge: process.env.AUTH_ACCESS_TOKEN_EXPIRY ?? '10m',
  },
  refreshToken: {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    maxAge: process.env.AUTH_REFRESH_TOKEN_EXPIRY ?? '7d',
  },

};

export default envConfig;

import dotenv from 'dotenv';
import ms from 'ms';

dotenv.config();

const envConfig = {
  port: process.env.PORT ?? 5000,
  dbAddress: process.env.DB_ADDRESS ?? '',
  originAllow: process.env.ORIGIN_ALLOW ?? 'http://localhost:5173',
  uploadPath: process.env.UPLOAD_PATH ?? 'images',
  uploadPathTemp: process.env.UPLOAD_PATH_TEMP ?? 'temp',
  accessToken: {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    maxAge: process.env.AUTH_ACCESS_TOKEN_EXPIRY ?? '10m',
  },
  refreshToken: {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    maxAge: process.env.AUTH_REFRESH_TOKEN_EXPIRY ?? '7d',
  },
  tempFileMaxAgeMs: ms((process.env.TEMP_FILE_MAX_AGE ?? '24h') as ms.StringValue),
};

export default envConfig;

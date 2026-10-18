import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import multer from 'multer';

import utils from '../utils';

const imageExtensions: Record<string, string> = {
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage: multer.Options['storage'] = multer.diskStorage({
  destination: (_req, _file, callback) => {
    mkdir(utils.file.TEMP_UPLOAD_DIR, { recursive: true })
      .then(() => callback(null, utils.file.TEMP_UPLOAD_DIR))
      .catch((err: Error) => callback(err, ''));
  },
  filename: (_req, file, callback) => {
    callback(
      null,
      `${randomUUID()}${imageExtensions[file.mimetype] ?? '.bin'}`,
    );
  },
});

const limits: multer.Options['limits'] = {
  fileSize: 5 * 1024 * 1024,
  files: 1,
};

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  if (!imageExtensions[file.mimetype]) {
    callback(
      new utils.errors.BadRequestError(
        'Допустимы только изображения JPEG, PNG, GIF и WebP',
      ),
    );
    return;
  }

  callback(null, true);
};

const fileMiddleware = multer({
  storage,
  limits,
  fileFilter,
});

export default fileMiddleware;

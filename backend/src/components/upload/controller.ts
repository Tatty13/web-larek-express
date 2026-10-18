import type { Express } from 'express';
import { Request, Response, NextFunction } from 'express';

import utils from '../../utils';

const uploadFile = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    Record<string, never>,
    { file?: Express.Multer.File }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw new utils.errors.BadRequestError(
        'Необходимо передать файл в поле file',
      );
    }

    return res.send({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (err) {
    return next(err);
  }
};

const controllerUpload = {
  uploadFile,
};

export default controllerUpload;

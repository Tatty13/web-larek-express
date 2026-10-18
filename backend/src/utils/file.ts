import { constants } from 'node:fs';
import {
  access, copyFile, mkdir, rm, readdir, stat,
} from 'node:fs/promises';
import path from 'node:path';
import cron from 'node-cron';

import configs from '../configs';
import utilsErrors from './errors';
import utilsRegExp from './regExp';

const TEMP_UPLOAD_DIR = path.join(__dirname, '..', 'temp', 'uploads');
const PUBLIC_IMAGE_DIR = path.join(__dirname, '..', 'public', 'images');

export type PublicImageSaveResult = {
  destination: string;
  copied: boolean;
};

const removeImageByPath = async (filePath: string): Promise<void> => {
  await rm(filePath, { force: true });
};

const savePublicImage = async (
  fileName: string,
): Promise<PublicImageSaveResult> => {
  const match = utilsRegExp.imageName.exec(fileName);
  if (!match) {
    throw new utilsErrors.BadRequestError(
      'Некорректное имя загруженного файла',
    );
  }

  await mkdir(PUBLIC_IMAGE_DIR, { recursive: true });
  const [filename] = match.slice(1);
  const tempImagePath = path.join(TEMP_UPLOAD_DIR, filename);
  const destination = path.join(PUBLIC_IMAGE_DIR, filename);

  try {
    await copyFile(tempImagePath, destination, constants.COPYFILE_EXCL);
  } catch (err) {
    if (!(err instanceof Error) || !('code' in err)) {
      throw err;
    }

    if (err.code === 'ENOENT') {
      try {
        await access(destination);
        return { destination, copied: false };
      } catch (destinationError) {
        if (
          destinationError instanceof Error
          && 'code' in destinationError
          && destinationError.code !== 'ENOENT'
        ) {
          throw destinationError;
        }
        throw new utilsErrors.BadRequestError('Загруженный файл не найден');
      }
    }

    throw err;
  }

  try {
    await rm(tempImagePath);
  } catch (err) {
    await removeImageByPath(destination);
    throw err;
  }
  return { destination, copied: true };
};

const removePublicImage = async (fileName: string): Promise<void> => {
  const folderName = '/images/';
  if (!fileName.startsWith(folderName)) return;
  const filename = fileName.slice(folderName.length);
  if (!filename || path.basename(filename) !== filename) return;

  await removeImageByPath(path.join(PUBLIC_IMAGE_DIR, filename));
};

const cleanupTempUploads = async (): Promise<void> => {
  await mkdir(TEMP_UPLOAD_DIR, { recursive: true });
  const entries = await readdir(TEMP_UPLOAD_DIR, { withFileTypes: true });
  const cutoff = Date.now() - configs.env.tempFileMaxAgeMs;

  await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const filePath = path.join(TEMP_UPLOAD_DIR, entry.name);
        const fileStats = await stat(filePath);
        if (fileStats.mtimeMs < cutoff) {
          await rm(filePath);
        }
      }),
  );
};

/** очищаем файлы при запуске, далее раз в сутки в полночь */
const startTempUploadCleanup = (): void => {
  cron.schedule('0 0 * * *', async () => {
    await cleanupTempUploads();
  });

  cleanupTempUploads();
};

const utilsFile = {
  TEMP_UPLOAD_DIR,
  savePublicImage,
  removePublicImage,
  removeImageByPath,
  cleanupTempUploads,
  startTempUploadCleanup,
};

export default utilsFile;

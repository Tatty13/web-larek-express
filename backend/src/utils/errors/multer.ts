import multer from 'multer';

const isMulterError = (err: unknown): err is multer.MulterError => (
  err instanceof multer.MulterError
);

const isLimitError = (err: multer.MulterError) => err.code === 'LIMIT_FILE_SIZE';

const utilsMulter = {
  isMulterError,
  isLimitError,
};

export default utilsMulter;

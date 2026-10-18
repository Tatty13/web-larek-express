import utilsErrors from './errors';
import utilsFile from './file';
import utilsRegExp from './regExp';
import utilsStatusCode from './statusCode';
import utilsToken from './token';

const utils = {
  statusCode: utilsStatusCode,
  errors: utilsErrors,
  regExp: utilsRegExp,
  token: utilsToken,
  file: utilsFile,
};
export default utils;

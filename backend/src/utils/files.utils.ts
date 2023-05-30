import { Options } from 'multer';
import { MaxSizeIconFile } from '../constants/s3.constants';

export const multerIconFileConfig: Options = {
  limits: {
    fileSize: MaxSizeIconFile,
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /svg/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('svg files only'));
    }
  },
};

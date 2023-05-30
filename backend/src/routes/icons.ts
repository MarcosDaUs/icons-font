import { Router } from 'express';
import { body, query } from 'express-validator';
import multer from 'multer';
import {
  isRelativeFolderOrIconPath,
  isRelativeFolderPath,
  isRelativeIconPath,
} from '../utils/objects.utils';
import { multerIconFileConfig } from '../utils/files.utils';
import {
  getAllIcons,
  createIcon,
  deleteIcon,
  updateIcon,
  checkFontIcon,
} from '../controllers/icons';

const router: Router = Router();

router.get(
  '/',
  query('path')
    .optional({ checkFalsy: true })
    .isString()
    .custom(isRelativeFolderOrIconPath),
  getAllIcons
);

router.post(
  '/',
  multer(multerIconFileConfig).single('file'),
  body('name')
    .isString()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ min: 3, max: 50 }),
  body('folderPath')
    .optional({ checkFalsy: true })
    .isString()
    .custom(isRelativeFolderPath),
  createIcon
);

router.delete(
  '/',
  body('path').isString().notEmpty().custom(isRelativeIconPath),
  deleteIcon
);

router.put(
  '/',
  multer(multerIconFileConfig).single('file'),
  body('name')
    .isString()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ min: 3, max: 50 }),
  body('oldPath').isString().notEmpty().custom(isRelativeIconPath),
  updateIcon
);

router.get(
  '/font',
  query('icon')
    .isString()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ min: 3, max: 50 }),
  checkFontIcon
);

export default router;

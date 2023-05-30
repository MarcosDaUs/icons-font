import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import { Item } from '../types/icons.types';
import {
  convertToRealBucketPath,
  convertToRelativeBucketPath,
  getCommonPrefixWithSameName,
  getCommonPrefixesOfListResponseBucket,
  getContentsObjectsOfListResponseBucket,
  getMessageOfServiceError,
} from '../utils/s3.utils';
import {
  changeObjectNameInPath,
  getIconObject,
  getNewPath,
  getObjectNameOfPath,
  isFolderPath,
  removeIconNameExtension,
} from '../utils/objects.utils';
import {
  createS3Object,
  deleteS3Object,
  getAllS3Objects,
  updateS3FileObject,
} from '../services/s3.services';
import { getCloudFrontCSSFile } from '../services/cloudfront.services';

export const getAllIcons = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 400)
    );
  }
  const queryPath =
    typeof req?.query?.path === 'string' ? req?.query?.path : '';
  const targetItem = getObjectNameOfPath(queryPath);

  getAllS3Objects({
    path: queryPath,
  })
    .then((response) => {
      const objects = getContentsObjectsOfListResponseBucket(response);
      const bucketItems: Item[] = [];

      if (objects.length === 0) {
        res.json({
          items: bucketItems,
        });
        return;
      }
      objects.forEach((bucketObject) => {
        let objectPath = bucketObject?.Key ?? '';
        if (objectPath) {
          const isFolder = isFolderPath(objectPath);
          objectPath = convertToRelativeBucketPath(objectPath);
          const pathArray = objectPath.split('/');

          const foldersIndex: number[] = [];
          const pathArrayLength = pathArray?.length ?? 0;
          const isInRootFolder = pathArrayLength === 1;

          pathArray?.forEach((name, index) => {
            if (name) {
              if (!isInRootFolder && index === 0) {
                const bucketItemIndex = bucketItems.findIndex(
                  (item) => item.name === name
                );

                if (bucketItemIndex < 0) {
                  bucketItems.push({
                    name: name,
                    isTarget: name === targetItem,
                    path: getNewPath(pathArray, index, true),
                    isFolder: true,
                    icon: '',
                    items: [],
                  });
                  foldersIndex.push(bucketItems?.length - 1);
                } else {
                  foldersIndex.push(bucketItemIndex);
                }
              } else if (isInRootFolder && index === 0) {
                const newIconName = removeIconNameExtension(name);
                const newIconPath = getNewPath(pathArray, index, isFolder);
                bucketItems.push(
                  getIconObject(newIconName, newIconPath, name === targetItem)
                );
              } else {
                let bucketItem: Item | undefined = undefined;

                foldersIndex.forEach((folderIndex, index) => {
                  if (index === 0) {
                    bucketItem =
                      folderIndex < bucketItems.length
                        ? bucketItems[folderIndex]
                        : undefined;
                  } else {
                    const length = bucketItem?.items?.length ?? 0;
                    bucketItem =
                      Boolean(bucketItem?.isFolder) &&
                      bucketItem?.items &&
                      folderIndex < length
                        ? bucketItem?.items[folderIndex]
                        : undefined;
                  }
                });

                if (!isFolder && index === pathArrayLength - 1) {
                  const newIconName = removeIconNameExtension(name);
                  const newIconPath = getNewPath(pathArray, index, isFolder);

                  if (bucketItem !== undefined)
                    (bucketItem as unknown as Item).items.push(
                      getIconObject(
                        newIconName,
                        newIconPath,
                        name === targetItem
                      )
                    );
                } else {
                  const bucketItemIndex = (
                    bucketItem as unknown as Item
                  )?.items?.findIndex((item) => item.name === name);

                  if (bucketItemIndex < 0) {
                    (bucketItem as unknown as Item)?.items?.push({
                      name: name,
                      isTarget: name === targetItem,
                      path: getNewPath(pathArray, index, true),
                      isFolder: true,
                      items: [],
                      icon: '',
                    });
                    foldersIndex.push(
                      (bucketItem as unknown as Item)?.items?.length - 1
                    );
                  } else {
                    foldersIndex.push(bucketItemIndex);
                  }
                }
              }
            }
          });
        }
      });

      res.json({
        data: bucketItems,
      });
    })
    .catch(() => {
      return next(
        new HttpError(
          'Something went wrong, could not find gallery items.',
          500
        )
      );
    });
};

export const createIcon = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req?.file) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 400)
    );
  }
  const file = req.file;
  const name = req.body.name;
  const iconName = `${name}.svg`;
  const folderPath = req.body?.folderPath ?? '';

  getAllS3Objects({
    path: '',
    Delimiter: '.svg',
  })
    .then((response) => {
      const commonPrefixes = getCommonPrefixesOfListResponseBucket(response);
      const commonPrefixWithSameName = getCommonPrefixWithSameName(
        commonPrefixes,
        iconName
      );
      if (commonPrefixWithSameName) {
        return next(
          new HttpError(
            `An icon with name ${req.body.name} already exists`,
            400
          )
        );
      }

      getAllS3Objects({ path: folderPath })
        .then((response) => {
          const objects = getContentsObjectsOfListResponseBucket(response);
          if (objects.length === 0) {
            return next(new HttpError('Path no exist.', 400));
          }

          createS3Object({
            path: folderPath,
            name: name,
            file,
          })
            .then(() => {
              const newIconPath = `${folderPath}${iconName}`;
              res.json({
                data: getIconObject(name, newIconPath),
              });
            })
            .catch(() => {
              return next(
                new HttpError('Creating icon failed, please try again.', 500)
              );
            });
        })
        .catch(() => {
          return next(
            new HttpError('Creating icon failed, please try again.', 500)
          );
        });
    })
    .catch(() => {
      return next(
        new HttpError('Creating icon failed, please try again.', 500)
      );
    });
};

export const deleteIcon = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 400)
    );
  }

  const iconPath = req.body?.path;
  const validIconPath = convertToRealBucketPath(iconPath);
  const iconName = removeIconNameExtension(getObjectNameOfPath(iconPath));

  getAllS3Objects({
    path: iconPath,
  })
    .then((response) => {
      const objects = getContentsObjectsOfListResponseBucket(response);
      if (objects.length === 0) {
        return next(new HttpError('Path no exist.', 400));
      }
      if (
        objects.length !== 1 ||
        (objects.length === 1 && objects[0]?.Key !== validIconPath)
      ) {
        return next(new HttpError('Corrupt icon or path.', 400));
      }

      deleteS3Object({ path: iconPath })
        .then(() => {
          res.json({
            data: getIconObject(iconName, iconPath),
          });
        })
        .catch(() => {
          return next(
            new HttpError('Deleting icon failed, please try again.', 500)
          );
        });
    })
    .catch(() => {
      return next(
        new HttpError('Deleting icon failed, please try again.', 500)
      );
    });
};

export const updateIcon = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 400)
    );
  }

  const file = req?.file;
  const name = req.body.name;
  const iconName = `${name}.svg`;
  const iconPath = req.body?.oldPath;
  const validIconPath = convertToRealBucketPath(iconPath);
  const newValidIconPath = changeObjectNameInPath(validIconPath, iconName);
  const newIconPath = convertToRelativeBucketPath(newValidIconPath);
  const newIconName = removeIconNameExtension(iconName);

  getAllS3Objects({
    path: '',
    Delimiter: '.svg',
  })
    .then((response) => {
      const commonPrefixes = getCommonPrefixesOfListResponseBucket(response);
      const commonPrefixWithSameName = getCommonPrefixWithSameName(
        commonPrefixes,
        iconName
      );
      if (
        commonPrefixWithSameName &&
        newValidIconPath.toUpperCase() !== validIconPath.toUpperCase()
      ) {
        return next(
          new HttpError(
            `An icon with name ${req.body.name} already exists`,
            400
          )
        );
      }

      if (newValidIconPath.toUpperCase() === validIconPath.toUpperCase()) {
        updateS3FileObject({
          oldPrefix: iconPath,
          newName: name,
          newBody: file,
        })
          .then(() => {
            res.json({
              data: getIconObject(newIconName, newIconPath),
            });
          })
          .catch((error) => {
            const message = getMessageOfServiceError(error);
            if (message !== undefined) {
              return next(new HttpError(message, 400));
            }
            return next(
              new HttpError('Updating icon failed, please try again.', 500)
            );
          });
      } else {
        getAllS3Objects({ path: iconPath })
          .then((response) => {
            const objects = getContentsObjectsOfListResponseBucket(response);
            if (
              objects.length !== 1 ||
              (objects.length === 1 && objects[0]?.Key !== validIconPath)
            ) {
              return next(new HttpError('Old path no exist.', 400));
            }
            updateS3FileObject({
              oldPrefix: iconPath,
              newName: name,
              newBody: file,
            })
              .then(() => {
                res.json({
                  data: getIconObject(newIconName, newIconPath),
                });
              })
              .catch((error) => {
                const message = getMessageOfServiceError(error);
                if (message !== undefined) {
                  return next(new HttpError(message, 400));
                }
                return next(
                  new HttpError('Updating icon failed, please try again.', 500)
                );
              });
          })
          .catch(() => {
            return next(
              new HttpError('Updating icon failed, please try again.', 500)
            );
          });
      }
    })
    .catch(() => {
      return next(
        new HttpError('Updating icon failed, please try again.', 500)
      );
    });
};

export const checkFontIcon = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 400)
    );
  }

  const iconClassName = req?.query?.icon ?? '';

  getCloudFrontCSSFile()
    .then((response) => {
      const regex = /(.icon-if-)[a-zA-Z0-9]+(:before)/g;
      const content = (response as unknown as string) ?? '';
      const isNotValid = typeof response !== 'string' || response === '';
      if (isNotValid) {
        return next(
          new HttpError('Something went wrong with font files.', 400)
        );
      }
      const found = content.match(regex) ?? [];
      const isValid = Boolean(
        found?.length &&
          found?.find((item) => {
            let newItem = item;
            newItem = newItem.replace('.icon-if-', '');
            newItem = newItem.replace(':before', '');
            return newItem === iconClassName;
          }) !== undefined
      );
      res.json({
        data: isValid,
      });
    })
    .catch(() => {
      return next(
        new HttpError('Something went wrong, could not find icon in font.', 500)
      );
    });
};

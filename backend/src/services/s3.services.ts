/* eslint-disable no-async-promise-executor */
import {
  CommonPrefixList,
  DeleteObjectOutput,
  ListObjectsV2Request,
  ObjectList,
  PutObjectOutput,
} from 'aws-sdk/clients/s3';
import { StorageBucketName } from '../constants/s3.constants';
import {
  GetAllS3ObjectsRequest,
  GetAllS3ObjectsResponse,
  CreateS3ObjectRequest,
  DeleteS3ObjectRequest,
  UpdateS3FileObjectRequest,
} from '../types/s3.types';
import {
  convertToRealBucketPath,
  isValidResponseOfListObject,
} from '../utils/s3.utils';
import {
  changeObjectNameInPath,
  isFolderOrIconPath,
  removeObjectNameInPath,
} from '../utils/objects.utils';
import initS3 from '../config/s3.config';

export const getAllS3Objects = ({
  path,
  Delimiter,
}: GetAllS3ObjectsRequest): Promise<GetAllS3ObjectsResponse> =>
  new Promise(async (resolve, reject) => {
    const s3 = initS3();
    const validPath = convertToRealBucketPath(path);

    let allContents: ObjectList = [];
    let allCommonPrefixes: CommonPrefixList = [];
    let continuationToken: string | undefined = undefined;
    let missingObjects = false;
    do {
      const newParams: ListObjectsV2Request = {
        Prefix: validPath,
        Bucket: StorageBucketName,
        ContinuationToken: continuationToken,
        Delimiter,
      };
      try {
        const response = await s3.listObjectsV2(newParams).promise();

        if (!isValidResponseOfListObject(response)) {
          reject('Bad response');
        }

        allContents =
          typeof response?.Contents?.length === 'number'
            ? allContents.concat(
                response?.Contents?.filter((object) =>
                  isFolderOrIconPath(object?.Key ?? '')
                )
              )
            : allContents;
        allCommonPrefixes =
          typeof response?.CommonPrefixes?.length === 'number'
            ? allCommonPrefixes.concat(
                response?.CommonPrefixes?.filter((commonPrefixes) =>
                  isFolderOrIconPath(commonPrefixes?.Prefix ?? '')
                )
              )
            : allCommonPrefixes;
        continuationToken =
          typeof response?.IsTruncated === 'boolean' &&
          response.IsTruncated &&
          typeof response?.NextContinuationToken === 'string'
            ? response?.NextContinuationToken
            : undefined;
      } catch (error) {
        reject(error);
      }
      missingObjects = continuationToken !== undefined;
    } while (missingObjects);
    resolve({
      Contents: [...allContents],
      CommonPrefixes: [...allCommonPrefixes],
    });
  });

export const createS3Object = ({
  name,
  path,
  file,
}: CreateS3ObjectRequest): Promise<PutObjectOutput> =>
  new Promise((resolve, reject) => {
    const s3 = initS3();

    const iconName = `${name}.svg`;
    const folderPath = path;
    const validFolderPath = convertToRealBucketPath(folderPath);
    const fullIconPath = `${validFolderPath}${iconName}`;

    const newPutBucketParams = {
      Key: fullIconPath,
      Body: file?.buffer,
      Bucket: StorageBucketName,
    };
    s3.putObject(newPutBucketParams)
      .promise()
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteS3Object = ({
  path,
}: DeleteS3ObjectRequest): Promise<DeleteObjectOutput> =>
  new Promise((resolve, reject) => {
    const s3 = initS3();

    const validIconPath = convertToRealBucketPath(path);

    const newDeleteBucketParams = {
      Key: validIconPath,
      Bucket: StorageBucketName,
    };
    s3.deleteObject(newDeleteBucketParams)
      .promise()
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateS3FileObject = ({
  oldPrefix,
  newName,
  newBody,
}: UpdateS3FileObjectRequest) =>
  new Promise(async (resolve, reject) => {
    const s3 = initS3();

    const newIconName = `${newName}.svg`;
    const newPrefix = changeObjectNameInPath(oldPrefix, newIconName);
    try {
      if (newBody) {
        await deleteS3Object({ path: oldPrefix });

        const path = removeObjectNameInPath(newPrefix);
        await createS3Object({
          path: path,
          name: newName,
          file: newBody,
        });

        resolve(true);
      } else if (oldPrefix !== newPrefix) {
        const validOldPrefix = convertToRealBucketPath(oldPrefix);
        const validNewPrefix = convertToRealBucketPath(newPrefix);

        const copyBucketParams = {
          Bucket: StorageBucketName,
          CopySource: `${StorageBucketName}/${validOldPrefix}`,
          Key: validNewPrefix,
        };
        await s3.copyObject(copyBucketParams).promise();

        await deleteS3Object({ path: oldPrefix });
        resolve(true);
      } else {
        reject({
          isKnown: true,
          message: 'There is no changes to save',
        });
      }
    } catch (error) {
      reject(error);
    }
  });

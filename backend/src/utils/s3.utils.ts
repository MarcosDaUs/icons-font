import { AWSError } from 'aws-sdk';
import { CommonPrefixList, ListObjectsV2Output } from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';
import { GetAllS3ObjectsResponse } from '../types/s3.types';
import { BucketRootFolder } from '../constants/s3.constants';
import { getObjectNameOfPath } from './objects.utils';

export const getContentsObjectsOfListResponseBucket = (
  response: GetAllS3ObjectsResponse
) => {
  return response?.Contents ?? [];
};

export const getCommonPrefixesOfListResponseBucket = (
  response: GetAllS3ObjectsResponse
) => {
  return response?.CommonPrefixes ?? [];
};

export const isValidResponseOfListObject = (
  response: PromiseResult<ListObjectsV2Output, AWSError>
) => {
  const keyCount = Number(response?.KeyCount ?? 0);
  const numberOfObjects =
    Number(response?.Contents?.length ?? 0) +
    Number(response?.CommonPrefixes?.length ?? 0);
  const maxKeys = Number(response?.MaxKeys ?? 0);
  return keyCount === numberOfObjects && keyCount <= maxKeys;
};

export const convertToRealBucketPath = (path: string) => {
  return `${BucketRootFolder}${path}`;
};

export const convertToRelativeBucketPath = (path: string) => {
  return path.startsWith(BucketRootFolder)
    ? path.replace(BucketRootFolder, '')
    : path;
};

export const getCommonPrefixWithSameName = (
  commonPrefixes: CommonPrefixList,
  name: string
) => {
  const upperName = name.toUpperCase();
  return commonPrefixes?.find((commonPrefix) => {
    const objectPath = commonPrefix?.Prefix ?? '';
    if (objectPath) {
      const objectName = getObjectNameOfPath(objectPath);
      const sameName = objectName?.toUpperCase() === upperName;
      return !!sameName;
    }
    return false;
  });
};

export const getMessageOfServiceError = (error?: {
  isKnown: boolean;
  message: string;
}) => {
  if (error !== undefined && error?.isKnown && error?.message) {
    return error.message;
  }
  return undefined;
};

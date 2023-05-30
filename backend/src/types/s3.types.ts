import { CommonPrefixList, ObjectList } from 'aws-sdk/clients/s3';

export type GetAllS3ObjectsRequest = {
  path: string;
  Delimiter?: string;
};

export type GetAllS3ObjectsResponse = {
  Contents: ObjectList;
  CommonPrefixes: CommonPrefixList;
};

export type CreateS3ObjectRequest = {
  path: string;
  name: string;
  file: Express.Multer.File;
};

export type DeleteS3ObjectRequest = {
  path: string;
};

export type UpdateS3FileObjectRequest = {
  oldPrefix: string;
  newName: string;
  newBody?: Express.Multer.File;
};

import * as dotenv from 'dotenv';
dotenv.config();

export const AwsAccessKeyId: string = process.env.AWS_ACCESS_KEY_ID ?? '';
export const AwsSecretAccessKey: string =
  process.env.AWS_SECRET_ACCESS_KEY ?? '';
export const AwsRegion: string = process.env.AWS_REGION ?? '';
export const SessionToken: string = process.env.AWS_SESSION_TOKEN ?? '';
export const StorageBucketName: string = process.env.STORAGE_BUCKET_NAME ?? '';
export const BucketRootFolder: string = process.env.BUCKET_ROOT_FOLDER ?? '';
export const MaxSizeIconFile: number =
  Number(process.env.MAX_SIZE_ICON_FILE) ?? 0;

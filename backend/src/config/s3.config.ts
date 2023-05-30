import AWS from 'aws-sdk';
import {
  AwsAccessKeyId,
  AwsRegion,
  AwsSecretAccessKey,
  SessionToken,
} from '../constants/s3.constants';

export const initS3 = () => {
  const s3 = new AWS.S3({
    region: AwsRegion,
    credentials: {
      accessKeyId: AwsAccessKeyId,
      secretAccessKey: AwsSecretAccessKey,
      sessionToken: SessionToken,
    },
  });
  return s3;
};

export default initS3;

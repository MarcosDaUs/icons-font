import AWS from 'aws-sdk';
import { execSync } from 'child_process';
import fs from 'fs';
import { generateFonts } from 'fantasticon';

const AwsAccessKeyId = process.env.EXTERNAL_AWS_ACCESS_KEY_ID ?? '';
const AwsSecretAccessKey = process.env.EXTERNAL_AWS_SECRET_ACCESS_KEY ?? '';
const AwsRegion = process.env.EXTERNAL_AWS_REGION ?? '';
const SessionToken = process.env.EXTERNAL_AWS_SESSION_TOKEN ?? '';
const IconsStorageBucketName = process.env.ICONS_STORAGE_BUCKET_NAME ?? '';
const IconsBucketRootFolder = process.env.ICONS_BUCKET_ROOT_FOLDER ?? '';
const FontStorageBucketName = process.env.FONT_STORAGE_BUCKET_NAME ?? '';
const FontBucketRootFolder = process.env.FONT_BUCKET_ROOT_FOLDER ?? '';
const CloudFrontUrl = process.env.CLOUDFRONT_URL ?? '';
const CloudFrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID ?? '';

const s3 = new AWS.S3({
  region: AwsRegion,
  credentials: {
    accessKeyId: AwsAccessKeyId,
    secretAccessKey: AwsSecretAccessKey,
    sessionToken: SessionToken,
  },
});

const cloudfront = new AWS.CloudFront({
  accessKeyId: AwsAccessKeyId,
  secretAccessKey: AwsSecretAccessKey,
  sessionToken: SessionToken,
  region: AwsRegion,
});

export const handler = async(event) => {

  execSync('rm -rf /tmp/* && mkdir -p /tmp/dist && mkdir -p /tmp/icons');

  const params = {
    Bucket: IconsStorageBucketName,
    Prefix: IconsBucketRootFolder
  };

  let list = await s3.listObjectsV2(params).promise();

  for await (const file of list.Contents) {
    if (!file.Key.endsWith('.svg')) continue;

    const fileParams = {
      Bucket: IconsStorageBucketName,
      Key: file.Key
    };

    const data = await s3.getObject(fileParams).promise();

    const fileName = `/tmp/icons/${file.Key.split('/').pop()}`;
    await fs.promises.writeFile(fileName, data.Body);
  }
  console.log('/tmp/icons content:');
  console.log(execSync('ls /tmp/icons', { encoding: 'utf8' }).split('\n'));

  const results = await generateFonts({
    inputDir: '/tmp/icons', // (required)
    outputDir: '/tmp/dist', // (required)
    fontTypes: ['ttf', 'woff', 'woff2'],
    assetTypes: ['css', 'html'],
    formatOptions: {},
    // Customize generated icon IDs (unavailable with `.json` config file)
    getIconId: ({
      basename, // `string` - Example: 'foo';
    }) => ['if', basename].join('-') // 'if-foo'
  });
  console.log('results: ');
  console.log(results);

  console.log('/tmp/dist content:');
  console.log(execSync('ls /tmp/dist', { encoding: 'utf8' }).split('\n'));

  const listResult = execSync('ls /tmp/dist', { encoding: 'utf8' }).split('\n');
  let dataCSS;
  let fileCSS;
  for await (const file of listResult) {
    if (!`${file}`.includes('icons')) continue;

    const fileName = `/tmp/dist/${file}`;
    let data = await fs.promises.readFile(fileName);

    if (fileName.endsWith('.css')) {
      const text = data.toString();
      const regex = /.\//g;
      let replacing = text.replace(regex, CloudFrontUrl);
      dataCSS = Buffer.from(replacing, 'utf-8');
      fileCSS = file;

    } else {

      const params = {
        Bucket: FontStorageBucketName,
        Key: `${FontBucketRootFolder}${file}`,
        Body: data,
        ACL: 'public-read'
      };
      await s3.putObject(params).promise();
    }
  }

  if (dataCSS) {
    const params = {
      Bucket: FontStorageBucketName,
      Key: `${FontBucketRootFolder}${fileCSS}`,
      Body: dataCSS,
      ACL: 'public-read',
      ContentType: 'text/css'
    };
    await s3.putObject(params).promise();
  }

  await cloudfront
  .createInvalidation({
    DistributionId: CloudFrontDistributionId,
    InvalidationBatch: {
      CallerReference: `SOME-UNIQUE-STRING-${new Date().getTime()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  })
  .promise();

  const response = {
      statusCode: 200,
      body: JSON.stringify(`Hello from Lambda!`),
  };
  return response;
};

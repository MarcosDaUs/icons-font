import * as dotenv from 'dotenv';
dotenv.config();

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
const CloudFrontUrl = process.env.CLOUDFRONT_URL ?? ''; // local path for final folder in tmp

const s3 = new AWS.S3({
  region: AwsRegion,
  credentials: {
    accessKeyId: AwsAccessKeyId,
    secretAccessKey: AwsSecretAccessKey,
    sessionToken: SessionToken,
  },
});

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

  const fileName = `./tmp/icons/${file.Key.split('/').pop()}`;
  await fs.promises.writeFile(fileName, data.Body);
}

const results = await generateFonts({
  inputDir: './tmp/icons', // (required)
  outputDir: './tmp/dist', // (required)
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['css', 'html'],
  formatOptions: {},
  // Customize generated icon IDs (unavailable with `.json` config file)
  getIconId: ({
    basename, // `string` - Example: 'foo';
  }) => ['if', basename].join('-') // 'if-foo'
});

const listResult = execSync('ls ./tmp/dist', { encoding: 'utf8' }).split('\n');
let dataCSS;
let fileCSS;
for await (const file of listResult) {
  if (!`${file}`.includes('icons')) continue;

  const fileName = `./tmp/dist/${file}`;
  let data = await fs.promises.readFile(fileName);

  if (fileName.endsWith('.css')) {
    const text = data.toString();
    const regex = /.\//g;
    let replacing = text.replace(regex, CloudFrontUrl);
    dataCSS = Buffer.from(replacing, 'utf-8');
    fileCSS = file;

  } else {
    const fileName = `./tmp/final/${file}`;
    await fs.promises.writeFile(fileName, data);
  }
}

if (dataCSS) {
  const fileName = `./tmp/final/${fileCSS}`;
    await fs.promises.writeFile(fileName, dataCSS);
}
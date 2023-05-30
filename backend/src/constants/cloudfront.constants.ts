import * as dotenv from 'dotenv';
dotenv.config();

export const CloudFrontCssEndpoint: string =
  process.env.CLOUDFRONT_CSS_ENDPOINT ?? '';

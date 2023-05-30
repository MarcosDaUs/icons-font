import axios from 'axios';
import { CloudFrontCssEndpoint } from '../constants/cloudfront.constants';

export const getCloudFrontCSSFile = () =>
  new Promise((resolve, reject) => {
    axios
      .get(CloudFrontCssEndpoint, {
        responseType: 'document',
      })
      .then((response) => {
        try {
          const body = response.data;

          const isNotValid =
            response.status !== 200 || typeof body !== 'string';
          if (isNotValid) {
            reject(new Error('Request Failed.'));
            return;
          }
          resolve(body);
        } catch (error) {
          reject(error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

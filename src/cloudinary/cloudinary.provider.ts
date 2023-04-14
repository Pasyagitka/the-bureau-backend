import { ConfigOptions, v2 } from 'cloudinary';

const options: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

export const CloudinaryProvider = {
  //TODO add cloudinary config
  provide: 'CLOUDINARY',
  useFactory: (): unknown => {
    return v2.config(options);
  },
};

export interface Config {
  settingTheme: string;
  accessToken: string;
  accessPushToken: string;
  accessHeaderToken: string;
  blogApiUrl: string;
  imageApiUrl: string;
  baseUrl: string;
  tempPostAutoSave: string;
  blogThumbnailImageUrl: string;
  pwaLog: string;
  cookieConfig: {
    expires: number;
    domain: string;
  };
}

const config = {} as Config;

export function setConfig() {
  Object.assign(config, {
    settingTheme: process.env.NEXT_PUBLIC_SETTING_THEME ?? '',
    accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '',
    accessPushToken: process.env.NEXT_PUBLIC_ACCESS_PUSH_TOKEN ?? '',
    accessHeaderToken: process.env.NEXT_PUBLIC_ACCESS_HEADER_TOKEN ?? '',
    blogApiUrl: process.env.NEXT_PUBLIC_BLOG_API ?? '',
    imageApiUrl: process.env.NEXT_PUBLIC_IMAGE_API ?? '',
    baseUrl: process.env.NEXT_PUBLIC_BLOG_URL ?? '',
    tempPostAutoSave: process.env.NEXT_PUBLIC_TEMP_POST_AUTO_SAVE ?? '',
    blogThumbnailImageUrl: process.env.NEXT_PUBLIC_BLOG_THUMBNAIL_IMAGE_URL ?? '',
    pwaLog: process.env.NEXT_PUBLIC_PWA_LOG ?? '',
    cookieConfig: {
      expires: 180,
      domain: '.woolta.com',
    },
  });
}

export default config;

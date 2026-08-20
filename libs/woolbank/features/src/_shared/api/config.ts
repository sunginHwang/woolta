export interface WoolbankConfig {
  apiUrl: string;
}

const config: WoolbankConfig = {
  apiUrl: process.env.NEXT_PUBLIC_BANK_API ?? '',
};

export function setWoolbankConfig(newConfig: Partial<WoolbankConfig>) {
  Object.assign(config, newConfig);
}

export function getConfig(): WoolbankConfig {
  return config;
}

import { APP_ID, PORT_REQUEST_METHOD } from '../constants/global.constants';

export type Sid = {
  id: string;
  date: string;
};
export type TLanguage = {
  symbol: string;
  title: string;
};

export type TranslateWithExample = {
  src?: string;
  dst?: string;
};

export type TranslateWithExampleResult = {
  original: string;
  pos: string;
  translate: string;
  languageFrom: string;
  languageTo: string;
  examples: TranslateWithExample[];
};

export type BackgroundMessage = {
  data: any;
  method: PORT_REQUEST_METHOD;
  id: string;
  target: string;
  appId: string;
};

export type BackgroundResult = {
  error: any,
  data: any,
};

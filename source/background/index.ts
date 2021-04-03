import { browser, Runtime } from 'webextension-polyfill-ts';

import { LANGUAGE_CONSTANTS, STORAGE_KEYS } from '../constants';
import StorageService from '../services/storage.service';
import TranslateService from '../services/translate.service';
import { APP_ID, PORT_REQUEST_METHOD } from '../constants/global.constants';
import { BackgroundMessage, BackgroundResult } from '../types';

const onSelectedTranslateHandler = async (text: string) => {
  const result = await TranslateService.translate(text);
  return result;
};

const onMessage = async (msg: BackgroundMessage, port: Runtime.Port) => {
  const { data, method, id, target, appId } = msg;
  let result = null;
  const error = null;
  try {
    switch (method) {
    case PORT_REQUEST_METHOD.SELECTED_TRANSLATE:
      result = await onSelectedTranslateHandler(data.originalText);
      break;
    default:
      break;
    }

  } catch (error) {
    console.log(error);
    error = error;
  }
  port.postMessage({ result, id, target, appId, error });
};

(async () => {
  const langFrom = await StorageService.getlanguageFrom();

  if (!langFrom) {
    await StorageService.set(
      STORAGE_KEYS.LANGUAGE_FROM,
      LANGUAGE_CONSTANTS.LANGUAGES.EN,
    );
  }

  const langTo = await StorageService.getlanguageTo();

  if (!langTo) {
    await StorageService.set(
      STORAGE_KEYS.LANGUAGE_TO,
      LANGUAGE_CONSTANTS.LANGUAGES.RU,
    );
  }

  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(onMessage);
  });
})();

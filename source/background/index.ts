import 'emoji-log';
import {browser} from 'webextension-polyfill-ts';

import {LANGUAGE_CONSTANTS, STORAGE_KEYS} from '../constants';
import StorageService from '../services/storage.service';
import {TranslateService} from '../services/translate.service';
import {APP_ID, PORT_REQUEST_METHOD} from '../constants/global.constants';

let translateService: TranslateService;

const onSelectedTranslateHandler = async (text: string) => {
  console.log('onSelectedTranslateHandler -> text', text);
  // const result = await translateService.translateWithExamples(text);
  const result = await translateService.translate(text);
  console.log(result);
};

const messageHandler = async (msg) => {
  const {data, method} = msg;
  switch (method) {
    case PORT_REQUEST_METHOD.SELECTED_TRANSLATE:
      await onSelectedTranslateHandler(data.originalText);
      break;
    default:
      break;
  }
};

const init = async (): Promise<void> => {
  const langFrom = await StorageService.getlanguageFrom();

  if (!langFrom) {
    await StorageService.set(
      STORAGE_KEYS.LANGUAGE_FROM,
      LANGUAGE_CONSTANTS.LANGUAGES.EN
    );
  }

  const langTo = await StorageService.getlanguageTo();

  if (!langTo) {
    await StorageService.set(
      STORAGE_KEYS.LANGUAGE_TO,
      LANGUAGE_CONSTANTS.LANGUAGES.RU
    );
  }

  translateService = new TranslateService();
};

browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(messageHandler);
});

init();

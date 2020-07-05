import 'emoji-log';
import { browser } from 'webextension-polyfill-ts';

import { LANGUAGE_CONSTANTS, STORAGE_KEYS } from '../constants'
import StorageService from '../Services/StorageService';
import TranslateService from '../Services/TranslateService';
import { APP_ID, PORT_REQUEST_METHOD } from '../constants/GlobalConstants'


browser.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(messageHandler);
});

const messageHandler = async (msg) => {
  const { data, method } = msg
  console.log("messageHandler -> method", method)
  switch (method) {
    case PORT_REQUEST_METHOD.SELECTED_TRANSLATE:
      await onSelectedTranslateHandler(data.originalText)
      break;
  }
  console.log(msg);

}

const onSelectedTranslateHandler = async (text) => {
  const result = await TranslateService.translateWithExamples(text)
  console.log(result);

}

const init = async () => {
  const langFrom = await StorageService.getlanguageFrom();
  console.log("init -> LANGUAGES_CONSTANTS", LANGUAGE_CONSTANTS)

  if (!langFrom) {
    await StorageService.set(STORAGE_KEYS.LANGUAGE_FROM, LANGUAGE_CONSTANTS.LANGUAGES.EN)
  }

  const langTo = await StorageService.getlanguageTo();

  if (!langTo) {
    await StorageService.set(STORAGE_KEYS.LANGUAGE_TO, LANGUAGE_CONSTANTS.LANGUAGES.RU)
  }

  await TranslateService.init();

}

init()
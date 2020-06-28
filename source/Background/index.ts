import 'emoji-log';
import { browser } from 'webextension-polyfill-ts';

import {LANGUAGES, STORAGE_KEYS } from '../constants'
import StorageService from '../Services/StorageService';

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🦄', 'extension installed');
});

browser.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function (msg) {
    console.log("msg", msg)

  });
}); 

const init = async () => { 
  const currentLang = await StorageService.get(STORAGE_KEYS.CURRENT_LANGUAGE);
  if (!currentLang) { 
    await StorageService.set(STORAGE_KEYS.CURRENT_LANGUAGE, LANGUAGES.LANG_RU)
  }

  
}

init()
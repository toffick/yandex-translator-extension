import {browser} from 'webextension-polyfill-ts';
import {TLanguage} from 'yandex-translator-extension';

import {STORAGE_KEYS} from '../constants';

export default class StorageLocal {
  static async get(key: string): Promise<any | null> {
    const result = await browser.storage.local.get(key);

    if (!result) {
      return null;
    }

    return result[key];
  }

  static async set(key: string, value: any): Promise<any> {
    await browser.storage.local.set({[key]: value});
    return value;
  }

  static async getlanguageFrom(): Promise<TLanguage | null> {
    return this.get(STORAGE_KEYS.LANGUAGE_FROM);
  }

  static async getlanguageTo(): Promise<TLanguage | null> {
    return this.get(STORAGE_KEYS.LANGUAGE_TO);
  }
}

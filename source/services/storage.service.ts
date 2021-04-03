import { browser } from 'webextension-polyfill-ts';
import { TLanguage } from '../types';

import { STORAGE_KEYS } from '../constants';

class StorageLocal {
  async get(key: string): Promise<any | null> {
    const result = await browser.storage.local.get(key);

    if (!result) {
      return null;
    }

    return result[key];
  }

  async set(key: string, value: any): Promise<any> {
    await browser.storage.local.set({ [key]: value });
    return value;
  }

  async getlanguageFrom(): Promise<TLanguage | null> {
    return this.get(STORAGE_KEYS.LANGUAGE_FROM);
  }

  async getlanguageTo(): Promise<TLanguage | null> {
    return this.get(STORAGE_KEYS.LANGUAGE_TO);
  }
}

export default new StorageLocal()
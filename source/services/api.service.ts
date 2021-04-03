import axios from 'axios';
import qs from 'qs';

import StorageService from './storage.service';
import { STORAGE_KEYS, API_CONSTANTS } from '../constants';
import StringHelper from '../helpers/string.helper';
import { Sid, TranslateWithExampleResult } from '../types';

class ApiService {
  private translateCounter: number;

  constructor() {
    this.translateCounter = 0;
  }

  private getTranslateCounter(): number {
    return this.translateCounter;
  }

  private getAndIncreaseCounter(): number {
    return this.translateCounter += 1;
  }

  private async getSid(): Promise<Sid> {
    let sid: Sid = await StorageService.get(
      STORAGE_KEYS.TRANSLATOR_SESSION_ID,
    );
    const now = new Date();

    if (!sid || now.getTime() - new Date(sid.date).getTime() > 10 * 60 * 1000 /* 10m */) {
      const sessionId = await ApiService.getSessionIdFromNet();

      sid = {
        id: sessionId,
        date: now.toString(),
      } as Sid;

      await StorageService.set(STORAGE_KEYS.TRANSLATOR_SESSION_ID, sid);
    }
    return sid;
  }

  private static async getSessionIdFromNet(): Promise<string | null> {
    const translatorUrl = API_CONSTANTS.YANDEX_API_URL;
    const page = await axios.get(translatorUrl);
    // TODO error handling
    const { data } = page;
    const matchResult = data.match(/SID:\s*'(.+)'/);
    if (!matchResult) {
      return null;
    }

    const [, originalSid] = matchResult;

    if (!originalSid) {
      return null;
    }

    return originalSid
      .split('.')
      .map((item: string) => StringHelper.reverse(item))
      .join('.');
  }

  // async translateWithExamples(
  //   originalText: string,
  // ): Promise<TranslateWithExampleResult[]> {
  //   const sid: Sid = await this.getSid();
  //   const langFrom = await StorageService.getlanguageFrom();
  //   const langTo = await StorageService.getlanguageTo();
  //   if (!langTo || !langFrom) {
  //     throw new Error('current language is undefined');
  //   }

  //   const {
  //     data: { result },
  //   } = await translateWithExamples(
  //     originalText,
  //     sid.id,
  //     langFrom.symbol,
  //     langTo.symbol,
  //   );

  //   const translations = result
  //     .filter((item: any) => item && !item.translation.other)
  //     .map((item: any) => {
  //       const {
  //         translation: { text, pos },
  //         examples,
  //       } = item;
  //       return {
  //         original: originalText || '',
  //         pos: pos?.text || '',
  //         translate: text,
  //         languageFrom: langFrom.symbol,
  //         languageTo: langTo.symbol,
  //         examples,
  //       };
  //     }) as TranslateWithExampleResult[];

  //   return translations;
  // }

  async queryCorpus(text: string): Promise<TranslateWithExampleResult[]> {
    const sid: Sid = await this.getSid();
    const langFrom = await StorageService.getlanguageFrom();
    const langTo = await StorageService.getlanguageTo();
    if (!langTo || !langFrom) {
      throw new Error('current language is undefined');
    }

    const body = qs.stringify({
      text,
      options: 1,
    });

    const {
      data,
    } = await axios.post(
      API_CONSTANTS.TRANSLATE_API_URL,
      body,
      {
        params: {
          id: `${sid.id}-${this.getAndIncreaseCounter()}-0`,
          lang: `${langFrom.symbol}-${langTo.symbol}`,
          reason: 'paste',
          srv: 'tr-text',
          format: 'text',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const translations = data.text
      .filter((item: any) => item && !item.translation.other)
      .map((item: any) => {
        const {
          translation: { text, pos },
          examples,
        } = item;
        return {
          original: text || '',
          pos: pos?.text || '',
          translate: text,
          languageFrom: langFrom.symbol,
          languageTo: langTo.symbol,
          examples,
        };
      });

    return translations;
  }

  async translate(text: string): Promise<string> {
    const sid: Sid = await this.getSid();
    const langFrom = await StorageService.getlanguageFrom();
    const langTo = await StorageService.getlanguageTo();
    if (!langTo || !langFrom) {
      throw new Error('current language is undefined');
    }

    const body = qs.stringify({
      text,
      options: 1,
    });

    const {
      data,
    } = await axios.post(
      API_CONSTANTS.TRANSLATE_API_URL,
      body,
      {
        params: {
          id: `${sid.id}-${this.getAndIncreaseCounter()}-0`,
          lang: `${langFrom.symbol}-${langTo.symbol}`,
          reason: 'paste',
          srv: 'tr-text',
          format: 'text',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data.text[0];
  }
}

export default new ApiService();

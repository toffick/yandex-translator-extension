import axios from 'axios';
import {TSid} from 'yandex-translator-extension';

import StorageService from './storage.service';
import {STORAGE_KEYS, API_CONSTANTS} from '../constants';
import {translateWithExamples, translate} from '../api/translator.api';
import TranslateWithExampleResult from '../core/translate.example.result';

export class ApiService {
  private translateCounter: number;

  constructor() {
    this.translateCounter = 0;
  }

  private getTranslateCounter() {
    return this.translateCounter;
  }

  private getAndIncreaseCounter() {
    return this.translateCounter++;
  }

  private async getSid(): Promise<TSid> {
    let sid: TSid = await StorageService.get(
      STORAGE_KEYS.TRANSLATOR_SESSION_ID
    );
    const now = new Date();

    if (!sid || now.getTime() - new Date(sid.date).getTime() > 0 /* TODO */) {
      const sessionId = await this.getSessionIdFromNet();

      sid = {
        id: sessionId,
        date: now.toString(),
      } as TSid;

      await StorageService.set(STORAGE_KEYS.TRANSLATOR_SESSION_ID, sid);
    }
    return sid;
  }

  private async getSessionIdFromNet(): Promise<string | null> {
    const translatorUrl = API_CONSTANTS.YANDEX_API_URL;
    const page = await axios.get(translatorUrl);
    // TODO error handling
    const {data} = page;
    const matchResult = data.match(/SID:\s*'(.+)'/);
    if (!matchResult) {
      return null;
    }
    // TODO empty result handling
    const [, originalSid] = matchResult;

    const originalSidParts = originalSid.split('.');
    const sid = `${originalSidParts[0].reverse()}.${originalSidParts[1].reverse()}.${originalSidParts[2].reverse()}`;
    return sid;
  }

  async translateWithExamples(
    originalText: string
  ): Promise<TranslateWithExampleResult[]> {
    const sid: TSid = await this.getSid();
    const langFrom = await StorageService.getlanguageFrom();
    const langTo = await StorageService.getlanguageTo();
    if (!langTo || !langFrom) {
      throw new Error('current language is undefined');
    }
    // TODO autodetect language from
    const {
      data: {result},
    } = await translateWithExamples(
      originalText,
      sid.id,
      langFrom.symbol,
      langTo.symbol
    );
    // console.log("TranslateService -> result", result)

    const translations = result
      .filter((item: any) => item && !item.translation.other)
      .map((item: any) => {
        const {
          translation: {text, pos},
          examples,
        } = item;
        return new TranslateWithExampleResult(
          originalText || '',
          pos?.text || '',
          text,
          langFrom.symbol,
          langTo.symbol,
          examples
        );
      });

    return translations;
  }

  async translate(originalText: string): Promise<TranslateWithExampleResult[]> {
    const sid: TSid = await this.getSid();
    const langFrom = await StorageService.getlanguageFrom();
    const langTo = await StorageService.getlanguageTo();
    if (!langTo || !langFrom) {
      throw new Error('current language is undefined');
    }

    const id = `${sid.id}-${this.getAndIncreaseCounter()}-0`;
    const {
      data: {result},
    } = await translate(originalText, id, langFrom.symbol, langTo.symbol);
    console.log('ApiService -> result', result);

    const translations = result
      .filter((item: any) => item && !item.translation.other)
      .map((item: any) => {
        const {
          translation: {text, pos},
          examples,
        } = item;
        return new TranslateWithExampleResult(
          originalText || '',
          pos?.text || '',
          text,
          langFrom.symbol,
          langTo.symbol,
          examples
        );
      });

    console.log('TranslateService -> translations', translations);
    return translations;
  }
}

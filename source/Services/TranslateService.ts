import axios from 'axios'
import { TSid } from 'yandex-translator-extension';

import StorageService from './StorageService';
import { STORAGE_KEYS, API_CONSTANTS } from '../constants'
import { translateWithExamples } from '../helpers/TranslatorApi'
import TranslateExampleResult from '../core/TranslateExampleResult'

export default class TranslateService {

    static async init() {
        const sid = await this.getSid()
        await StorageService.set(STORAGE_KEYS.TRANSLATOR_SESSION_ID, sid)
    }

    static async getSid(): Promise<TSid> {
        const sid: TSid = await StorageService.get(STORAGE_KEYS.TRANSLATOR_SESSION_ID);
        console.log("TranslateService -> sid", sid)
        const now = new Date();
        console.log(now.getTime() - new Date(sid.date).getTime());

        if (!sid || (now.getTime() - new Date(sid.date).getTime()) > API_CONSTANTS.SID_TIMEOUT) {
            const sessionId = await this.getSessionIdFromNet();
            const newSid: TSid = {
                id: sessionId,
                date: now.toString()
            } as TSid;

            await StorageService.set(STORAGE_KEYS.TRANSLATOR_SESSION_ID, newSid)
        }
        return sid;
    }

    private static async getSessionIdFromNet(): Promise<string | null> {
        const translatorUrl = API_CONSTANTS.YANDEX_API_URL;
        const page = await axios.get(translatorUrl);
        //TODO error handling
        const { data } = page;
        const matchResult = data.match(/SID:\s*'(.+)'/);
        if (!matchResult) {
            return null;
        }
        // TODO empty result handling
        const [, sid] = matchResult;
        return sid;
    }

    static async translateWithExamples(originalText: string): Promise<TranslateExampleResult[]> {
        const sid: TSid = await this.getSid();
        const langFrom = await StorageService.getlanguageFrom();
        const langTo = await StorageService.getlanguageTo();
        if (!langTo || !langFrom) {
            throw new Error('current language is undefined')
        }
        // TODO autodetect language from
        const { data: { result } } = await translateWithExamples(originalText, sid.id, langFrom.symbol, langTo.symbol);
        console.log("TranslateService -> result", result)

        const translations = result
            .filter((item: any) => item && !item.translation.other)
            .map((item: any) => {
                const { translation: { text, pos }, examples } = item;
                return new TranslateExampleResult(
                    originalText || '',
                    pos?.text || '',
                    text,
                    langFrom.symbol,
                    langTo.symbol,
                    examples
                )
            })

        return translations

    }
}
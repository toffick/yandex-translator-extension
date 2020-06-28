import { browser, Storage } from 'webextension-polyfill-ts';

export default class StorageLocal {
    static async get(key: string): Promise<any | null> {
        const result = await browser.storage.local.get(key);

        if (!result) {
            return null
        }

        return result
    }

    static async set(key: string, value: any): Promise<any> {
        await browser.storage.local.set({ [key]: value });
        return value;
    }
}
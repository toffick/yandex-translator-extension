import axios from 'axios';

export const translateWithExamples = (text: string, sid: string, langFrom: string, langTo: string) => axios.get(
    `https://dictionary.yandex.net/dicservice.json/queryCorpus`,
    {
        params: {
            sid,
            src: text, //TODO to url view,
            lang: `${langFrom}-${langTo}`,
            flags: 39,
            maxlen: 200 // TODO set custom
        }
    }
)
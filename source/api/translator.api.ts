import axios from 'axios';

export const translateWithExamples = (
  text: string,
  sid: string,
  langFrom: string,
  langTo: string
) =>
  axios.get(`https://dictionary.yandex.net/dicservice.json/queryCorpus`, {
    params: {
      sid,
      src: text, // TODO to url view,
      lang: `${langFrom}-${langTo}`,
      flags: 39,
      maxlen: 200, // TODO set custom
    },
  });

export const translate = (
  text: string,
  id: string,
  langFrom: string,
  langTo: string
) =>
  axios.post(
    `https://translate.yandex.net/api/v1/tr.json/translate`,
    {
      text,
      options: 1,
    },
    {
      params: {
        id, // TODO:: what the fucking -0-0?
        lang: `${langFrom}-${langTo}`,
        reason: 'paste',
        srv: 'tr-text',
        format: 'text',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

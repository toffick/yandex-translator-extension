import { browser, Runtime } from 'webextension-polyfill-ts';

import { APP_ID, PORT_REQUEST_METHOD } from '../constants/global.constants';
import IdHelper from '../helpers/id.helper';
import { renderTooltip } from './app';

const cbsMap: Map<string, (...args: any) => any> = new Map();
let backgroundPort: Runtime.Port;

const onMessage = (message: any) => {
  const { id } = message;
  const cb = cbsMap.get(id);

  if (!cb) {
    return;
  }

  cb(message);
  cbsMap.delete(id);
};

const backgroundRequest = (
  method: PORT_REQUEST_METHOD,
  requestData: Record<string, any>,
): Promise<unknown> => {
  const id = `${method}_${IdHelper.getId()}`; // rm getId

  const result = new Promise((resolve, reject) => {
    const cb = ({ error, result }: { error: any, result: any; }) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    };

    backgroundPort.postMessage({
      method,
      id,
      target: 'content',
      appId: APP_ID,
      data: requestData,
    });

    cbsMap.set(id, cb);
  });

  return result;
};

const getSelection = () => {
  let t: Selection | null = null;
  if (window.getSelection) {
    t = window.getSelection();
  } else if (document.getSelection) {
    t = document.getSelection();
  }
  return t;
};

document.addEventListener('mouseup', (event) => {
  const selection = getSelection();
  if (selection && !selection.isCollapsed) {
    const selectionText = selection.toString();
    backgroundRequest(PORT_REQUEST_METHOD.SELECTED_TRANSLATE, {
      originalText: selectionText,
    }).then((res) => {
      console.log('document.addEventListener ~ event', event);
      const { pageX, pageY } = event;
      console.log('document.addEventListener ~ screenY', screenY);
      console.log('document.addEventListener ~ screenX', screenX);
      console.log(res);
      renderTooltip({
        translation: {
          original: selectionText,
          translate: res,
        },
        position: { Y: pageY, X: pageX },
      });

    });
  }
});

(async () => {
  backgroundPort = browser.runtime.connect();
  backgroundPort.onMessage.addListener(onMessage);
})();

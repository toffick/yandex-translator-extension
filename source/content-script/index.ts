import {browser, Runtime} from 'webextension-polyfill-ts';

import {APP_ID, PORT_REQUEST_METHOD} from '../constants/global.constants';
import {IdHelper} from '../helpers/id.helper';

const backgroundPort: Runtime.Port = browser.runtime.connect();

/**
 * On content script message
 * @method onMessage
 * @param event
 */
const onMessage = () => {};

/**
 * @method backgroundRequest
 * @param {String} method
 */
const backgroundRequest = (
  method: PORT_REQUEST_METHOD,
  requestData: Record<string, any>
) => {
  const id = `${method}_${IdHelper.getId()}`; // rm getId

  const result = new Promise((resolve, reject) => {
    const cb = ({data}) => {
      if (data.error || (data.res && data.res.error)) {
        reject(data.error || data.res.error);
      } else {
        resolve(data.res);
      }
    };

    backgroundPort.postMessage({
      method,
      id,
      target: 'content',
      appId: APP_ID,
      data: requestData,
    });
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

document.addEventListener('mouseup', function () {
  const selection = getSelection();
  console.log('selection', selection);
  if (selection && !selection.isCollapsed) {
    const selectionText = selection.toString();
    backgroundRequest(PORT_REQUEST_METHOD.SELECTED_TRANSLATE, {
      originalText: selectionText,
    });
  }
});

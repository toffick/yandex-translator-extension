import { browser, Runtime } from 'webextension-polyfill-ts';

import { APP_ID, REQUEST_METHOD } from '../constants/GlobalConstants'
import { IdHelper } from '../helpers/IdHelper'

let backgroundPort: Runtime.Port = browser.runtime.connect();;


/**
 * On content script message
 * @method onMessage
 * @param event
 */
const onMessage = (event: any) => {




};

/**
 * @method backgroundRequest
 * @param {String} method
 */
const backgroundRequest = (method: REQUEST_METHOD, requestData: Object) => {
    const id = `${method}_${IdHelper.getId()}`;

    const result = new Promise((resolve, reject) => {

        const cb = ({ data }) => {
            if (data.error || (data.res && data.res.error)) {
                reject(data.error || data.res.error);
            } else {
                resolve(data.res);
            }
        };

        backgroundPort.postMessage({
            method, id, target: 'content', appId: APP_ID, data: requestData,
        })


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
}

document.addEventListener("mouseup", function (event) {

    const selection = getSelection()
    if (selection && !selection.isCollapsed) {
        const selectionText = selection.toString();
        backgroundRequest(REQUEST_METHOD.SELECTED_TRANSLATE, { originalText: selectionText })
    }
});

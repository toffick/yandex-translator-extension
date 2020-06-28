import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import Popup from './Popup';

ReactDOM.render(<Popup />, document.getElementById('popup-root'));


/* global EXTENSION */
/* global INPAGE_PATH_PACK_FOLDER */

import { APP_ID } from '../constants/GlobalConstants'
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

let currentPort;



/**
 *
 * @param {Object} res
 * @return {Promise<any>}
 */
const onBackgroundMessage = async (res) => {
    if (!res) {
        return null;
    }

    const { origin } = res;

    delete res.origin;
    res.target = 'inpage';
    res.appId = APP_ID;

    window.postMessage(res, origin);

    return null;
};

/**
 * On Inpage message
 * @param event
 */
const onPageMessage = (event) => {
    const { data } = event;

    if (data.target !== 'content' || !data.appId || data.appId !== APP_ID) return;

    try {
        currentPort.postMessage(data);
    } catch (err) {
        if (err.message.match(/Invocation of form runtime\.connect/) && err.message.match(/doesn't match definition runtime\.connect/)) {
            console.error('Connection to background error, please reload the page', err);
        } else {
            console.error('Unexpected error occurred', err);
        }
    }
};



// listen messages from inpage.js script injected in web page. Implemented with One-off messages
window.addEventListener('message', onPageMessage, false);

// listen messages from background.js script by.  Implemented with Connection-based messaging
currentPort.onMessage.addListener(onBackgroundMessage);
import ReactDOM from 'react-dom';
import React from 'react';
import Tooltip from './components/tooltip/tooltip';
import { TOOLTIP_ROOT_ID } from './constants/app.constants';
import { TooltipData } from './types';

export const unmountTooltip = (): void => {
  const element = ReactDOM.findDOMNode(
    document.getElementById(TOOLTIP_ROOT_ID)
  );
  if (!element) {
    return;
  }
  ReactDOM.unmountComponentAtNode(element as Element);
};

export const renderTooltip = ({
  translation: { original, translation },
  mousePosition: { X, Y },
}: TooltipData): void => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div id='${TOOLTIP_ROOT_ID}'></div>`
  );

  ReactDOM.render(
    <Tooltip
      originalText={original}
      translation={translation}
      positionX={X}
      positionY={Y}
      onClose={unmountTooltip}
    />,
    document.getElementById(TOOLTIP_ROOT_ID)
  );
};

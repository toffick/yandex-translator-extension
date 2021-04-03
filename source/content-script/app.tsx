import ReactDOM from 'react-dom';
import React from 'react';
import Tooltip from './components/tooltip/tooltip';
import TooltipV2 from './components/tooltip/tooltip';

export const renderTooltip = ({
  translation: { original, translate },
  position: { X, Y },
}) => {
  try {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<div id=\'mooc-assistant-mount\'></div>'
    );

    ReactDOM.render(
      <TooltipV2
        originalText={original}
        translate={translate}
        positionX={X}
        positionY={Y}
      />,
      document.getElementById('mooc-assistant-mount')
    );
  } catch (error) {
    console.log(error);
  }
};

// export const renderTooltip: () => void = () => {
//   renderApp();

//   // 如果是在课程页面内，则同步页面上挂在 window 下的变量
//   if (/(spoc)?\/learn\//.test(window.location.href)) {
//     const scripts = document.querySelectorAll('script:not([src])');
//     if (scripts.length !== 0) {
//       eval(scripts[scripts.length - 1].innerHTML);
//     }
//   }
// };

// // DAMN FIREFOX
// window.addEventListener('load', loadApp);

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TOOLTIP_ROOT_ID } from '../../constants/app.constants';
import { isTooltipElementId } from '../../helpers/tooltip.helpers';

const TooltipBox = styled.div`
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
  background-color: rgb(255, 255, 255);
  position: absolute;
  z-index: 1201 !important;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-color: rgb(187, 187, 187) rgb(187, 187, 187) rgb(168, 168, 168);
  padding: 16px;
  top: ${(props) => props.positionY}px;
  left: ${(props) => props.positionX}px;
`;

const TooltipTextArea = styled.div`
  padding: 3px;
`;

const TooltipLanguage = styled.div`
  color: #636363;
  font-size: 11px;
  margin: 0;
  padding: 5px 0;
`;

const TooltipText = styled.div`
  display: inline;
  font-size: 18px;
  margin: 5px auto;
  padding: 5px 0;
`;

const CloseButton = styled.div`
  height: 16px;
  opacity: 0.4;
  position: absolute;
  right: 5px;
  top: 5px;
  width: 16px;
  background: url("${chrome.extension.getURL('assets/images/close.png')}")
    no-repeat;
  outline: 0px;
  :hover {
    cursor: pointer;
  }
`;

const TooltipComponent = ({
  originalText,
  translation,
  positionX,
  positionY,
  onClose,
}) => {
  useEffect(() => {
    const eventListener = (e) => {
      if (e.path.some(({ id }: { id: string }) => isTooltipElementId(id))) {
        return;
      } else {
        onClose();
      }

      return () => window.removeEventListener;
    };
    window.addEventListener('click', eventListener);
    return () => window.removeEventListener('click', eventListener);
  }, []);
  return (
    <TooltipBox positionX={positionX} positionY={positionY}>
      <CloseButton onClick={onClose} />

      <TooltipTextArea>
        <TooltipLanguage>English</TooltipLanguage>
        <div className="text">{originalText}</div>
      </TooltipTextArea>
      <TooltipTextArea>
        <TooltipLanguage>Russian</TooltipLanguage>
        <TooltipText>{translation}</TooltipText>
      </TooltipTextArea>
    </TooltipBox>
  );
};

export default TooltipComponent;

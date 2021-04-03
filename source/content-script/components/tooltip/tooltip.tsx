import React from 'react';
import styled from 'styled-components';

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
  height: 21px;
  opacity: 0.4;
  position: absolute;
  right: 2px;
  top: 2px;
  width: 21px;
  background: url(${chrome.extension.getURL('assets/close.png')}) no-repeat;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: initial;
  outline: 0px;
`;
console.log('chrome.extension.getURLssets/close.png)', chrome.extension.getURL('assets/close.png'));

const TooltipComponent = ({
  originalText,
  translate,
  positionX,
  positionY,
}) => (
  <TooltipBox positionX={positionX} positionY={positionY}>
    <CloseButton />
    <div className="closeButton" aria-label="Close" role="button"></div>
    <TooltipTextArea>
      <TooltipLanguage>English</TooltipLanguage>
      <div className="text">{originalText}</div>
    </TooltipTextArea>
    <TooltipTextArea>
      <TooltipLanguage>Russian</TooltipLanguage>
      <TooltipText>{translate}</TooltipText>
    </TooltipTextArea>
  </TooltipBox>
);

export default TooltipComponent;

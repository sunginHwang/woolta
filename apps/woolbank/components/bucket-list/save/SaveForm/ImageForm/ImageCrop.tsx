import React, { FC, useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import styled, { useTheme } from 'styled-components';

import { IconCircleCheck } from '../../../../atom/Icon';
import Header from '../../../../common/Header';

interface Props {
  url: string;
  onBackClick: () => void;
  onCrop: (imageUrl: string) => void;
}

export const ImageCrop: FC<Props> = ({ url, onBackClick, onCrop }) => {
  const { colors } = useTheme();
  const cropperRef = useRef<ReactCropperElement>(null);

  /**
   * 크롭 완료 함수
   */
  const onCompleteCrop = () => {
    const cropper = cropperRef.current?.cropper;

    if (cropper) {
      onCrop(cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <SC.ImageCrop>
      <Header
        title='이미지 편집'
        right={
          <i onClick={onCompleteCrop}>
            <IconCircleCheck fill={colors.red500} />
          </i>
        }
        onBackClick={onBackClick}
      />
      <SC.Content>
        <Cropper
          ref={cropperRef}
          src={url}
          style={{ height: '400px', width: '100%' }}
          aspectRatio={16 / 9}
          guides={false}
        />
      </SC.Content>
    </SC.ImageCrop>
  );
};

const SC = {
  ImageCrop: styled.div`
    height: calc(100% + 5.5rem);
    width: 100%;
    background-color: ${({ theme }) => theme.colors.white};
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  `,
  Content: styled.div`
    margin-top: 5.5rem;

    /*!
 * Cropper.js v1.5.7
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2020-05-23T05:22:57.283Z
 */

    .cropper-container {
      direction: ltr;
      font-size: 0;
      line-height: 0;
      position: relative;
      -ms-touch-action: none;
      touch-action: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .cropper-container img {
      display: block;
      height: 100%;
      image-orientation: 0deg;
      max-height: none !important;
      max-width: none !important;
      min-height: 0 !important;
      min-width: 0 !important;
      width: 100%;
    }

    .cropper-wrap-box,
    .cropper-canvas,
    .cropper-drag-box,
    .cropper-crop-box,
    .cropper-modal {
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    .cropper-wrap-box,
    .cropper-canvas {
      overflow: hidden;
    }

    .cropper-drag-box {
      background-color: #fff;
      opacity: 0;
    }

    .cropper-modal {
      background-color: #000;
      opacity: 0.5;
    }

    .cropper-view-box {
      display: block;
      height: 100%;
      outline: 1px solid #39f;
      outline-color: rgba(51, 153, 255, 0.75);
      overflow: hidden;
      width: 100%;
    }

    .cropper-dashed {
      border: 0 dashed #eee;
      display: block;
      opacity: 0.5;
      position: absolute;
    }

    .cropper-dashed.dashed-h {
      border-bottom-width: 1px;
      border-top-width: 1px;
      height: calc(100% / 3);
      left: 0;
      top: calc(100% / 3);
      width: 100%;
    }

    .cropper-dashed.dashed-v {
      border-left-width: 1px;
      border-right-width: 1px;
      height: 100%;
      left: calc(100% / 3);
      top: 0;
      width: calc(100% / 3);
    }

    .cropper-center {
      display: block;
      height: 0;
      left: 50%;
      opacity: 0.75;
      position: absolute;
      top: 50%;
      width: 0;
    }

    .cropper-center::before,
    .cropper-center::after {
      background-color: #eee;
      content: ' ';
      display: block;
      position: absolute;
    }

    .cropper-center::before {
      height: 1px;
      left: -3px;
      top: 0;
      width: 7px;
    }

    .cropper-center::after {
      height: 7px;
      left: 0;
      top: -3px;
      width: 1px;
    }

    .cropper-face,
    .cropper-line,
    .cropper-point {
      display: block;
      height: 100%;
      opacity: 0.1;
      position: absolute;
      width: 100%;
    }

    .cropper-face {
      background-color: #fff;
      left: 0;
      top: 0;
    }

    .cropper-line {
      background-color: #39f;
    }

    .cropper-line.line-e {
      cursor: ew-resize;
      right: -3px;
      top: 0;
      width: 5px;
    }

    .cropper-line.line-n {
      cursor: ns-resize;
      height: 5px;
      left: 0;
      top: -3px;
    }

    .cropper-line.line-w {
      cursor: ew-resize;
      left: -3px;
      top: 0;
      width: 5px;
    }

    .cropper-line.line-s {
      bottom: -3px;
      cursor: ns-resize;
      height: 5px;
      left: 0;
    }

    .cropper-point {
      background-color: #515ec0;
      height: 1.5rem;
      opacity: 0.75;
      width: 1.5rem;
      border-radius: 50%;
    }

    .cropper-point.point-e {
      cursor: ew-resize;
      margin-top: -9px;
      right: -9px;
      top: 50%;
    }

    .cropper-point.point-n {
      cursor: ns-resize;
      left: 50%;
      margin-left: -9px;
      top: -9px;
    }

    .cropper-point.point-w {
      cursor: ew-resize;
      left: -9px;
      margin-top: -9px;
      top: 50%;
    }

    .cropper-point.point-s {
      bottom: -9px;
      cursor: s-resize;
      left: 50%;
      margin-left: -9px;
    }

    .cropper-point.point-ne {
      cursor: nesw-resize;
      right: -9px;
      top: -9px;
    }

    .cropper-point.point-nw {
      cursor: nwse-resize;
      left: -9px;
      top: -9px;
    }

    .cropper-point.point-sw {
      bottom: -9px;
      cursor: nesw-resize;
      left: -9px;
    }

    .cropper-point.point-se {
      bottom: -9px;
      cursor: nwse-resize;
      height: 20px;
      opacity: 1;
      right: -9px;
      width: 20px;
    }

    @media (min-width: 768px) {
      .cropper-point.point-se {
        height: 15px;
        width: 15px;
      }
    }

    @media (min-width: 992px) {
      .cropper-point.point-se {
        height: 10px;
        width: 10px;
      }
    }

    @media (min-width: 1200px) {
      .cropper-point.point-se {
        height: 5px;
        opacity: 0.75;
        width: 5px;
      }
    }

    .cropper-point.point-se::before {
      background-color: #39f;
      bottom: -50%;
      content: ' ';
      display: block;
      height: 200%;
      opacity: 0;
      position: absolute;
      right: -50%;
      width: 200%;
    }

    .cropper-invisible {
      opacity: 0;
    }

    .cropper-bg {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
    }

    .cropper-hide {
      display: block;
      height: 0;
      position: absolute;
      width: 0;
    }

    .cropper-hidden {
      display: none !important;
    }

    .cropper-move {
      cursor: move;
    }

    .cropper-crop {
      cursor: crosshair;
    }

    .cropper-disabled .cropper-drag-box,
    .cropper-disabled .cropper-face,
    .cropper-disabled .cropper-line,
    .cropper-disabled .cropper-point {
      cursor: not-allowed;
    }
  `,
};

export default ImageCrop;

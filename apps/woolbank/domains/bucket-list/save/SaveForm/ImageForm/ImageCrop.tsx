import * as stylex from '@stylexjs/stylex';
import { red500 } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import React, { type FC, useRef } from 'react';
import Cropper, { type ReactCropperElement } from 'react-cropper';

import { IconCircleCheck } from '../../../../../components/atom/Icon';
import { Header } from '../../../../../components/Header/Header';
import cropperCss from './cropper.module.css';

const styles = stylex.create({
  imageCrop: {
    height: 'calc(100% + 5.5rem)',
    width: '100%',
    backgroundColor: colorVars['--color-white'],
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  content: {
    marginTop: '5.5rem',
  },
});

const contentSx = stylex.props(styles.content);

interface Props {
  url: string;
  onBackClick: () => void;
  onCrop: (imageUrl: string) => void;
}

export const ImageCrop: FC<Props> = ({ url, onBackClick, onCrop }) => {
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
    <div {...stylex.props(styles.imageCrop)}>
      <Header
        title='이미지 편집'
        right={
          <i onClick={onCompleteCrop}>
            <IconCircleCheck fill={red500} />
          </i>
        }
        onBackClick={onBackClick}
      />
      <div {...contentSx} className={`${contentSx.className ?? ''} ${cropperCss.content}`}>
        <Cropper
          ref={cropperRef}
          src={url}
          style={{ height: '400px', width: '100%' }}
          aspectRatio={16 / 9}
          guides={false}
        />
      </div>
    </div>
  );
};

export default ImageCrop;

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type React from 'react';
import { type ComponentProps, type FC, useRef } from 'react';
import { IconCamera, IconImage } from '../../../../../components/atom/Icon';
import { FormTemplate } from '../../FormTemplate';
import { LabelText } from '../../LabelText';
import ImageCrop from './ImageCrop';
import { PrevImage } from './PrevImage';
import { useImageFile } from './useImageFIle';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

const styles = stylex.create({
  phase: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  subLabel: {
    fontSize: '1.2rem',
    marginTop: '-1rem',
    marginRight: 0,
    marginBottom: '2.5rem',
    marginLeft: 0,
    color: colorVars['--color-gray700'],
  },
  imgWrapper: {
    display: 'flex',
  },
  img: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colorVars['--color-white'],
  },
  imgButton: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-red500'],
    paddingBlock: '1rem',
    paddingInline: '0.5rem',
    width: '7rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0.8rem',
    marginRight: '1rem',
  },
  imgInput: {
    display: 'none',
  },
});

export const ImageForm: FC<Props> = ({ activeForm }) => {
  const { useCrop, previewImage, cropImage, setCrop, initImage, clearCrop, imageCrop } = useImageFile();
  const inputAlbumRef = useRef<HTMLInputElement>(null);
  const inputCameraRef = useRef<HTMLInputElement>(null);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const reader = new FileReader();
    const uploadFile = e.target.files && e.target.files[0];
    // 사진 파일 저장 및 미리보기(크롭포함) 랜더링
    reader.onloadend = () => {
      // 이미지 크롭 하기 위해 크롭 이미지 및 크롭 창 세팅
      setCrop(String(reader.result));
    };
    uploadFile && reader.readAsDataURL(uploadFile);
  };

  /**
   * 이미지 입력 초기화
   */
  const onInitImage = () => {
    initImage();
    if (inputAlbumRef && inputAlbumRef.current) {
      inputAlbumRef.current.value = '';
    }

    if (inputCameraRef && inputCameraRef.current) {
      inputCameraRef.current.value = '';
    }
  };

  const onPictureClick = () => {
    if (inputCameraRef.current) {
      inputCameraRef.current.click();
    }
  };

  const onAlbumClick = () => {
    if (inputAlbumRef.current) {
      inputAlbumRef.current.click();
    }
  };

  const showPrevImage = !useCrop && previewImage.length > 0;

  return (
    <FormTemplate useScroll title='이미지 설정' isValidForm activeForm={activeForm}>
      <div {...stylex.props(styles.phase)}>
        <LabelText>
          이루고 싶은 목표가 연상되는 <br />
          사진을 넣어보세요.
        </LabelText>
        <p {...stylex.props(styles.subLabel)}>
          눈으로 보는 목표야 말로 가장 큰 원동력이 될 수 있습니다.
          <br /> 목표를 이루어 지는 멋진 이미지를 상상해 보세요.
        </p>
        <div {...stylex.props(styles.imgWrapper)}>
          <div {...stylex.props(styles.img)}>
            <div {...stylex.props(styles.imgButton)} onClick={onPictureClick}>
              <IconCamera width={40} height={40} fill='#f03e3e' />
            </div>
            <input
              {...stylex.props(styles.imgInput)}
              type='file'
              ref={inputCameraRef}
              onChange={onChangeImage}
              accept='image/*'
              capture='environment'
            />
          </div>
          <div {...stylex.props(styles.img)}>
            <div {...stylex.props(styles.imgButton)} onClick={onAlbumClick}>
              <IconImage width={40} height={40} fill='#f03e3e' />
            </div>
            <input
              {...stylex.props(styles.imgInput)}
              ref={inputAlbumRef}
              type='file'
              onChange={onChangeImage}
              accept='image/gif, image/jpeg, image/png, image/jpg'
            />
          </div>
        </div>
      </div>
      {useCrop && <ImageCrop onCrop={imageCrop} url={cropImage} onBackClick={clearCrop} />}
      {showPrevImage && <PrevImage previewUrl={previewImage} onInitClick={onInitImage} />}
    </FormTemplate>
  );
};

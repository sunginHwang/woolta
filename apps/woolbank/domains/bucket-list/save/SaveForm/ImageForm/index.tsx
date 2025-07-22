import React, { ComponentProps, FC, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { IconCamera, IconImage } from '../../../../../components/atom/Icon';
import { FormTemplate } from '../../FormTemplate';
import { LabelText } from '../../LabelText';
import ImageCrop from './ImageCrop';
import { PrevImage } from './PrevImage';
import { useImageFile } from './useImageFIle';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

export const ImageForm: FC<Props> = ({ activeForm }) => {
  const { useCrop, previewImage, cropImage, setCrop, initImage, clearCrop, imageCrop } = useImageFile();
  const { colors } = useTheme();
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
      <SC.BucketListPicturePhase>
        <LabelText>
          이루고 싶은 목표가 연상되는 <br />
          사진을 넣어보세요.
        </LabelText>
        <SC.SubLabel>
          눈으로 보는 목표야 말로 가장 큰 원동력이 될 수 있습니다.
          <br /> 목표를 이루어 지는 멋진 이미지를 상상해 보세요.
        </SC.SubLabel>
        <SC.ImgWrapper>
          <SC.Img>
            <div onClick={onPictureClick}>
              <IconCamera width={40} height={40} fill={colors.red500} />
            </div>
            <input type='file' ref={inputCameraRef} onChange={onChangeImage} accept='image/*' capture='environment' />
          </SC.Img>
          <SC.Img>
            <div onClick={onAlbumClick}>
              <IconImage width={40} height={40} fill={colors.red500} />
            </div>
            <input
              ref={inputAlbumRef}
              type='file'
              onChange={onChangeImage}
              accept='image/gif, image/jpeg, image/png, image/jpg'
            />
          </SC.Img>
        </SC.ImgWrapper>
      </SC.BucketListPicturePhase>
      {useCrop && <ImageCrop onCrop={imageCrop} url={cropImage} onBackClick={clearCrop} />}
      {showPrevImage && <PrevImage previewUrl={previewImage} onInitClick={onInitImage} />}
    </FormTemplate>
  );
};

const SC = {
  BucketListPicturePhase: styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
  `,
  ImgWrapper: styled.div`
    display: flex;
  `,
  SubLabel: styled.p`
    font-size: 1.2rem;
    margin: -1rem 0 2.5rem 0;
    color: ${({ theme }) => theme.colors.gray700};
  `,
  Img: styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};

    > div {
      border: 0.1rem solid ${({ theme }) => theme.colors.red500};
      padding: 1rem 0.5rem;
      width: 7rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.8rem;
      margin-right: 1rem;
    }

    > input {
      display: none;
    }
  `,
};

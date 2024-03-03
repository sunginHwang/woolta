import { useToggle } from '@common';
import dayjs from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { dataURLtoFile, getExtensionByDataURL, resizeImage } from '../../../..//utils/file';
import { bucketFormAtom, setBucketImgAtom } from '../store';

export const useImageFile = () => {
  const { imageUrl } = useAtomValue(bucketFormAtom);
  const setBucketImg = useSetAtom(setBucketImgAtom);

  const [previewImage, setPreviewImage] = useState<string>(imageUrl ?? '');
  const [cropImage, setCropImage] = useState<string>('');
  const [useCrop, toggleCrop] = useToggle(false);

  const setCrop = (cropImage: string) => {
    toggleCrop(true);
    setCropImage(cropImage);
  };

  /**
   * 이미지 입력 초기화
   */
  const initImage = () => {
    setBucketImg({ mainImgFile: null });
    setPreviewImage('');
  };

  /**
   * 크롭 창 닫기
   */
  const clearCrop = () => {
    setCropImage('');
    toggleCrop(false);
  };

  /**
   * 이미지 영역 크롭
   */
  const imageCrop = async (cropUrl: string) => {
    const fileName = `${dayjs().format('YYYY_MM_DD')}_${Math.random() * Math.random()}.${getExtensionByDataURL(
      cropUrl,
    )}`;
    const originImage = dataURLtoFile(cropUrl, fileName);

    const resizeImageDataUrl = await resizeImage(originImage, 720, 600);

    // resize 된 이미지 preview로 다시 전환
    setPreviewImage(resizeImageDataUrl);
    setBucketImg({ mainImgFile: dataURLtoFile(resizeImageDataUrl, fileName) });
    // 크롭 작업 완료 후 크롭 메뉴 닫기
    clearCrop();
  };

  return {
    imageCrop,
    clearCrop,
    initImage,
    setCrop,
    previewImage,
    cropImage,
    useCrop,
  };
};

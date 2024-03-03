import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { IconCloseCircle } from '../../../../components/atom/Icon';

interface Props {
  previewUrl: string;
  onInitClick: () => void;
}

export const PrevImage: FC<Props> = ({ previewUrl, onInitClick }) => {
  const { colors } = useTheme();
  // 이미지가 없다면 미리보기 없음
  if (previewUrl === '') {
    return null;
  }

  return (
    <SC.PrevPicture>
      <img src={previewUrl} alt={previewUrl} />
      <SC.PrevPictureDeemed>
        <i onClick={onInitClick}>
          <IconCloseCircle width={30} height={30} fill={colors.red500} />
        </i>
      </SC.PrevPictureDeemed>
    </SC.PrevPicture>
  );
};

const SC = {
  PrevPicture: styled.div`
    margin: 2rem 0 10rem 0;
    position: relative;
    > img {
      width: 100%;
      height: auto;
    }
  `,
  PrevPictureDeemed: styled.div`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  `,
};

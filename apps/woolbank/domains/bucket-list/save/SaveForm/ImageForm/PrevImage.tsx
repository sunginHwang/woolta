import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';
import { IconCloseCircle } from '../../../../../components/atom/Icon';

interface Props {
  previewUrl: string;
  onInitClick: () => void;
}

const styles = stylex.create({
  prevPicture: {
    marginTop: '2rem',
    marginRight: 0,
    marginBottom: '10rem',
    marginLeft: 0,
    position: 'relative',
  },
  prevImage: {
    width: '100%',
    height: 'auto',
  },
  prevPictureDeemed: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  },
});

export const PrevImage: FC<Props> = ({ previewUrl, onInitClick }) => {
  // 이미지가 없다면 미리보기 없음
  if (previewUrl === '') {
    return null;
  }

  return (
    <div {...stylex.props(styles.prevPicture)}>
      <img {...stylex.props(styles.prevImage)} src={previewUrl} alt={previewUrl} />
      <div {...stylex.props(styles.prevPictureDeemed)}>
        <i onClick={onInitClick}>
          <IconCloseCircle width={30} height={30} fill='#f03e3e' />
        </i>
      </div>
    </div>
  );
};

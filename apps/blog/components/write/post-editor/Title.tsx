import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { useAtom } from 'jotai';
import type { ChangeEventHandler } from 'react';
import { postTitleAtom } from '../store';

const styles = stylex.create({
  input: {
    backgroundColor: colorVars['--color-white'],
    display: 'block',
    width: '100%',
    outlineStyle: 'none',
    borderStyle: 'none',
    paddingBlock: '8px',
    paddingInline: '16px',
  },
});

export const Title = () => {
  const [postTitle, setPostTitle] = useAtom(postTitleAtom);

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPostTitle(e.target.value);
  };

  return (
    <input
      {...stylex.props(typographyStyles.title1Medium, styles.input)}
      value={postTitle}
      onChange={handleTitleChange}
      placeholder='제목을 입력해 주세요.'
    />
  );
};

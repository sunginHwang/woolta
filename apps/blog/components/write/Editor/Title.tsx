import styled from '@emotion/styled';
import { white } from 'apps/blog/style/colors';
import { typography } from 'apps/blog/style/font';
import { postTitleAtom } from '../store';
import { useAtom } from 'jotai';
import { ChangeEventHandler } from 'react';

const Title = () => {
  const [postTitle, setPostTitle] = useAtom(postTitleAtom);

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPostTitle(e.target.value);
  };

  return <SC.Container value={postTitle} onChange={handleTitleChange} placeholder='제목을 입력해 주세요.' />;
};

export default Title;

const SC = {
  Container: styled.input`
    ${typography.title1Medium}
    background: ${white};
    display: block;
    padding: 0px;
    width: 100%;
    outline: none;
    border: none;
    padding: 8px 16px;
  `,
};

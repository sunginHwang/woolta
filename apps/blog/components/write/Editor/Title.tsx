import { styled } from 'styled-components';
import { typography } from '@wds';
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
    background-color: ${({ theme }) => theme.colors.white};
    display: block;
    padding: 0px;
    width: 100%;
    outline: none;
    border: none;
    padding: 8px 16px;
  `,
};

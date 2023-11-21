import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

type ContentProps = {
  editMode: boolean;
  children: React.ReactNode;
};

function Content({ editMode = false, children }: ContentProps) {
  return (
    <SC.Content css={editMode && editModeCss}>
      <div css={editMode ? editModeCss : noneEditModeCss}>{children}</div>
    </SC.Content>
  );
}

export default Content;

const SC = {
  Content: styled.div`
    background-color: ${({ theme }) => theme.colors.white};
  `,
};

const noneEditModeCss = css`
  min-height: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 100rem;
`;
const editModeCss = css`
  height: 100%;
  width: 100%;
  padding: 0;
`;

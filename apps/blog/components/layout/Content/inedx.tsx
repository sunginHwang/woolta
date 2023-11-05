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
      <div>{children}</div>
    </SC.Content>
  );
}

export default Content;

const SC = {
  Content: styled.div`
    background-color: ${({ theme }) => theme.colors.white} !important;
    > div {
      min-height: 100%;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      max-width: 100rem;
      padding: 8rem 0;
    }
  `,
};

const editModeCss = css`
  height: calc(100% - 6.2rem);
  min-height: calc(100% - 6.2rem);
  min-width: 100%;
  margin-top: 6rem;
  padding: 0;
`;

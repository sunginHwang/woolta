'use client';
import { Suspense } from 'react';
import styled from 'styled-components';
import { useAccountBookCategories } from '../save/hooks/useAccountBookCategories';

export const TestAccount = () => {
  const { accountBookCategories } = useAccountBookCategories();

  return (
    <div>
      <Suspense fallback={<div>12</div>}>
        {accountBookCategories.map((item) => {
          return (
            <div key={item.id}>
              <SCComp>{item.name}</SCComp>
            </div>
          );
        })}
      </Suspense>
    </div>
  );
};

const SCComp = styled.p`
  background-color: red;
  width: 100px;
  height: 100px;
`;

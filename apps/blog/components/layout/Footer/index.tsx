import styled from '@emotion/styled';
import layouts from '../../../style/layouts';
import { Text } from '@wds';
import { ComponentProps } from 'react';
import { useLayout } from '../hooks/useLayout';

const Footer = () => {
  const { isEditMode } = useLayout();

  if (!isEditMode) {
    return null;
  }

  return (
    <SC.Container>
      <Text {...text_style} mb={10}>
        Copyright © 2018 woolta.com
      </Text>
      <Text {...text_style}>gommpo111@gmail.com</Text>
    </SC.Container>
  );
};

export default Footer;

const text_style: Pick<ComponentProps<typeof Text>, 'variant' | 'color'> = {
  variant: 'body3',
  color: 'graySecondary',
};

const SC = {
  Container: styled.div`
    height: ${layouts.mainFooterHeight};
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.white};
    border-top: 0.1rem solid ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.blogPrimary};
    text-align: center;
    padding: 1.6rem 0 3rem;
  `,
};

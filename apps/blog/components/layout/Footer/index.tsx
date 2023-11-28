import styled from '@emotion/styled';
import { blogPrimary, customGray, white } from 'apps/blog/style/colors';
import layouts from '../../../style/layouts';
import Text from '../../base/Text';

type FooterProps = {
  editMode?: boolean;
};

function Footer({ editMode = false }: FooterProps) {
  if (editMode) return null;

  return (
    <SC.Container>
      <Text variant='body3' color='graySecondary' mb={10}>
        Copyright © 2018 woolta.com
      </Text>
      <Text variant='body3' color='graySecondary'>
        gommpo111@gmail.com
      </Text>
    </SC.Container>
  );
}

export default Footer;

const SC = {
  Container: styled.div`
    height: ${layouts.mainFooterHeight};
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${white};
    border-top: 0.1rem solid ${({ theme }) => theme.colors.bgSecondary};
    color: ${blogPrimary};
    text-align: center;
    padding: 1.6rem 0 3rem;
  `,
};

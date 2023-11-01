import styled from '@emotion/styled';
import { blog_primary, customGray, white } from 'apps/blog/style/colors';
import layouts from '../../../style/layouts';

type FooterProps = {
  editMode: boolean;
};

function Footer({ editMode }: FooterProps) {
  if (editMode) return null;

  return (
    <SC.Container>
      <p>Copyright © 2018 woolta.com</p>
      <p>gommpo111@gmail.com</p>
    </SC.Container>
  );
}

Footer.defaultProps = {
  editMode: false,
} as FooterProps;

export default Footer;

const SC = {
  Container: styled.div`
    height: ${layouts.mainFooterHeight};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${white};
    border-top: 0.1rem solid ${customGray};
    color: ${blog_primary};
    text-align: center;
    padding-top: 1.6rem;

    P {
      font-size: 1.4rem;
      margin-bottom: 1.6rem;
    }
  `,
};

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { FC, PropsWithChildren } from 'react';
import { usePwa } from '../../hooks/usePwa';
import Loading from '../common/loading/Loading';
import NotificationBar from '../common/notification-bar/NotificationBar';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';
import { useLayout } from './hooks/useLayout';

const styles = stylex.create({
  content: {
    backgroundColor: colorVars['--color-white'],
  },
  noneEditModeCss: {
    minHeight: '100%',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '80rem',
  },
  editModeCss: {
    height: '100%',
    width: '100%',
    padding: 0,
  },
});

const Layout: FC<PropsWithChildren> = ({ children }) => {
  usePwa();
  const { isEditMode } = useLayout();
  const spinnerLoading = false;

  return (
    <main {...stylex.props(styles.content)}>
      <Header />
      <Loading isLoading={spinnerLoading} />
      <div {...stylex.props(isEditMode ? styles.editModeCss : styles.noneEditModeCss)}>{children}</div>
      <NotificationBar />
      <Footer />
    </main>
  );
};

export default Layout;

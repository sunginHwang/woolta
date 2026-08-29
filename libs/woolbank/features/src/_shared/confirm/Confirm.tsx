'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { FC, PropsWithChildren } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Deem from '../components/deem/Deem';

interface Props extends PropsWithChildren {
  isOpen?: boolean;
  message: string;
  loading?: boolean;
  confirmMsg?: string;
  cancelMsg?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * 커스텀 Confirm 모달
 * @component
 */
export const Confirm: FC<Props> = ({
  isOpen = false,
  message,
  loading = false,
  confirmMsg = '확인',
  cancelMsg = '취소',
  onConfirm,
  onCancel,
}) => {
  return (
    <Deem data-cy='confirmModal' visible={isOpen}>
      <div {...stylex.props(styles.modalWrapper)}>
        <div {...stylex.props(styles.confirmModal)}>
          <div {...stylex.props(styles.content)}>
            <Text variant='body3' color='gray700' as='p' xstyle={styles.message}>
              {message}
            </Text>
          </div>
          <div {...stylex.props(styles.footer)}>
            {loading && (
              <div {...stylex.props(styles.loading)}>
                <ClipLoader size={20} color={colorVars['--color-orangePrimary']} />
              </div>
            )}
            {!loading && (
              <div {...stylex.props(styles.buttons)}>
                <button {...stylex.props(styles.button)} data-cy='icoCancel' onClick={onCancel}>
                  {cancelMsg}
                </button>
                <button {...stylex.props(styles.button, styles.confirmButton)} data-cy='icoConfirm' onClick={onConfirm}>
                  {confirmMsg}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Deem>
  );
};

const styles = stylex.create({
  confirmModal: {
    width: '80%',
    maxWidth: '68rem',
    borderRadius: '0.8rem',
    textAlign: 'center',
    backgroundColor: colorVars['--color-bgSurface'],
    zIndex: zIndexConsts.modalDeem,
    boxShadow: '0 0.2rem 1rem rgba(0, 0, 0, 0.35)',
  },
  modalWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '4rem',
    paddingBottom: '4rem',
  },
  message: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '5.5rem',
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-borderSubtle'],
  },
  buttons: {
    width: '100%',
    display: 'flex',
  },
  button: {
    ...typographyStyles.body2,
    width: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colorVars['--color-textPrimary'],
  },
  confirmButton: {
    color: colorVars['--color-orangePrimary'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colorVars['--color-borderSubtle'],
  },
});

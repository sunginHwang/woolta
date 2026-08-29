import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { FC, type PropsWithChildren } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Deem from '../atom/Deem';

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
export const Confirm = ({
  isOpen = false,
  message,
  loading = false,
  confirmMsg = '확인',
  cancelMsg = '취소',
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Deem data-cy='confirmModal' visible={isOpen}>
      <div {...stylex.props(styles.modalWrapper)}>
        <div {...stylex.props(styles.confirmModal)}>
          <div {...stylex.props(styles.content)}>
            <Text variant='body3' color='gray700' as='p' xstyle={styles.contentText}>
              {message}
            </Text>
          </div>
          <div {...stylex.props(styles.footer)}>
            {loading && (
              <div {...stylex.props(styles.loading)}>
                <ClipLoader size={20} color='#f25e5e' />
              </div>
            )}
            {!loading && (
              <div {...stylex.props(styles.buttons)}>
                <button
                  type='button'
                  data-cy='icoCancel'
                  onClick={onCancel}
                  {...stylex.props(typographyStyles.body2, styles.button)}
                >
                  {cancelMsg}
                </button>
                <button
                  type='button'
                  data-cy='icoConfirm'
                  onClick={onConfirm}
                  {...stylex.props(typographyStyles.body2, styles.button, styles.confirmButton)}
                >
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
    backgroundColor: colorVars['--color-white'],
    zIndex: '501',
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
    paddingBlock: '4rem',
    paddingInline: 0,
  },
  contentText: {
    paddingInline: '2rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '5.5rem',
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-gray150'],
  },
  buttons: {
    width: '100%',
    display: 'flex',
  },
  button: {
    width: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'none',
    borderWidth: 0,
    borderStyle: 'none',
    cursor: 'pointer',
    color: colorVars['--color-black'],
  },
  confirmButton: {
    color: colorVars['--color-orangePrimary'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colorVars['--color-gray150'],
  },
});

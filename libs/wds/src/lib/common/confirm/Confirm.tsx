'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '../../atom/Text';
import { colorVars, zIndexConsts } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

interface Props {
  /** 모달 표시 여부 */
  isOpen?: boolean;
  /** 확인 메시지 */
  message: string;
  /** 처리 중 여부 — true 면 버튼 대신 진행 문구를 표시한다 */
  loading?: boolean;
  /**
   * 확인 버튼 문구
   * @default '확인'
   */
  confirmMsg?: string;
  /**
   * 취소 버튼 문구
   * @default '취소'
   */
  cancelMsg?: string;
  /** 확인 클릭 시 호출 */
  onConfirm?: () => void;
  /** 취소 클릭 시 호출 */
  onCancel?: () => void;
}

const styles = stylex.create({
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorVars['--color-bgOverlay'],
    zIndex: zIndexConsts.modalDeem,
  },
  modal: {
    width: '80%',
    maxWidth: '40rem',
    borderRadius: '0.8rem',
    textAlign: 'center',
    backgroundColor: colorVars['--color-bgSurface'],
    boxShadow: '0 0.2rem 1rem rgba(0, 0, 0, 0.35)',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: '4rem',
    paddingInline: 0,
  },
  message: {
    paddingInline: '2rem',
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    color: colorVars['--color-textPrimary'],
  },
  // 원본의 :last-child 규칙 — 확인(마지막) 버튼만 강조 색상
  confirmButton: {
    color: colorVars['--color-interactivePrimary'],
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colorVars['--color-borderSubtle'],
  },
});

/**
 * WDS 공용 Confirm 모달. ConfirmProvider 를 통해 사용한다.
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
  if (!isOpen) {
    return null;
  }

  return (
    <div data-cy='confirmModal' {...stylex.props(styles.overlay)}>
      <div {...stylex.props(styles.modal)}>
        <div {...stylex.props(styles.content)}>
          <Text variant='body3' color='textPrimary' as='p' xstyle={styles.message}>
            {message}
          </Text>
        </div>
        <div {...stylex.props(styles.footer)}>
          {loading ? (
            <div {...stylex.props(styles.loading)}>
              <Text variant='body3' color='textTertiary'>
                처리 중...
              </Text>
            </div>
          ) : (
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
  );
};

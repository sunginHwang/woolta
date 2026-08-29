'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useAtomValue } from 'jotai';
import React from 'react';
import Deem from '../../../components/atom/Deem';
import { useAlert } from '../../../hooks/useAlert';
import { alertAtom } from '../../../store/layout';

const styles = stylex.create({
  modalWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    width: '80%',
    maxWidth: '68rem',
    borderRadius: '0.8rem',
    textAlign: 'center',
    backgroundColor: colorVars['--color-white'],
    zIndex: 501,
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
    fontSize: '1.4rem',
    paddingBlock: 0,
    paddingInline: '2rem',
    color: colorVars['--color-gray900'],
  },
  footer: {
    display: 'flex',
    height: '5rem',
    paddingTop: 0,
    paddingRight: '2rem',
    paddingBottom: '2rem',
    paddingLeft: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    fontSize: '1.6rem',
    height: '100%',
    borderRadius: '0.8rem',
    color: colorVars['--color-white'],
    backgroundColor: colorVars['--color-red500'],
  },
});

export const Alert = () => {
  const alertMessage = useAtomValue(alertAtom);
  const { offAlert } = useAlert();

  const isShowAlert = alertMessage !== '';

  return (
    <Deem visible={isShowAlert}>
      <div {...stylex.props(styles.modalWrapper)}>
        <div {...stylex.props(styles.confirmModal)}>
          <div {...stylex.props(styles.content)}>
            <p {...stylex.props(styles.message)}>{alertMessage}</p>
          </div>
          <div {...stylex.props(styles.footer)}>
            <button {...stylex.props(styles.button)} onClick={offAlert}>
              확인
            </button>
          </div>
        </div>
      </div>
    </Deem>
  );
};

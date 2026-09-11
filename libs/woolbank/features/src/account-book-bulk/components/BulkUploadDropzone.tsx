'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { type DragEvent, useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { CARD_STATEMENT_ADAPTERS } from '../adapters/registry';

interface Props {
  isParsing: boolean;
  errorMessage: string;
  onFileSelect: (file: File) => void;
}

const styles = stylex.create({
  zone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    paddingBlock: '5rem',
    paddingInline: '2rem',
    borderWidth: '0.2rem',
    borderStyle: 'dashed',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':hover': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '1.2rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    cursor: 'pointer',
  },
  zoneDragging: {
    borderColor: colorVars['--color-interactivePrimary'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  icon: {
    color: colorVars['--color-textTertiary'],
  },
  hiddenInput: {
    display: 'none',
  },
  error: {
    paddingTop: '1.2rem',
  },
});

/**
 * 카드 내역서 업로드 영역.
 * 지원 카드사 목록은 어댑터 레지스트리에서 그대로 읽는다 — 어댑터를 추가하면 안내 문구도 따라 늘어난다.
 */
export const BulkUploadDropzone = ({ isParsing, errorMessage, onFileSelect }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <div
        {...stylex.props(styles.zone, isDragging && styles.zoneDragging)}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span {...stylex.props(styles.icon)}>
          <FiUploadCloud size={36} />
        </span>
        <Text as='p' variant='body2' color='textPrimary' alignment='center'>
          {isParsing ? '파일을 읽는 중이에요' : '카드 내역서 파일을 끌어다 놓거나 클릭해서 선택하세요'}
        </Text>
        <Text as='p' variant='small2Regular' color='textTertiary' alignment='center'>
          지원: {CARD_STATEMENT_ADAPTERS.map((adapter) => adapter.label).join(' · ')}
        </Text>
        <input
          ref={inputRef}
          {...stylex.props(styles.hiddenInput)}
          type='file'
          accept='.xls,.xlsx,.csv,.html,text/html'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileSelect(file);
            }
            // 같은 파일을 다시 고를 수 있게 값을 비운다
            e.target.value = '';
          }}
        />
      </div>
      {errorMessage !== '' && (
        <div {...stylex.props(styles.error)}>
          <Text as='p' variant='small2Regular' color='statusError'>
            {errorMessage}
          </Text>
        </div>
      )}
    </div>
  );
};

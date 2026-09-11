'use client';

import * as stylex from '@stylexjs/stylex';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useMemo, useState } from 'react';
import { fetchAccountBookList, getAccountBookListQueryKey } from '../_shared/hooks/accountBookListApi';
import { useToast } from '../_shared/toast/useToast';
import { useAccountBookCategories } from '../account-book-form/_common/hooks/useAccountBookCategories';
import { parseStatement, readStatementFile, UnsupportedStatementError } from './adapters/registry';
import type { ParsedStatementRow } from './adapters/types';
import { BulkUploadDropzone } from './components/BulkUploadDropzone';
import { BulkUploadTable } from './components/BulkUploadTable';
import { useBulkUploadDraft } from './hooks/useBulkUploadDraft';
import { useCreateAccountBookBulk } from './hooks/useCreateAccountBookBulk';
import { findDuplicateSourceKeys, getCoveredMonths } from './utils/findDuplicates';

interface ParsedState {
  rows: ParsedStatementRow[];
  adapterLabel: string;
  fileName: string;
  skipped: { reason: string; count: number }[];
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '1.6rem',
    // 위쪽은 화면이 제공하는 뒤로가기 줄과 이어지므로 좁게 둔다
    paddingBlock: '1.2rem 2rem',
    paddingInline: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1.2rem',
  },
  summary: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.8rem',
  },
  chip: {
    paddingBlock: '0.3rem',
    paddingInline: '0.8rem',
    borderRadius: '999px',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  chipWarning: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-statusWarning'],
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    flexShrink: 0,
  },
  resetButton: {
    paddingBlock: '0.7rem',
    paddingInline: '1.2rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textSecondary'],
    fontSize: '1.3rem',
    cursor: 'pointer',
  },
  submitButton: {
    paddingBlock: '0.7rem',
    paddingInline: '1.6rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    color: colorVars['--color-textInverse'],
    fontSize: '1.3rem',
    fontWeight: 600,
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
  },
});

/** 가계부 벌크 업로드 — 파일 업로드 → 정제 → 편집 → 일괄 등록 */
export const AccountBookBulkUpload = () => {
  const { onToast } = useToast();
  const [parsed, setParsed] = useState<ParsedState | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = async (file: File) => {
    setIsParsing(true);
    setErrorMessage('');

    try {
      const { adapter, rows, skipped } = parseStatement(await readStatementFile(file));

      if (rows.length === 0) {
        setErrorMessage('등록할 내역이 없어요. 취소분만 있거나 형식이 비어 있는 파일일 수 있어요.');
        return;
      }

      setParsed({ rows, adapterLabel: adapter.label, fileName: file.name, skipped });
    } catch (error) {
      setErrorMessage(
        error instanceof UnsupportedStatementError
          ? error.message
          : '파일을 읽지 못했어요. 카드사에서 받은 원본 파일인지 확인해주세요.',
      );
    } finally {
      setIsParsing(false);
    }
  };

  if (parsed === null) {
    return (
      <div {...stylex.props(styles.container)}>
        <div>
          <Text as='h2' variant='title4Bold' color='textPrimary'>
            벌크 업로드
          </Text>
          <Text as='p' variant='small2Regular' color='textTertiary'>
            카드 내역서를 올려 한 달치를 한 번에 등록해요. 취소된 내역은 자동으로 제외돼요.
          </Text>
        </div>
        <BulkUploadDropzone isParsing={isParsing} errorMessage={errorMessage} onFileSelect={handleFileSelect} />
      </div>
    );
  }

  return (
    <BulkUploadEditor
      key={parsed.fileName + parsed.rows.length}
      parsed={parsed}
      onReset={() => {
        setParsed(null);
        setErrorMessage('');
      }}
      onDone={(count) => {
        onToast(`${count}건 등록을 마쳤어요.`);
        setParsed(null);
      }}
    />
  );
};

interface EditorProps {
  parsed: ParsedState;
  onReset: () => void;
  onDone: (count: number) => void;
}

const BulkUploadEditor = ({ parsed, onReset, onDone }: EditorProps) => {
  const { onToast } = useToast();
  const { accountBookCategories } = useAccountBookCategories();
  const { createBulk, isCreating } = useCreateAccountBookBulk();

  /**
   * 중복 검사를 위해 내역이 걸친 달의 기존 목록을 불러온다.
   * 서버 목록 쿼리가 달 단위라 두 달치를 올리면 두 번 조회한다.
   */
  const months = useMemo(() => getCoveredMonths(parsed.rows), [parsed.rows]);
  const existingQueries = useSuspenseQueries({
    queries: months.map((month) => ({
      queryKey: getAccountBookListQueryKey(`${month}-01`),
      queryFn: () => fetchAccountBookList(`${month}-01`),
    })),
  });

  const duplicateSourceKeys = useMemo(
    () =>
      findDuplicateSourceKeys(
        parsed.rows,
        existingQueries.flatMap((query) => query.data),
      ),
    [parsed.rows, existingQueries],
  );

  const {
    draftRows,
    selectedRows,
    missingCategoryCount,
    duplicateCount,
    patchRow,
    selectCategory,
    toggleAll,
    removeRow,
  } = useBulkUploadDraft({ rows: parsed.rows, categories: accountBookCategories, duplicateSourceKeys });

  const totalAmount = selectedRows.reduce((sum, row) => sum + row.amount, 0);
  const canSubmit = selectedRows.length > 0 && missingCategoryCount === 0 && !isCreating;

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (missingCategoryCount > 0) {
        onToast(`카테고리를 지정하지 않은 내역이 ${missingCategoryCount}건 있어요.`);
      }
      return;
    }

    try {
      await createBulk(selectedRows);
      onDone(selectedRows.length);
    } catch (error) {
      onToast(error instanceof Error ? error.message : '등록에 실패했어요.');
    }
  };

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <div>
          <Text as='h2' variant='title4Bold' color='textPrimary'>
            {parsed.adapterLabel} 내역 {draftRows.length}건
          </Text>
          <div {...stylex.props(styles.summary)}>
            <span {...stylex.props(styles.chip)}>
              <Text variant='small2Regular' color='textSecondary'>
                선택 {selectedRows.length}건 · {totalAmount.toLocaleString('ko-KR')}원
              </Text>
            </span>
            {parsed.skipped.map((item) => (
              <span key={item.reason} {...stylex.props(styles.chip)}>
                <Text variant='small2Regular' color='textTertiary'>
                  {item.reason} {item.count}건 제외
                </Text>
              </span>
            ))}
            {duplicateCount > 0 && (
              <span {...stylex.props(styles.chip, styles.chipWarning)}>
                <Text variant='small2Regular' color='statusWarning'>
                  중복 의심 {duplicateCount}건 — 기본 해제됨
                </Text>
              </span>
            )}
            {missingCategoryCount > 0 && (
              <span {...stylex.props(styles.chip, styles.chipWarning)}>
                <Text variant='small2Regular' color='statusWarning'>
                  카테고리 미지정 {missingCategoryCount}건
                </Text>
              </span>
            )}
          </div>
        </div>
        <div {...stylex.props(styles.actions)}>
          <button type='button' {...stylex.props(styles.resetButton)} onClick={onReset}>
            다시 올리기
          </button>
          <button type='button' disabled={!canSubmit} {...stylex.props(styles.submitButton)} onClick={handleSubmit}>
            {isCreating ? '등록 중…' : `${selectedRows.length}건 등록`}
          </button>
        </div>
      </div>

      <BulkUploadTable
        rows={draftRows}
        categories={accountBookCategories}
        onPatchRow={patchRow}
        onSelectCategory={selectCategory}
        onToggleAll={toggleAll}
        onRemoveRow={removeRow}
      />
    </div>
  );
};

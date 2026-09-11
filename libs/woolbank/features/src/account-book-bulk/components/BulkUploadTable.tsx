'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { FiTrash2 } from 'react-icons/fi';
import type { AccountBookCategory } from '../../account-book-form/_common/hooks/useAccountBookCategories';
import type { BulkDraftRow } from '../hooks/useBulkUploadDraft';
import { CategoryAutocomplete } from './CategoryAutocomplete';

interface Props {
  rows: BulkDraftRow[];
  categories: AccountBookCategory[];
  onPatchRow: (sourceKey: string, patch: Partial<BulkDraftRow>) => void;
  onSelectCategory: (sourceKey: string, categoryId: number) => void;
  onToggleAll: (isSelected: boolean) => void;
  onRemoveRow: (sourceKey: string) => void;
}

const TYPE_OPTIONS = [
  { value: 'EXPENDITURE' as const, label: '지출' },
  { value: 'INCOME' as const, label: '수입' },
];

const styles = stylex.create({
  wrapper: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '1rem',
  },
  table: {
    width: '100%',
    // 컬럼 폭을 colgroup 으로 고정한다 — auto 레이아웃이면 넓은 화면에서 제목이 다 먹고
    // 구분·카테고리가 콘텐츠 폭으로 쪼그라든다
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
  },
  headRow: {
    position: 'sticky',
    top: 0,
    backgroundColor: colorVars['--color-bgSurface'],
  },
  headCell: {
    paddingBlock: '0.9rem',
    paddingInline: '0.8rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    color: colorVars['--color-textTertiary'],
    fontSize: '1.15rem',
    fontWeight: 600,
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  row: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  /**
   * 선택 해제 행은 흐리게 보이되 **opacity 를 쓰지 않는다.**
   * opacity < 1 은 쌓임 맥락을 만들어, 이 행 안의 카테고리 드롭다운이 z-index 를 줘도
   * 아래 행에 가려진다(= 중복 의심 행에서 카테고리를 아예 못 고르게 된다).
   * 글자색만 죽여 같은 인상을 낸다.
   */
  rowUnselected: {
    color: colorVars['--color-textDisabled'],
  },
  cell: {
    paddingBlock: '0.5rem',
    paddingInline: '0.8rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    verticalAlign: 'middle',
  },
  dateCell: {
    whiteSpace: 'nowrap',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
  },
  input: {
    width: '100%',
    paddingBlock: '0.5rem',
    paddingInline: '0.7rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus-visible': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.2rem',
    outline: 'none',
  },
  amountInput: {
    textAlign: 'right',
  },
  select: {
    // 셀 폭을 그대로 채운다 — 기본 select 는 콘텐츠 폭이라 "지출" 두 글자만큼 작아진다
    width: '100%',
    paddingBlock: '0.55rem',
    paddingInline: '0.8rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus-visible': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    cursor: 'pointer',
    outline: 'none',
  },
  removeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.8rem',
    height: '2.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.6rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    cursor: 'pointer',
  },
  duplicateBadge: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    paddingBlock: '0.1rem',
    paddingInline: '0.5rem',
    borderRadius: '999px',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-statusWarning'],
    color: colorVars['--color-statusWarning'],
    fontSize: '1.05rem',
    whiteSpace: 'nowrap',
  },
  note: {
    paddingTop: '0.2rem',
  },
});

/**
 * 행 간 포커스 이동.
 *
 * ref 배열 대신 data 속성으로 찾는다 — 행이 삭제되면 인덱스가 밀리는데,
 * ref 배열은 그때 조용히 어긋난 칸을 가리킨다. DOM 을 직접 조회하면 항상 현재 화면과 맞는다.
 */
const focusCell = (index: number, field: 'title' | 'category') => {
  const target = document.querySelector<HTMLInputElement>(`[data-bulk-index="${index}"][data-bulk-field="${field}"]`);
  target?.focus();
  target?.select();
};

/**
 * 벌크 편집 표.
 *
 * 날짜는 내역서가 사실이므로 읽기 전용이고, 제목·금액·카테고리·수입지출만 고칠 수 있다.
 * 카테고리를 고르면 같은 가맹점의 미지정 행에 함께 적용된다(useBulkUploadDraft).
 */
export const BulkUploadTable = ({
  rows,
  categories,
  onPatchRow,
  onSelectCategory,
  onToggleAll,
  onRemoveRow,
}: Props) => {
  const isAllSelected = rows.length > 0 && rows.every((row) => row.isSelected);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <table {...stylex.props(styles.table)}>
        {/* tableLayout: fixed 와 짝 — 제목만 남는 폭을 가져가고 나머지는 고정된다 */}
        <colgroup>
          <col width='44' />
          <col width='150' />
          <col />
          <col width='220' />
          <col width='140' />
          <col width='110' />
          <col width='56' />
        </colgroup>
        <thead>
          <tr {...stylex.props(styles.headRow)}>
            <th {...stylex.props(styles.headCell)}>
              <input
                type='checkbox'
                aria-label='전체 선택'
                checked={isAllSelected}
                onChange={(e) => onToggleAll(e.target.checked)}
              />
            </th>
            <th {...stylex.props(styles.headCell)}>날짜</th>
            <th {...stylex.props(styles.headCell)}>제목</th>
            <th {...stylex.props(styles.headCell)}>카테고리</th>
            <th {...stylex.props(styles.headCell)}>금액</th>
            <th {...stylex.props(styles.headCell)}>구분</th>
            <th {...stylex.props(styles.headCell)} aria-label='삭제' />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.sourceKey} {...stylex.props(styles.row, !row.isSelected && styles.rowUnselected)}>
              <td {...stylex.props(styles.cell)}>
                <input
                  type='checkbox'
                  aria-label={`${row.title} 선택`}
                  checked={row.isSelected}
                  onChange={(e) => onPatchRow(row.sourceKey, { isSelected: e.target.checked })}
                />
              </td>
              <td {...stylex.props(styles.cell, styles.dateCell)}>
                {dayjs(row.date).format('M/D (ddd)')}
                {row.isDuplicate && <span {...stylex.props(styles.duplicateBadge)}>중복 의심</span>}
                {row.note && (
                  <div {...stylex.props(styles.note)}>
                    <Text variant='small3Regular' color='textTertiary'>
                      {row.note}
                    </Text>
                  </div>
                )}
              </td>
              <td {...stylex.props(styles.cell)}>
                <input
                  {...stylex.props(styles.input)}
                  aria-label='제목'
                  data-bulk-index={index}
                  data-bulk-field='title'
                  value={row.title}
                  onChange={(e) => onPatchRow(row.sourceKey, { title: e.target.value })}
                  onKeyDown={(e) => {
                    // 제목을 고치고 Enter 로 바로 옆 카테고리로 넘어간다
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      focusCell(index, 'category');
                    }
                  }}
                />
              </td>
              <td {...stylex.props(styles.cell)}>
                <CategoryAutocomplete
                  value={row.categoryId}
                  type={row.type}
                  categories={categories}
                  inputProps={{ 'data-bulk-index': index, 'data-bulk-field': 'category' }}
                  onSelect={(categoryId) => onSelectCategory(row.sourceKey, categoryId)}
                  // 확정하면 다음 행 제목으로 — 키보드만으로 죽 내려가며 편집한다
                  onKeyboardCommit={() => focusCell(index + 1, 'title')}
                />
              </td>
              <td {...stylex.props(styles.cell)}>
                <input
                  {...stylex.props(styles.input, styles.amountInput)}
                  aria-label='금액'
                  inputMode='numeric'
                  value={row.amount.toLocaleString('ko-KR')}
                  onChange={(e) => {
                    const parsed = Number(e.target.value.replace(/[^\d]/g, ''));
                    onPatchRow(row.sourceKey, { amount: Number.isFinite(parsed) ? parsed : 0 });
                  }}
                />
              </td>
              <td {...stylex.props(styles.cell)}>
                <select
                  {...stylex.props(styles.select)}
                  aria-label='수입 지출 구분'
                  value={row.type}
                  onChange={(e) => {
                    // 구분이 바뀌면 기존 카테고리는 타입이 안 맞으므로 비운다
                    onPatchRow(row.sourceKey, {
                      type: e.target.value as BulkDraftRow['type'],
                      categoryId: null,
                    });
                  }}
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td {...stylex.props(styles.cell)}>
                <button
                  type='button'
                  title='이 내역 삭제'
                  aria-label={`${row.title} 삭제`}
                  {...stylex.props(styles.removeButton)}
                  onClick={() => onRemoveRow(row.sourceKey)}
                >
                  <FiTrash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { AccountBookCategory } from '../../account-book-form/_common/hooks/useAccountBookCategories';
import type { ParsedStatementRow } from '../adapters/types';
import { useMerchantCategoryMemory } from './useMerchantCategoryMemory';

/** 편집 중인 한 행 — 원본(ParsedStatementRow)에 사용자가 정하는 값이 붙는다. */
export interface BulkDraftRow extends ParsedStatementRow {
  /** 등록할 제목. 기본값은 가맹점명 */
  title: string;
  /** 선택된 카테고리. 미지정이면 등록 불가 */
  categoryId: number | null;
  /** 이 행을 등록할지 */
  isSelected: boolean;
  /** 기존 내역과 겹쳐 보이는지 */
  isDuplicate: boolean;
}

interface Params {
  rows: ParsedStatementRow[];
  categories: AccountBookCategory[];
  duplicateSourceKeys: Set<string>;
}

/**
 * 벌크 업로드 편집 상태.
 *
 * 파싱 결과를 받아 편집 가능한 초안으로 만들고, 행 단위 수정과 일괄 적용을 제공한다.
 * 가맹점 기억이 있으면 카테고리를 미리 채워 사용자가 손댈 행을 줄인다.
 */
export const useBulkUploadDraft = ({ rows, categories, duplicateSourceKeys }: Params) => {
  const { recall, remember } = useMerchantCategoryMemory();

  const categoryIds = useMemo(() => categories.map((category) => Number(category.id)), [categories]);

  const buildInitial = useCallback(
    (): BulkDraftRow[] =>
      rows.map((row) => ({
        ...row,
        title: row.title,
        categoryId: recall(row.merchant, categoryIds),
        // 중복 의심 행은 기본으로 빼둔다 — 실수로 두 번 넣는 쪽이 빠뜨리는 쪽보다 되돌리기 어렵다
        isSelected: !duplicateSourceKeys.has(row.sourceKey),
        isDuplicate: duplicateSourceKeys.has(row.sourceKey),
      })),
    [rows, categoryIds, duplicateSourceKeys, recall],
  );

  const [draftRows, setDraftRows] = useState<BulkDraftRow[]>(buildInitial);

  const patchRow = useCallback((sourceKey: string, patch: Partial<BulkDraftRow>) => {
    setDraftRows((prev) => prev.map((row) => (row.sourceKey === sourceKey ? { ...row, ...patch } : row)));
  }, []);

  /**
   * 카테고리 지정은 가맹점 기억까지 갱신하고, **같은 가맹점의 미지정 행에 함께 적용**한다.
   * 내역서는 같은 가맹점이 수십 번 반복되므로 한 건씩 고르면 벌크의 의미가 없다.
   * 이미 사용자가 정한 행은 건드리지 않는다.
   */
  const selectCategory = useCallback(
    (sourceKey: string, categoryId: number) => {
      const target = draftRows.find((row) => row.sourceKey === sourceKey);
      if (!target) {
        return;
      }

      // 가맹점 기억은 setState 업데이터 **밖에서** 부른다.
      // 업데이터는 렌더 중에 실행될 수 있어, 그 안에서 다른 스토어를 갱신하면
      // "Cannot update a component while rendering a different component" 가 된다.
      remember(target.merchant, categoryId);

      setDraftRows((prev) =>
        prev.map((row) => {
          if (row.sourceKey === sourceKey) {
            return { ...row, categoryId };
          }
          return row.merchant === target.merchant && row.categoryId === null ? { ...row, categoryId } : row;
        }),
      );
    },
    [draftRows, remember],
  );

  const toggleAll = useCallback((isSelected: boolean) => {
    setDraftRows((prev) => prev.map((row) => ({ ...row, isSelected })));
  }, []);

  /**
   * 행을 목록에서 아예 뺀다.
   * 체크 해제와 달리 되돌릴 수 없지만, 화면에서 사라져 남은 행에 집중할 수 있다 —
   * 100건이 넘는 목록에서 "안 넣을 건 지워버리는" 편집 방식이 실제로 더 빠르다.
   * (아직 서버에 올라간 게 없으므로 지우는 대상은 초안뿐이다)
   */
  const removeRow = useCallback((sourceKey: string) => {
    setDraftRows((prev) => prev.filter((row) => row.sourceKey !== sourceKey));
  }, []);

  const selectedRows = useMemo(() => draftRows.filter((row) => row.isSelected), [draftRows]);
  const missingCategoryCount = useMemo(
    () => selectedRows.filter((row) => row.categoryId === null).length,
    [selectedRows],
  );

  return {
    draftRows,
    selectedRows,
    /** 선택됐지만 카테고리가 없는 행 수 — 0 이어야 등록할 수 있다 */
    missingCategoryCount,
    duplicateCount: draftRows.filter((row) => row.isDuplicate).length,
    patchRow,
    selectCategory,
    toggleAll,
    removeRow,
  };
};

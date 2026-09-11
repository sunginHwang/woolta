'use client';

import { useCallback } from 'react';
import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

/**
 * 가맹점 → 카테고리 기억.
 *
 * 카드 내역서는 같은 가맹점이 수십 번 반복된다(GS25·쿠팡·스마일유통 등). 한 번 지정한 매핑을
 * 기억해 두면 다음 업로드에서 대부분 자동으로 채워진다 — 벌크 입력의 실제 비용은 카테고리 고르기다.
 *
 * 서버가 아니라 localStorage 에 둔다: 스키마 변경이 필요 없고, 이 매핑은 본질적으로
 * "이 사람의 분류 습관" 이라 기기 간 동기화가 없어도 쓸모가 크게 줄지 않는다.
 */
export const useMerchantCategoryStore = create(
  persist(
    combine({ categoryIdByMerchant: {} as Record<string, number> }, (set) => ({
      remember: (merchant: string, categoryId: number) => {
        set((state) => ({
          categoryIdByMerchant: { ...state.categoryIdByMerchant, [merchant]: categoryId },
        }));
      },
      forget: (merchant: string) => {
        set((state) => {
          const { [merchant]: _removed, ...rest } = state.categoryIdByMerchant;
          return { categoryIdByMerchant: rest };
        });
      },
    })),
    { name: 'woolta:bank-merchant-category' },
  ),
);

export const useMerchantCategoryMemory = () => {
  const categoryIdByMerchant = useMerchantCategoryStore((state) => state.categoryIdByMerchant);
  const remember = useMerchantCategoryStore((state) => state.remember);

  /**
   * 기억해 둔 카테고리를 돌려준다.
   * 지워진 카테고리를 가리킬 수 있으므로 현재 목록에 있는 것만 인정한다.
   */
  const recall = useCallback(
    (merchant: string, availableCategoryIds: number[]) => {
      const remembered = categoryIdByMerchant[merchant];
      return remembered !== undefined && availableCategoryIds.includes(remembered) ? remembered : null;
    },
    [categoryIdByMerchant],
  );

  return { recall, remember };
};

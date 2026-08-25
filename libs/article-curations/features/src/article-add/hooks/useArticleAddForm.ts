'use client';

import { useState } from 'react';
import { useArticleStore } from '../../_shared/stores/useArticleStore';
import { normalizeArticleUrl } from '../../_shared/utils/normalizeArticleUrl';

interface Params {
  /** 미리 선택해 둘 카테고리 id (없으면 null) */
  defaultCategoryId: string | null;
  /** 등록 완료 시 호출 (오버레이 닫기 등) */
  onSubmitted: () => void;
}

/** 아티클 등록 폼 상태 — 카테고리/제목/링크 입력값과 유효성, 등록 액션을 관리한다. */
export const useArticleAddForm = ({ defaultCategoryId, onSubmitted }: Params) => {
  const addArticle = useArticleStore((state) => state.addArticle);

  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const canSubmit = categoryId.length > 0 && title.trim().length > 0 && normalizeArticleUrl(url) !== null;

  const submit = () => {
    const trimmedTitle = title.trim();
    const normalizedUrl = normalizeArticleUrl(url);
    if (categoryId.length === 0 || trimmedTitle.length === 0 || normalizedUrl === null) {
      return;
    }

    addArticle({ categoryId, title: trimmedTitle, url: normalizedUrl });
    setTitle('');
    setUrl('');
    onSubmitted();
  };

  return { categoryId, setCategoryId, title, setTitle, url, setUrl, canSubmit, submit };
};

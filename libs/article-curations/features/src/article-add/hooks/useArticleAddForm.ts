'use client';

import { useEffect, useRef, useState } from 'react';
import { useArticleStore } from '../../_shared/stores/useArticleStore';
import { fetchArticleSeo } from '../../_shared/utils/fetchArticleSeo';
import { normalizeArticleUrl } from '../../_shared/utils/normalizeArticleUrl';

const SEO_FETCH_DEBOUNCE_MS = 700;

interface Params {
  /** 미리 선택해 둘 카테고리 id (없으면 null) */
  defaultCategoryId: string | null;
  /** 등록 완료 시 호출 (오버레이 닫기 등) */
  onSubmitted: () => void;
}

/**
 * 아티클 등록 폼 상태.
 * 링크를 먼저 입력하면 SEO 메타(제목/설명/썸네일)를 수집해 입력값을 자동으로 채우고,
 * 제목/설명 입력은 링크 수집이 끝난 뒤에만 노출한다.
 */
export const useArticleAddForm = ({ defaultCategoryId, onSubmitted }: Params) => {
  const addArticle = useArticleStore((state) => state.addArticle);

  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? '');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isFetchingSeo, setIsFetchingSeo] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const normalizedUrl = normalizeArticleUrl(url);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    if (normalizedUrl === null) {
      requestSeqRef.current += 1;
      setIsFetchingSeo(false);
      setIsDetailVisible(false);
      return;
    }

    const seq = (requestSeqRef.current += 1);
    setIsFetchingSeo(true);

    const timer = setTimeout(async () => {
      const seo = await fetchArticleSeo(normalizedUrl);

      // URL 이 그 사이 바뀌었으면 이전 응답은 무시한다
      if (seq !== requestSeqRef.current) {
        return;
      }

      setIsFetchingSeo(false);
      setIsDetailVisible(true);

      if (seo?.title) {
        setTitle(seo.title);
      }
      if (seo?.description) {
        setDescription(seo.description);
      }
      setThumbnailUrl(seo?.imageUrl ?? '');
    }, SEO_FETCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedUrl]);

  const canSubmit =
    categoryId.length > 0 && isDetailVisible && !isFetchingSeo && title.trim().length > 0 && normalizedUrl !== null;

  const submit = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!canSubmit || normalizedUrl === null || trimmedTitle.length === 0) {
      return;
    }

    addArticle({
      categoryId,
      title: trimmedTitle,
      url: normalizedUrl,
      seo:
        trimmedDescription.length > 0 || thumbnailUrl.length > 0
          ? {
              description: trimmedDescription.length > 0 ? trimmedDescription : undefined,
              imageUrl: thumbnailUrl.length > 0 ? thumbnailUrl : undefined,
            }
          : undefined,
    });

    setUrl('');
    setTitle('');
    setDescription('');
    setThumbnailUrl('');
    setIsDetailVisible(false);
    onSubmitted();
  };

  return {
    categoryId,
    setCategoryId,
    url,
    setUrl,
    title,
    setTitle,
    description,
    setDescription,
    thumbnailUrl,
    isFetchingSeo,
    isDetailVisible,
    canSubmit,
    submit,
  };
};

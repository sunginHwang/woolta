'use client';

import { Text } from '@wds';
import { KeyboardEvent } from 'react';
import { styled } from 'styled-components';
import { useCategoryList } from '../../_shared/hooks/useCategoryList';
import { useArticleAddForm } from '../hooks/useArticleAddForm';

interface Props {
  /** 미리 선택해 둘 카테고리 id (없으면 null) */
  defaultCategoryId: string | null;
  /** 폼 닫기 요청 (등록 완료/취소/Escape) */
  onClose: () => void;
}

/** 아티클 등록 폼 — 링크를 먼저 입력하면 SEO 를 수집해 제목/설명을 자동으로 채운다 */
export const ArticleAddForm = ({ defaultCategoryId, onClose }: Props) => {
  const categoryList = useCategoryList();
  const {
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
  } = useArticleAddForm({
    defaultCategoryId,
    onSubmitted: onClose,
  });

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter' && canSubmit) {
      submit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <SC.Container>
      <Text as='h3' variant='title6Bold' color='textPrimary'>
        아티클 등록
      </Text>
      <SC.Field>
        <SC.Label htmlFor='article-add-category'>카테고리</SC.Label>
        <SC.Select id='article-add-category' value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value='' disabled>
            {categoryList.length === 0 ? '카테고리를 먼저 추가해 주세요' : '카테고리 선택'}
          </option>
          {categoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SC.Select>
      </SC.Field>
      <SC.Field>
        <SC.Label htmlFor='article-add-url'>아티클 링크</SC.Label>
        <SC.Input
          autoFocus
          id='article-add-url'
          placeholder='https://... 링크를 넣으면 제목/설명을 자동으로 불러와요'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </SC.Field>
      {isFetchingSeo && (
        <Text as='p' variant='small2Regular' color='textTertiary'>
          링크 정보를 불러오는 중...
        </Text>
      )}
      {isDetailVisible && (
        <>
          {thumbnailUrl && <SC.ThumbnailPreview src={thumbnailUrl} alt='' />}
          <SC.Field>
            <SC.Label htmlFor='article-add-title'>제목</SC.Label>
            <SC.Input
              id='article-add-title'
              placeholder='아티클 제목'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </SC.Field>
          <SC.Field>
            <SC.Label htmlFor='article-add-description'>설명</SC.Label>
            <SC.Input
              id='article-add-description'
              placeholder='아티클 설명 (선택)'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </SC.Field>
        </>
      )}
      <SC.Footer>
        <SC.CancelButton type='button' onClick={onClose}>
          취소
        </SC.CancelButton>
        <SC.SubmitButton type='button' disabled={!canSubmit} onClick={submit}>
          등록
        </SC.SubmitButton>
      </SC.Footer>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 2rem;
    border-radius: 1.2rem;
    background-color: ${({ theme }) => theme.colors.bgElevated};
  `,
  Field: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  `,
  Label: styled.label`
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 1.2rem;
  `,
  Select: styled.select`
    padding: 0.8rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.borderDefault};
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.3rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.interactivePrimary};
    }
  `,
  Input: styled.input`
    padding: 0.8rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.borderDefault};
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.3rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.interactivePrimary};
    }
  `,
  ThumbnailPreview: styled.img`
    width: 100%;
    max-height: 14rem;
    object-fit: cover;
    border-radius: 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
  `,
  Footer: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    padding-top: 0.4rem;
  `,
  CancelButton: styled.button`
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 0.8rem;
    background: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.3rem;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  SubmitButton: styled.button`
    padding: 0.7rem 1.6rem;
    border: none;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.interactivePrimary};
    color: ${({ theme }) => theme.colors.textInverse};
    font-size: 1.3rem;
    cursor: pointer;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.interactivePrimaryHover};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.interactivePrimaryDisabled};
      cursor: not-allowed;
    }
  `,
};

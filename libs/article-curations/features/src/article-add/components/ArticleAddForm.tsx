'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { KeyboardEvent } from 'react';
import { useCategoryList } from '../../_shared/hooks/useCategoryList';
import { useArticleAddForm } from '../hooks/useArticleAddForm';

interface Props {
  /** 미리 선택해 둘 카테고리 id (없으면 null) */
  defaultCategoryId: string | null;
  /** 폼 닫기 요청 (등록 완료/취소/Escape) */
  onClose: () => void;
}

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    padding: '2rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgElevated'],
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    color: colorVars['--color-textTertiary'],
    fontSize: '1.2rem',
  },
  select: {
    paddingBlock: '0.8rem',
    paddingInline: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderDefault'],
      ':focus': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
  },
  input: {
    paddingBlock: '0.8rem',
    paddingInline: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderDefault'],
      ':focus': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
  },
  thumbnailPreview: {
    width: '100%',
    maxHeight: '14rem',
    objectFit: 'cover',
    borderRadius: '0.8rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.8rem',
    paddingTop: '0.4rem',
  },
  cancelButton: {
    paddingBlock: '0.7rem',
    paddingInline: '1.2rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    background: 'none',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.3rem',
    cursor: 'pointer',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  submitButton: {
    paddingBlock: '0.7rem',
    paddingInline: '1.6rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover:not(:disabled)': colorVars['--color-interactivePrimaryHover'],
      ':disabled': colorVars['--color-interactivePrimaryDisabled'],
    },
    color: colorVars['--color-textInverse'],
    fontSize: '1.3rem',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
  },
});

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
    <div {...stylex.props(styles.container)}>
      <Text as='h3' variant='title6Bold' color='textPrimary'>
        아티클 등록
      </Text>
      <div {...stylex.props(styles.field)}>
        <label {...stylex.props(styles.label)} htmlFor='article-add-category'>
          카테고리
        </label>
        <select
          {...stylex.props(styles.select)}
          id='article-add-category'
          value={categoryId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}
        >
          <option value='' disabled>
            {categoryList.length === 0 ? '카테고리를 먼저 추가해 주세요' : '카테고리 선택'}
          </option>
          {categoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div {...stylex.props(styles.field)}>
        <label {...stylex.props(styles.label)} htmlFor='article-add-url'>
          아티클 링크
        </label>
        <input
          {...stylex.props(styles.input)}
          autoFocus
          id='article-add-url'
          placeholder='https://... 링크를 넣으면 제목/설명을 자동으로 불러와요'
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      {isFetchingSeo && (
        <Text as='p' variant='small2Regular' color='textTertiary'>
          링크 정보를 불러오는 중...
        </Text>
      )}
      {isDetailVisible && (
        <>
          {thumbnailUrl && <img {...stylex.props(styles.thumbnailPreview)} src={thumbnailUrl} alt='' />}
          <div {...stylex.props(styles.field)}>
            <label {...stylex.props(styles.label)} htmlFor='article-add-title'>
              제목
            </label>
            <input
              {...stylex.props(styles.input)}
              id='article-add-title'
              placeholder='아티클 제목'
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>
          <div {...stylex.props(styles.field)}>
            <label {...stylex.props(styles.label)} htmlFor='article-add-description'>
              설명
            </label>
            <input
              {...stylex.props(styles.input)}
              id='article-add-description'
              placeholder='아티클 설명 (선택)'
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>
        </>
      )}
      <div {...stylex.props(styles.footer)}>
        <button type='button' {...stylex.props(styles.cancelButton)} onClick={onClose}>
          취소
        </button>
        <button type='button' {...stylex.props(styles.submitButton)} disabled={!canSubmit} onClick={submit}>
          등록
        </button>
      </div>
    </div>
  );
};

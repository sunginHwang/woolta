'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { FiInbox } from 'react-icons/fi';
import { useCategoryList } from '../../../_shared/hooks/useCategoryList';

interface Props {
  /** 현재 카테고리 id (null = 기본함) */
  categoryId: string | null;
  /** 카테고리 변경 시 호출 */
  onCategoryChange: (categoryId: string | null) => void;
}

/** 상세 패널 하단의 카테고리 선택 */
export const CategorySelect = ({ categoryId, onCategoryChange }: Props) => {
  const categoryList = useCategoryList();

  return (
    <div {...stylex.props(styles.field)}>
      <FiInbox size={13} />
      <select
        value={categoryId ?? ''}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value.length > 0 ? e.target.value : null)}
        {...stylex.props(styles.select)}
      >
        <option value=''>기본함</option>
        {categoryList.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = stylex.create({
  field: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.2rem',
    paddingInline: '0.4rem',
    borderRadius: '0.6rem',
    color: colorVars['--color-textTertiary'],
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  select: {
    maxWidth: '16rem',
    borderWidth: 0,
    background: 'transparent',
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    cursor: 'pointer',
    outline: 'none',
  },
});

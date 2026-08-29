'use client';

import { useToggle } from '@common';
import * as stylex from '@stylexjs/stylex';
import { BottomSheet } from '../../../../_shared/bottom-sheet/BottomSheet';
import { Button } from '../../../../_shared/components/button/Button';
import { AccountBookCategory, AccountBookCategoryType, useAccountBookCategories } from '../../hooks/useAccountBookCategories';
import { CategoryItem } from './CategoryItem';
import { CategorySaveForm } from './CategorySaveForm';

interface Props {
  open: boolean;
  onClose: () => void;
  type: AccountBookCategoryType;
  selectCategoryId: number;
  onCategorySelect: (category: AccountBookCategory) => void;
}

/**
 * 가계부 분류 선택 박스
 * @component
 */
export const AmountCategorySheet = ({ open, onClose, type, selectCategoryId, onCategorySelect }: Props) => {
  const { accountBookCategories, saveAccountBookCategory, saveLoading } = useAccountBookCategories();
  const [isOpenSaveForm, toggleOpenSaveForm] = useToggle(false);
  const onOpenSaveForm = () => toggleOpenSaveForm(true);
  const onCloseSaveForm = () => toggleOpenSaveForm(false);

  const categories = accountBookCategories.filter((a) => a.type === type);
  const titleMsg = `${type === 'income' ? '수입' : '지출'} 카테고리 추가`;

  return (
    <>
      <BottomSheet title={titleMsg} visible={open} oncloseModal={onClose}>
        <div>
          <section {...stylex.props(styles.categoryList)}>
            {categories.map((c) => {
              return (
                <CategoryItem
                  key={c.id}
                  accountBookCategory={c}
                  isActive={c.id === selectCategoryId}
                  onSelect={onCategorySelect}
                />
              );
            })}
          </section>
          <div {...stylex.props(styles.footer)}>
            <Button fill onClick={onOpenSaveForm}>
              + {titleMsg}
            </Button>
          </div>
        </div>
      </BottomSheet>
      {isOpenSaveForm && (
        <CategorySaveForm
          type={type}
          isLoading={saveLoading}
          saveAccountBookCategory={saveAccountBookCategory}
          onClose={onCloseSaveForm}
        />
      )}
    </>
  );
};

const styles = stylex.create({
  categoryList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  footer: {
    marginTop: '1.5rem',
    marginInline: '2rem',
    marginBottom: 0,
  },
});

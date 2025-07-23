import { useToggle } from '@common';
import { styled } from 'styled-components';
import { Button } from '../../../../../../components/atom/Button';
import { BottomSheet } from '../../../../../../components/bottom-sheet/BottomSheet';
import {
  AccountBookCategory,
  AccountBookCategoryType,
  useAccountBookCategories,
} from '../../hooks/useAccountBookCategories';
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
        <SC.CategorySelectBox>
          <SC.CategoryList>
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
          </SC.CategoryList>
          <SC.Footer>
            <Button color='red' fill onClick={onOpenSaveForm}>
              + {titleMsg}
            </Button>
          </SC.Footer>
        </SC.CategorySelectBox>
      </BottomSheet>
      {/* 카테고리 추가 여기서 버튼 클릭하면 바로 할수 있게 사용성 개선 하자 */}
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

const SC = {
  CategorySelectBox: styled.div``,
  CategoryList: styled.section`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  `,
  Footer: styled.div`
    margin: 1.5rem 2rem 0 2rem;
  `,
};

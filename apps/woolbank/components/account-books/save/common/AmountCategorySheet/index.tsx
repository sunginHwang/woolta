import styled from '@emotion/styled';
import { FC } from 'react';
import BotttomSheet from '../../../../../components/common/BotttomSheet';
import {
  AccountBookCategory,
  AccountBookCategoryType,
  useAccountBookCategories,
} from '../../hooks/useAccountBookCategories';
import CategoryItem from './CategoryItem';

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

const AmountCategorySheet: FC<Props> = ({ open, onClose, type, selectCategoryId, onCategorySelect }) => {
  const { accountBookCategories } = useAccountBookCategories();

  const categories = accountBookCategories.filter((a) => a.type === type);
  const titleMsg = `${type === 'income' ? '수입' : '지출'} 카테고리 추가`;

  return (
    <>
      <BotttomSheet title={titleMsg} visible={open} oncloseModal={onClose}>
        <div>
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
              {/* <Button message={`+ ${titleMsg}`} color='red' size='full' onClick={onOpenSaveForm} /> */}
            </SC.Footer>
          </SC.CategorySelectBox>
        </div>
      </BotttomSheet>
      {/* 카테고리 추가 여기서 버튼 클릭하면 바로 할수 있게 사용성 개선 하자 */}
      {/* {isOpenSaveForm && (
        <CategorySaveForm
          type={type}
          isLoading={saveLoading}
          saveAccountBookCategory={saveAccountBookCategory}
          onClose={onCloseSaveForm}
        />
      )} */}
    </>
  );
};

const SC = {
  CategorySelectBox: styled.div`
    overflow-y: scroll;
    max-height: 45rem;
  `,
  CategoryList: styled.section`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    max-height: 40rem;
  `,
  Footer: styled.div`
    margin: 1.5rem 2rem 0 2rem;
  `,
};

export default AmountCategorySheet;

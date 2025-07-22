import { useInput } from '@common';
import { Text } from '@wds';
import { useState } from 'react';
import styled from 'styled-components';
import BaseInput from '../../../../../common/BaseInput';
import getCategoryMsg, { AccountBookCategoryType } from '../../../../../../utils/account-books';
import { BottomFloatingButton } from '../../../../../common/BottomFloatingButton';
import Header from '../../../../../common/Header';
import ToggleTab, { ToggleTabItem } from '../../../../../common/ToggleTab';
import { useToast } from '../../../../../../hooks/useToast';
import { SaveAccountBookCategoryForm } from '../../hooks/useAccountBookCategories';
import { useAccountBookCategoryImages } from '../../hooks/useAccountBookCategoryImages';

const TAB_LIST: ToggleTabItem[] = [
  { type: 'ok', name: '포함' },
  { type: 'none', name: '불포함' },
];
interface Props {
  type: AccountBookCategoryType;
  isLoading: boolean;
  saveAccountBookCategory: (props: SaveAccountBookCategoryForm) => void;
  onClose: () => void;
}

/**
 * 가계부 지출/수입 카테고리 작성 폼
 * @component
 */

export const CategorySaveForm = ({ type, onClose, isLoading, saveAccountBookCategory }: Props) => {
  const [categoryName, onChangeCategoryName, onReset] = useInput('');
  const [useStatistic, setUseStatistic] = useState(TAB_LIST[0].type);
  const { accountBookCategoryImages } = useAccountBookCategoryImages();
  const [iconId, setIconId] = useState(0);
  const { onToast } = useToast();

  const typeMsg = getCategoryMsg(type);

  const handleStatisticToggleClick = (tab: ToggleTabItem) => {
    setUseStatistic(tab.type);
  };

  const onAddCategoryClick = () => {
    if (categoryName.length >= 20) {
      onToast('최대 20글자 까지 가능합니다.');
      return;
    }
    saveAccountBookCategory({
      name: categoryName,
      type,
      imageId: iconId,
      useStatistic: useStatistic === 'ok',
      onSuccessCb: () => onClose(),
    });
  };

  return (
    <SC.CategorySave>
      <Header title={`${typeMsg} 카테고리 작성`} onBackClick={onClose} />
      <SC.InputArea>
        <BaseInput
          label={`${typeMsg} 카테고리`}
          placeholder={`추가하실 ${typeMsg} 카테고리를 작성해 주세요.`}
          value={categoryName}
          onChange={onChangeCategoryName}
          onClear={onReset}
        />
        <Text variant='small1Regular' color='gray600' as='p' mb={16} mt={16}>
          통계포함 유무
        </Text>
        <ToggleTab tabs={TAB_LIST} value={useStatistic} onChangeTab={handleStatisticToggleClick} />
        <Text variant='small1Regular' color='gray600' as='p' mb={16} mt={24}>
          아이콘
        </Text>
        <SC.IconList>
          {accountBookCategoryImages.map(({ id, name, imageUrl }) => (
            <SC.IconInfo $isActive={iconId === id} key={name}>
              <img src={imageUrl} alt={name} onClick={() => setIconId(id)} />
            </SC.IconInfo>
          ))}
        </SC.IconList>
      </SC.InputArea>

      <BottomFloatingButton
        isShow
        loading={isLoading}
        disabled={categoryName.length === 0 || iconId === 0}
        onClick={onAddCategoryClick}
      >
        추가하기
      </BottomFloatingButton>
    </SC.CategorySave>
  );
};

const SC = {
  CategorySave: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.white};
    z-index: ${({ theme }) => theme.zIndex.fullDeem};
  `,
  InputArea: styled.div`
    margin-top: 2.5rem;
    padding: 0 1.6rem;
  `,
  IconList: styled.section`
    display: grid;
    overflow: scroll;
    grid-template-columns: repeat(4, 1fr);
    max-height: 40rem;
    margin-top: 0.8rem;
  `,
  IconInfo: styled.div<{ $isActive: boolean }>`
    img {
      width: 40px;
      height: 40px;
    }
    height: 6rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSecondary : theme.colors.white)};
  `,
};

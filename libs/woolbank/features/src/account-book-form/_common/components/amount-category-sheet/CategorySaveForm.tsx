'use client';

import { useInput } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { useState } from 'react';
import { BaseInput } from '../../../../_shared/components/base-input/BaseInput';
import { BottomFloatingButton } from '../../../../_shared/components/bottom-floating-button/BottomFloatingButton';
import { Header } from '../../../../_shared/components/header/Header';
import { ToggleTab, type ToggleTabItem } from '../../../../_shared/components/toggle-tab/ToggleTab';
import { useToast } from '../../../../_shared/toast/useToast';
import type { AccountBookCategoryType, SaveAccountBookCategoryForm } from '../../hooks/useAccountBookCategories';
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

  const typeMsg = type === 'income' ? '수입' : '지출';

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
    // container-relative: position absolute fills the nearest positioned ancestor (the screen wrapper)
    <div {...stylex.props(styles.categorySave)}>
      <Header title={`${typeMsg} 카테고리 작성`} onBackClick={onClose} />
      <div {...stylex.props(styles.inputArea)}>
        <BaseInput
          label={`${typeMsg} 카테고리`}
          placeholder={`추가하실 ${typeMsg} 카테고리를 작성해 주세요.`}
          value={categoryName}
          onChange={onChangeCategoryName}
          onClear={onReset}
        />
        <Text variant='small1Regular' color='textTertiary' as='p' mb={16} mt={16}>
          통계포함 유무
        </Text>
        <ToggleTab tabs={TAB_LIST} value={useStatistic} onChangeTab={handleStatisticToggleClick} />
        <Text variant='small1Regular' color='textTertiary' as='p' mb={16} mt={24}>
          아이콘
        </Text>
        <section {...stylex.props(styles.iconList)}>
          {accountBookCategoryImages.map(({ id, name, imageUrl }) => (
            <div
              key={name}
              {...stylex.props(styles.iconInfo, iconId === id ? styles.iconInfoActive : styles.iconInfoInactive)}
            >
              <img {...stylex.props(styles.icon)} src={imageUrl} alt={name} onClick={() => setIconId(id)} />
            </div>
          ))}
        </section>
      </div>

      <BottomFloatingButton
        isShow
        loading={isLoading}
        disabled={categoryName.length === 0 || iconId === 0}
        onClick={onAddCategoryClick}
      >
        추가하기
      </BottomFloatingButton>
    </div>
  );
};

const styles = stylex.create({
  // Container-relative: fills the nearest positioned ancestor (screen wrapper must have position: relative)
  categorySave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: '100%',
    backgroundColor: colorVars['--color-bgSurface'],
    zIndex: zIndexConsts.fullDeem,
  },
  inputArea: {
    marginTop: '2.5rem',
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  iconList: {
    display: 'grid',
    overflow: 'scroll',
    gridTemplateColumns: 'repeat(4, 1fr)',
    maxHeight: '40rem',
    marginTop: '0.8rem',
  },
  iconInfo: {
    height: '6rem',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
  },
  iconInfoActive: {
    backgroundColor: colorVars['--color-bgSecondary'],
  },
  iconInfoInactive: {
    backgroundColor: colorVars['--color-bgSurface'],
  },
  icon: {
    width: '40px',
    height: '40px',
  },
});

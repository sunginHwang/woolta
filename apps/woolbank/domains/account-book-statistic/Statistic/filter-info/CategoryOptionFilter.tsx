import { useToggle } from '@common';
import { useAtom } from 'jotai';
import BotttomSheet from '../../../../components/BotttomSheet';
import { BottomMenu } from '../../../../components/BotttomSheet/MenuSheet';
import { allVisibilityStatisticAtom } from '../_common/stores/statisticFilter';
import { Label } from './Label';

const CATEGORY_BOTTOM_MENU_LIST: BottomMenu<'filter' | 'allView'>[] = [
  {
    type: 'filter',
    value: '카테고리 통계 필터 적용',
  },
  {
    type: 'allView',
    value: '모든 카테고리 통계 보기',
  },
];

/**
 * 가계부 레이블 필터 - 가계부 카테고리에 통계 사용유무 적용 필터
 * @component
 */
export const CategoryOptionFilter = () => {
  const [isOpenModal, toggleModal] = useToggle(false);
  const [allVisibilityStatistic, setAllVisibilityStatistic] = useAtom(allVisibilityStatisticAtom);

  const handleTypeClick = () => {
    setAllVisibilityStatistic((prev) => !prev);
    toggleModal();
  };

  const activeTabValue = allVisibilityStatistic === false ? 'filter' : 'allView';

  const activeMenu = Object.entries(CATEGORY_BOTTOM_MENU_LIST).find(([, item]) => {
    return item.type === activeTabValue;
  });

  return (
    <>
      <Label text={activeMenu?.[1].value || ''} onClick={() => toggleModal()} />
      <BotttomSheet.Menu
        title='카테고리의 통계포함 사용유무를 선택해주세요.'
        menus={CATEGORY_BOTTOM_MENU_LIST}
        activeMenuType={activeTabValue}
        visible={isOpenModal}
        oncloseModal={toggleModal}
        onEditClick={handleTypeClick}
      />
    </>
  );
};

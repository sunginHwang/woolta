import { styled } from 'styled-components';
import { Text } from '@wds';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import { AccountBookStatisticCategoryItem } from '../hooks/useAccountStatisticList';
import CategoryBottomSheet from './CategoryBottomSheet';
import { AccountBookChartData } from '.';
import { Button } from '../../../../components/atom/Button';
import { useToggle } from '@common';

interface IActiveSheet {
  color: string;
  label: string;
  list: AccountBookStatisticCategoryItem[];
}

const initActiveSheet: IActiveSheet = {
  color: '',
  label: '',
  list: [],
};

const FLIP_COUNT = 4;

interface Props {
  accountBookChartList: AccountBookChartData[];
}

/**
 * 가계부 통계 - 통계 리스트
 * @component
 */
const StatisticList: FC<Props> = ({ accountBookChartList }) => {
  const [isAllView, toggleIsAllView] = useToggle(false);
  const [activeSheetList, setActiveSheetList] = useState<IActiveSheet>(initActiveSheet);
  const { back, push } = useRouter();
  const { get } = useSearchParams();
  const pathname = usePathname();
  const isSheetOpen = get('sheet') === 'open';
  const chartList = isAllView ? accountBookChartList : accountBookChartList.filter((_, index) => index < FLIP_COUNT);

  return (
    <>
      <SC.Container>
        {chartList.map(({ label, percentage, value, color, list }) => {
          const handleItemClick = () => {
            push(`${pathname}?tab=statistic&sheet=open`);
            setActiveSheetList({ color, label, list });
          };
          return (
            <SC.Item key={label} onClick={handleItemClick}>
              <div className='left'>
                <SC.CategoryLabel color={color} />
                <Text variant='title6Medium' color='gray800' as='p' ml={10}>
                  {label}({percentage})
                </Text>
              </div>
              <Text variant='body3' color='gray700'>
                {value.toLocaleString('ko-KR')}원
              </Text>
            </SC.Item>
          );
        })}
        <Button className='more' variant='tertiaryGray' fill onClick={() => toggleIsAllView()}>
          {isAllView ? '접기' : '전체보기'}
        </Button>
      </SC.Container>
      <CategoryBottomSheet
        isOpen={isSheetOpen}
        title={activeSheetList.label}
        titleColor={activeSheetList.color}
        list={activeSheetList.list}
        onClose={back}
      />
    </>
  );
};

export default StatisticList;

const SC = {
  Container: styled.div`
    padding-bottom: 1rem;
    margin: 0 1.6rem;

    .more {
      margin-top: 1.6rem;
    }
  `,
  Item: styled.div`
    display: flex;
    justify-content: space-between;

    & + & {
      margin-top: 2rem;
    }

    .left {
      display: flex;
      align-items: center;
    }
  `,
  CategoryLabel: styled.div<{ color: string }>`
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.8rem;
    background-color: ${({ color }) => color};
  `,
};

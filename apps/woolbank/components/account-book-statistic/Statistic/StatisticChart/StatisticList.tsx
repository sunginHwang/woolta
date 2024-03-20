import { styled } from 'styled-components';
import { Text } from '@wds';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import { AccountBookStatisticCategoryItem } from '../hooks/useAccountStatisticList';
import CategoryBottomSheet from './CategoryBottomSheet';
import { AccountBookChartData } from '.';

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

interface Props {
  accountBookChartList: AccountBookChartData[];
}

/**
 * 가계부 통계 - 통계 리스트
 * @component
 */
const StatisticList: FC<Props> = ({ accountBookChartList }) => {
  const [activeSheetList, setActiveSheetList] = useState<IActiveSheet>(initActiveSheet);
  const { back, push } = useRouter();
  const { get } = useSearchParams();
  const pathname = usePathname();
  const isSheetOpen = get('sheet') === 'open';

  return (
    <>
      <SC.Container>
        {accountBookChartList.map(({ label, percentage, value, color, list }) => {
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
    padding-bottom: 10rem;
    margin: 1rem 1.6rem 0;
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

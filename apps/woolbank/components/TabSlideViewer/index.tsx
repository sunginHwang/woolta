import { ReactNode, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';
import { BucketListItem } from '../../domains/bucket-list/main/BucketListItem';
import Tabs, { Tab } from '../Tabs';
import { Empty } from './Empty';

interface Props {
  tabs: Tab[];
  isLoading: boolean;
  slideViewList: ReactNode[];
  title: string;
}

/**
 * 탭 슬라이드 리스트
 * @component
 */

export const TabSlideViewer = Object.assign(
  ({ tabs, isLoading, slideViewList }: Props) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [tabIndex, setTavIndex] = useState(0);

    /**
     * 탭 변경 이벤트
     **/
    const onTabChange = (tab: Tab) => {
      setActiveTab(tab);
      setTavIndex(tabs.findIndex((t) => t.value === tab.value));
    };

    /**
     * 리스트 뷰 스와이프
     **/
    const onSlideTo = (index: number) => {
      setTavIndex(index);
      setActiveTab(tabs[index]);
    };

    if (isLoading) {
      return (
        <>
          <Tabs tabs={tabs} value={activeTab.value ?? ''} onChange={onTabChange} />
          <SC.ListWrapper>
            <SC.ListContent>
              {[...Array(10)].map((_, key) => (
                <div key={key}>
                  <BucketListItem.Skeleton />
                </div>
              ))}
            </SC.ListContent>
          </SC.ListWrapper>
        </>
      );
    }
    const SwipeableViewsStyle = { height: '100%' };

    const renderContent = () => {
      return slideViewList.map((view, index) => <SC.ListContent key={index}>{view}</SC.ListContent>);
    };

    return (
      <>
        <Tabs tabs={tabs} value={activeTab.value ?? ''} onChange={onTabChange} />
        <SC.ListWrapper>
          <SwipeableViews index={tabIndex} onChangeIndex={onSlideTo} style={SwipeableViewsStyle}>
            {/* @eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {renderContent}
          </SwipeableViews>
        </SC.ListWrapper>
      </>
    );
  },
  {
    Empty,
  },
);

const SC = {
  ListContent: styled.div`
    padding: 2rem 0;

    // 리스트 마지막 요소 네이게이션 영역 패딩 처리
    a:last-child {
      > div {
        margin-bottom: 5.5rem;
        margin-bottom: calc(constant(safe-area-inset-bottom) + 5.5rem);
        margin-bottom: calc(env(safe-area-inset-bottom) + 5.5rem);
      }
    }
  `,
  ListWrapper: styled.div`
    height: calc(100vh - 9.6rem);

    /*슬라이드 뷰어 스타일 제어*/
    .swiper-slide {
      height: 100%;
      padding: 3.5rem 0 15rem 0;
      overflow-y: scroll;
    }

    .swiper-tab-slide-viewer {
      height: 100%;
    }
  `,
};

import * as stylex from '@stylexjs/stylex';
import { type ReactNode, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BucketListItem } from '../../domains/bucket-list/main/BucketListItem';
import { type Tab, Tabs } from '../tabs/Tabs';
import { Empty } from './Empty';
import viewerCss from './tabSlideViewer.module.css';

const styles = stylex.create({
  listContent: {
    paddingBlock: '2rem',
    paddingInline: 0,
  },
  listWrapper: {
    height: 'calc(100vh - 9.6rem)',
  },
});

const listContentSx = stylex.props(styles.listContent);
const listContentClassName = `${listContentSx.className ?? ''} ${viewerCss.listContent}`;
const listWrapperSx = stylex.props(styles.listWrapper);
const listWrapperClassName = `${listWrapperSx.className ?? ''} ${viewerCss.listWrapper}`;

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
          <div {...listWrapperSx} className={listWrapperClassName}>
            <div {...listContentSx} className={listContentClassName}>
              {[...Array(10)].map((_, key) => (
                <div key={key}>
                  <BucketListItem.Skeleton />
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }
    const SwipeableViewsStyle = { height: '100%' };

    const renderContent = () => {
      return slideViewList.map((view, index) => (
        <div key={index} {...listContentSx} className={listContentClassName}>
          {view}
        </div>
      ));
    };

    return (
      <>
        <Tabs tabs={tabs} value={activeTab.value ?? ''} onChange={onTabChange} />
        <div {...listWrapperSx} className={listWrapperClassName}>
          <SwipeableViews index={tabIndex} onChangeIndex={onSlideTo} style={SwipeableViewsStyle}>
            {/* @eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {renderContent}
          </SwipeableViews>
        </div>
      </>
    );
  },
  {
    Empty,
  },
);

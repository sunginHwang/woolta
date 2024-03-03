import { memo } from 'react';
import { TabSlideViewer } from '../../../../components/common/TabSlideViewer/';
import { BucketListItem } from '../BucketListItem';
import { BucketList, useBucketList } from '../hooks/useBucketList';

const OPTION_INFO = {
  EMPTY_MSG: {
    progress: '진행중인 버킷리스트가 없습니다. :(',
    complete: '완료중인 버킷리스트가 없습니다. :(',
  },
  TITLE: '버킷리스트',
  TAB_LIST: [
    {
      value: 'progress',
      label: '진행중',
    },
    {
      value: 'complete',
      label: '완료',
    },
  ],
};

/**
 * 버킷리스트 - 진행, 완료 리스트 슬라이딩 뷰어
 * @component
 */
export const BucketListSlideViewer = memo(() => {
  const { bucketList, isFetching } = useBucketList();

  const isLoading = isFetching || bucketList.length === 0;

  const renderProgressBucketList = renderList('progress', bucketList);
  const renderCompleteBucketList = renderList('complete', bucketList);

  return (
    <>
      <TabSlideViewer
        tabs={OPTION_INFO.TAB_LIST}
        slideViewList={[renderProgressBucketList, renderCompleteBucketList]}
        isLoading={isLoading}
        title={OPTION_INFO.TITLE}
      />
    </>
  );
});

function renderList(status: 'complete' | 'progress', list: BucketList[]) {
  const listWithFilter = list.filter((item) => (status === 'complete' ? item.isComplete : !item.isComplete));

  if (listWithFilter.length === 0) {
    return <TabSlideViewer.Empty message={OPTION_INFO.EMPTY_MSG[status]} />;
  }

  return listWithFilter.map((item) => <BucketListItem key={item.id} bucketList={item} useSideMargin />);
}

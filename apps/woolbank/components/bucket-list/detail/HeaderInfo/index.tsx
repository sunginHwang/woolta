import { useEventListener, useToggle } from '@common';
import { SkeletonBar } from '@wds';
import debounce from 'lodash-es/debounce';
import { useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import BotttomSheet from '../../../..//components/common/BotttomSheet';
import { IconDownHorizontal } from '../../../../components/atom/Icon';

import Header from '../../../../components/common/Header';
import { Progress } from '../../../../components/common/Progress';
import { getRemainDatePercentage, getRemainDays } from '../../../../utils/date';
import { useBucket } from '../hooks/useBucket';

const BOTTOM_SHEET_MENUS = [
  {
    type: 'remove',
    value: '삭제하기',
  },
  {
    type: 'edit',
    value: '수정하기',
  },
];

/**
 * 버킷리스트 상세 - 헤더 정보
 * @component
 */
export const HeaderInfo = () => {
  const now = new Date();
  const {
    bucket: { title, imageUrl, completeDate, createdAt, isComplete },
    isFetching,
    removeBucket,
  } = useBucket();
  const { colors } = useTheme();
  const imgRef = useRef<HTMLDivElement>(null);
  const [showMenuModal, toggleMenuModal] = useToggle(false);
  const [isShowFixedHeader, setFixedHeader] = useState(false);

  const onMenuModal = () => toggleMenuModal(true);
  const offMenuModal = () => toggleMenuModal(false);

  // 스크롤 이벤트 (고정 헤더 노출 체크)
  useEventListener(
    'scroll',
    debounce(() => {
      const imgHeight = imgRef.current ? imgRef.current.offsetHeight : 0;
      const isShowHeader = imgHeight - 80 <= getScrollTop();
      isShowFixedHeader !== isShowHeader && setFixedHeader(isShowHeader);
    }, 50),
  );

  // 우측 옵션 버튼 클릭
  const onMenuClick = (type: string) => {
    type === 'remove' && removeBucket();
    // type === 'edit' && history.push(`/bucket-list/save?bucketListId=${bucketId}`);

    offMenuModal();
  };

  const fixedHeaderMsg = isShowFixedHeader ? title : '';
  const headerIconColor = isShowFixedHeader ? colors.red500 : colors.white;
  // 목표 날짜 까지 남은 기간
  const remainDay = getRemainDays(new Date(now), new Date(completeDate));
  // 목표 날짜 까지 이룬 %
  const remainPercent = getRemainDatePercentage(createdAt, completeDate, now);

  const sheet_menus = isComplete ? [BOTTOM_SHEET_MENUS[0]] : BOTTOM_SHEET_MENUS;

  return (
    <>
      <Header.Sub
        iconColor={headerIconColor}
        title={fixedHeaderMsg}
        right={
          <i onClick={onMenuModal}>
            <IconDownHorizontal fill={headerIconColor} />
          </i>
        }
        position='fixed'
        useSkeleton={!isShowFixedHeader}
      />
      <SC.ImageInfo ref={imgRef} imgUrl={imageUrl ?? ''}>
        <div>
          {isFetching ? <SkeletonBar width='15rem' height='4.4rem' /> : <h2>{title}</h2>}
          <Progress label={remainDay} labelPrefix='D-' percent={remainPercent} color={colors.red500} />
        </div>
      </SC.ImageInfo>
      <BotttomSheet.Menu
        visible={showMenuModal}
        menus={sheet_menus}
        title='원하시는 메뉴를 선택해 주세요.'
        oncloseModal={offMenuModal}
        onEditClick={onMenuClick}
      />
    </>
  );
};

function getScrollTop() {
  if (!document.body) return 0;
  const scrollTop = document.documentElement
    ? document.documentElement.scrollTop || document.body.scrollTop
    : document.body.scrollTop;
  return scrollTop;
}

const SC = {
  ImageInfo: styled.div<{ imgUrl: string }>`
    background-color: ${({ theme }) => theme.colors.gray800};
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${({ imgUrl }) => imgUrl}), no-repeat;
    background-size: cover;
    width: 100%;
    height: 40vh;
    > div {
      height: 100%;
      padding: 0 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;

      > h2 {
        font-size: 2.2rem;
        color: ${({ theme }) => theme.colors.white};
        margin-bottom: 8vh;
        text-align: center;
        width: 80%;
      }

      > div {
        margin-bottom: 5vh;
      }
    }
  `,
};

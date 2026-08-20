'use client';

import { Text } from '@wds';
import { useState } from 'react';
import { styled } from 'styled-components';
import SplitPane from '../split-pane/SplitPane';

interface Memo {
  id: number;
  title: string;
  date: string;
  body: string;
}

const SAMPLE_MEMOS: Memo[] = [
  {
    id: 1,
    title: 'SplitPane 사용법',
    date: '2026-08-20',
    body: '가운데 바를 드래그하면 좌측 패널 폭이 조절됩니다.\n더블클릭하면 기본 폭으로 돌아갑니다.\n조절한 폭은 새로고침해도 유지됩니다.',
  },
  {
    id: 2,
    title: '대시보드 할 일',
    date: '2026-08-19',
    body: '- 가계부 연동 마무리\n- 블로그 연동 마무리\n- TODO 앱 기획 확정\n- 아티클 큐레이션 앱 구상',
  },
  {
    id: 3,
    title: '워킹트리 구조 메모',
    date: '2026-08-19',
    body: '1depth: 좌측 앱 아이콘 레일\n2depth: 앱 콘텐츠 영역\n앱별로 필요하면 SplitPane으로 리스트/상세 2패널 구성',
  },
];

const MemoSample = () => {
  const [selectedId, setSelectedId] = useState(SAMPLE_MEMOS[0].id);
  const selectedMemo = SAMPLE_MEMOS.find((memo) => memo.id === selectedId) ?? SAMPLE_MEMOS[0];

  return (
    <SplitPane
      storageKey='memo'
      defaultLeftWidth={280}
      minLeftWidth={200}
      maxLeftWidth={480}
      left={
        <SC.List>
          <SC.ListHeader>
            <Text as='h2' variant='title5Bold' color='textPrimary'>
              메모
            </Text>
            <Text variant='small2Regular' color='textTertiary'>
              {SAMPLE_MEMOS.length}개
            </Text>
          </SC.ListHeader>
          {SAMPLE_MEMOS.map((memo) => (
            <SC.ListItem
              key={memo.id}
              type='button'
              $isActive={memo.id === selectedId}
              onClick={() => setSelectedId(memo.id)}
            >
              <Text as='p' variant='body3' color={memo.id === selectedId ? 'textPrimary' : 'textSecondary'}>
                {memo.title}
              </Text>
              <Text as='p' variant='small3Regular' color='textTertiary' mt={4}>
                {memo.date}
              </Text>
            </SC.ListItem>
          ))}
        </SC.List>
      }
      right={
        <SC.Detail>
          <Text as='h1' variant='title4Bold' color='textPrimary'>
            {selectedMemo.title}
          </Text>
          <Text as='p' variant='small2Regular' color='textTertiary' mt={8}>
            {selectedMemo.date}
          </Text>
          <SC.Body>
            {selectedMemo.body.split('\n').map((line, index) => (
              <Text as='p' key={index} variant='body3' color='textSecondary'>
                {line}
              </Text>
            ))}
          </SC.Body>
        </SC.Detail>
      }
    />
  );
};

export default MemoSample;

const SC = {
  List: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    height: 100%;
    padding: 1.6rem 1.2rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
  ListHeader: styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 0.4rem 1.2rem;
  `,
  ListItem: styled.button<{ $isActive: boolean }>`
    text-align: left;
    padding: 1rem 1.2rem;
    border-radius: 0.8rem;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
  Detail: styled.div`
    padding: 2.4rem 3.2rem;
  `,
  Body: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 2rem;
  `,
};

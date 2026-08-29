'use client';

import { PostListSkeleton, RecentPostList } from '@blog/features';
import * as stylex from '@stylexjs/stylex';
import { Suspense } from 'react';

interface Props {
  /** 서버 prefetch 용 카테고리 값. 클라이언트에서는 searchParams 로 읽는다 */
  category?: string;
}

const styles = stylex.create({
  container: {
    marginTop: '2rem',
  },
});

/**
 * 블로그 리스트 스크린.
 * 카테고리 칩(PostCategories)은 대시보드에서 좌측 앱 레일이 담당하므로 렌더하지 않는다.
 */
export function BlogListScreen({ category: _category }: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      <Suspense fallback={<PostListSkeleton />}>
        <RecentPostList />
      </Suspense>
    </div>
  );
}

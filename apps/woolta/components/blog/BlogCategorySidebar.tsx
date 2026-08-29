'use client';

import { useCategories } from '@blog/features';
import * as stylex from '@stylexjs/stylex';
import { Suspense as MountGate, SkeletonBar, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Component, ReactNode } from 'react';

const DEFAULT_CATEGORY = '-1';

const styles = stylex.create({
  header: {
    paddingTop: '0.4rem',
    paddingBottom: '1rem',
    paddingInline: '1rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  categoryLink: {
    paddingBlock: '0.9rem',
    paddingInline: '1rem',
    borderRadius: '0.8rem',
    fontSize: '1.4rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: colorVars['--color-textSecondary'],
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    fontWeight: 400,
  },
  categoryLinkActive: {
    color: colorVars['--color-interactivePrimary'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    fontWeight: 700,
  },
});

const CategoryList = () => {
  const { categories } = useCategories();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? DEFAULT_CATEGORY;
  const isListPath = pathname === '/blog';

  return (
    <div {...stylex.props(styles.list)}>
      {categories.map((category) => {
        const isActive = isListPath && activeCategory === String(category.value);

        return (
          <Link
            key={category.value}
            href={`/blog?category=${category.value}`}
            {...stylex.props(styles.categoryLink, isActive && styles.categoryLinkActive)}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
};

const CategoryListSkeleton = () => {
  return (
    <div {...stylex.props(styles.list)}>
      <SkeletonBar width='100%' height='3.6rem' radius={8} />
      <SkeletonBar width='100%' height='3.6rem' radius={8} />
      <SkeletonBar width='100%' height='3.6rem' radius={8} />
    </div>
  );
};

interface SilentBoundaryProps {
  /** 카테고리 조회 실패 시 조용히 숨긴다 */
  children: ReactNode;
}

class SilentBoundary extends Component<SilentBoundaryProps, { hasError: boolean }> {
  constructor(props: SilentBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/**
 * 블로그 앱의 서브 사이드바(2depth) — 카테고리 내비게이션.
 */
export const BlogCategorySidebar = () => {
  return (
    <>
      <div {...stylex.props(styles.header)}>
        <Text as='h2' variant='small1Bold' color='textTertiary'>
          카테고리
        </Text>
      </div>
      <MountGate fallback={<CategoryListSkeleton />}>
        <SilentBoundary>
          <CategoryList />
        </SilentBoundary>
      </MountGate>
    </>
  );
};

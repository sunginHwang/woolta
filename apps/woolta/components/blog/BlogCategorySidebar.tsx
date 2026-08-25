'use client';

import { useCategories } from '@blog/features';
import { Suspense as MountGate, SkeletonBar, Text } from '@wds';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Component, ReactNode } from 'react';
import { styled } from 'styled-components';

const DEFAULT_CATEGORY = '-1';

const CategoryList = () => {
  const { categories } = useCategories();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? DEFAULT_CATEGORY;
  const isListPath = pathname === '/blog';

  return (
    <SC.List>
      {categories.map((category) => (
        <SC.CategoryLink
          key={category.value}
          href={`/blog?category=${category.value}`}
          $isActive={isListPath && activeCategory === String(category.value)}
        >
          {category.label}
        </SC.CategoryLink>
      ))}
    </SC.List>
  );
};

const CategoryListSkeleton = () => {
  return (
    <SC.List>
      <SkeletonBar width='100%' height='3.6rem' radius={8} />
      <SkeletonBar width='100%' height='3.6rem' radius={8} />
      <SkeletonBar width='100%' height='3.6rem' radius={8} />
    </SC.List>
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
      <SC.Header>
        <Text as='h2' variant='small1Bold' color='textTertiary'>
          카테고리
        </Text>
      </SC.Header>
      <MountGate fallback={<CategoryListSkeleton />}>
        <SilentBoundary>
          <CategoryList />
        </SilentBoundary>
      </MountGate>
    </>
  );
};

const SC = {
  Header: styled.div`
    padding: 0.4rem 1rem 1rem;
  `,
  List: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  `,
  CategoryLink: styled(Link)<{ $isActive: boolean }>`
    padding: 0.9rem 1rem;
    border-radius: 0.8rem;
    font-size: 1.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.interactivePrimary : theme.colors.textSecondary)};
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};
    font-weight: ${({ $isActive }) => ($isActive ? 700 : 400)};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
};

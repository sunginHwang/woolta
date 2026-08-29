'use client';

import { ArticleSidebarScreen } from '@article-curations/screens';
import type { ReactNode } from 'react';
import SplitPane from '../split-pane/SplitPane';

interface Props {
  /** 우측 패널에 배치할 리스트 화면 */
  children: ReactNode;
}

export const ArticlesAppShell = ({ children }: Props) => {
  return (
    <SplitPane
      storageKey='articles-sidebar'
      defaultLeftWidth={240}
      minLeftWidth={200}
      maxLeftWidth={360}
      left={<ArticleSidebarScreen />}
      right={children}
    />
  );
};

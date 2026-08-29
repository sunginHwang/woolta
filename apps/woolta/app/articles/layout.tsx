import type { ReactNode } from 'react';
import { ArticlesAppShell } from '../../components/articles/ArticlesAppShell';

export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return <ArticlesAppShell>{children}</ArticlesAppShell>;
}

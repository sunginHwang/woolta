import type { ReactNode } from 'react';
import { TodoAppShell } from '../../components/todo/TodoAppShell';

export default function TodoLayout({ children }: { children: ReactNode }) {
  return <TodoAppShell>{children}</TodoAppShell>;
}

import { BlogCategorySidebar } from '../../components/blog/BlogCategorySidebar';
import { SubSidebarLayout } from '../../components/layout/sub-sidebar/SubSidebarLayout';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <SubSidebarLayout sidebar={<BlogCategorySidebar />}>{children}</SubSidebarLayout>;
}

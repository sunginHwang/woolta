'use client';

import dynamic from 'next/dynamic';
import { BlogScreensProvider } from '@blog/screens';

const BlogWriteScreen = dynamic(() => import('@blog/screens').then((mod) => mod.BlogWriteScreen), { ssr: false });

export default function BlogWritePage() {
  return (
    <BlogScreensProvider basePath='/blog'>
      <BlogWriteScreen />
    </BlogScreensProvider>
  );
}

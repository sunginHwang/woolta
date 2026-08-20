'use client';

import { createContext, useContext } from 'react';

interface BlogRoutesContextValue {
  basePath: string;
}

export const BlogRoutesContext = createContext<BlogRoutesContextValue>({
  basePath: '',
});

export function useBlogRoutes(): BlogRoutesContextValue {
  return useContext(BlogRoutesContext);
}

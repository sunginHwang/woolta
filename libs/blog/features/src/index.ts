// config
export { setBlogConfig, getBlogConfig } from './_shared/config';
export type { BlogConfig } from './_shared/config';

// cookie
export { getCookie } from './_shared/cookie';

// api
export { settingAccessHeaderToken, getData, postData, putData, deleteData, getApiClient } from './_shared/api';
export type { APIResponse } from './_shared/api';

// prefetch
export { prefetchBlogList, prefetchBlogPost } from './_shared/prefetch';

// routes context
export { BlogRoutesContext, useBlogRoutes } from './_shared/routes';

// toast
export { toastMessageAtom } from './_shared/toast/store';
export { default as useToast } from './_shared/toast/useToast';
export { default as NotificationBar } from './_shared/toast/NotificationBar';

// write store
export {
  postAtom,
  postTitleAtom,
  postContentAtom,
  postCategoryAtom,
  postNoAtom,
  setPostAtom,
} from './_shared/write-store';
export type { WritePost } from './_shared/write-store';

// query keys
export { POSTS_QUERY_KEY, CATEGORIES_QUERY_KEY, POST_QUERY_KEY, USER_INFO_QUERY_KEY, getPostQueryKey } from './_shared/query-keys';

// shared hooks
export { useCategories, prefetchCategories } from './_shared/hooks/useCategories';
export { useUserInfo } from './_shared/hooks/useUserInfo';
export { useStickeyScrollReset } from './_shared/hooks/useStickeyScrollReset';

// shared components
export { Chips } from './_shared/chips/Chips';
export { ChipLayout } from './_shared/chips/ChipLayout';
export { ChipsLoading } from './_shared/chips/ChipsLoading';
export { default as ChipItem } from './_shared/chips/Item';
export type { ChipItemWithLink } from './_shared/chips/Item';
export { CategoryChips } from './_shared/category-chips/CategoryChips';
export { MarkdownViewer } from './_shared/mark-down-viewer/MarkdownViewer';

// types
export type { IPost } from './_shared/types/IPost';
export type { IWriter } from './_shared/types/IWriter';
export type { ICategory } from './_shared/types/ICategory';
export type { IUserInfo } from './_shared/types/IUserInfo';

// post-list feature
export { Home } from './post-list/Home';
export { PostCategories } from './post-list/PostCategories';
export { RecentPostList } from './post-list/RecentPostList';
export { default as PostList } from './post-list/PostList';
export { PostListSkeleton } from './post-list/PostListSkeleton';
export { usePostList, prefetchPostList } from './post-list/hooks/usePostList';
export { useHomeRouterProps } from './post-list/hooks/useHomeRouterProps';

// post-detail feature
export { Post } from './post-detail/Post';
export { PostLoading } from './post-detail/post-loading/PostLoading';
export { usePost, prefetchPost } from './post-detail/hooks/usePost';
export { useDeletePost } from './post-detail/hooks/useDeletePost';

// post-write feature
export { PostWrite } from './post-write/PostWrite';
export { useUpsertPost } from './post-write/hooks/useUpsertPost';
export { useTempSavePost } from './post-write/hooks/useTempSavePost';

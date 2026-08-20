export const POSTS_QUERY_KEY = 'getPosts';
export const CATEGORIES_QUERY_KEY = 'getCategories';
export const POST_QUERY_KEY = 'getPost';
export const USER_INFO_QUERY_KEY = 'getUserInfo';

export function getPostQueryKey(categoryNo: string, postNo: string) {
  return [POST_QUERY_KEY, categoryNo, postNo];
}

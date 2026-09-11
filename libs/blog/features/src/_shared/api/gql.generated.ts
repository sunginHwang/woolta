/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type CreatePostInput = {
  categoryNo: number;
  contents: string;
  title: string;
};

export type DeletePostInput = {
  categoryNo: number;
  postNo: number;
};

export type UpdatePostInput = {
  categoryNo: number;
  contents: string;
  id: number;
  title: string;
};

export type PostSummaryPartsFragment = { postNo: number, categoryNo: number, categoryLabel: string, title: string, subDescription: string | null, author: string | null, createdAt: string };

export type PostDetailPartsFragment = { postNo: number, categoryNo: number, categoryLabel: string, title: string, content: string | null, createdAt: string, writer: { no: number, nickName: string | null, imageUrl: string } };

export type PostListQueryVariables = Exact<{
  categoryId?: number | null | undefined;
}>;


export type PostListQuery = { postList: { totalCount: number, itemList: Array<{ postNo: number, categoryNo: number, categoryLabel: string, title: string, subDescription: string | null, author: string | null, createdAt: string }> } };

export type GetRecentPostListQueryVariables = Exact<{
  limitCount?: number | null | undefined;
}>;


export type GetRecentPostListQuery = { getRecentPostList: { totalCount: number, itemList: Array<{ postNo: number, categoryNo: number, categoryLabel: string, title: string, subDescription: string | null, author: string | null, createdAt: string }> } };

export type PostQueryVariables = Exact<{
  categoryNo: number;
  postNo: number;
}>;


export type PostQuery = { post: { postNo: number, categoryNo: number, categoryLabel: string, title: string, content: string | null, createdAt: string, writer: { no: number, nickName: string | null, imageUrl: string } } | null };

export type CategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoryListQuery = { categoryList: { totalCount: number, itemList: Array<{ value: number, label: string }> } };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { createPost: { categoryNo: number, postNo: number } };

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = { updatePost: { categoryNo: number, postNo: number } };

export type DeletePostMutationVariables = Exact<{
  input: DeletePostInput;
}>;


export type DeletePostMutation = { deletePost: boolean };


export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const PostSummaryPartsFragmentDoc = new TypedDocumentString(`
    fragment PostSummaryParts on PostSummary {
  postNo
  categoryNo
  categoryLabel
  title
  subDescription
  author
  createdAt
}
    `, {"fragmentName":"PostSummaryParts"});
export const PostDetailPartsFragmentDoc = new TypedDocumentString(`
    fragment PostDetailParts on Post {
  postNo
  categoryNo
  categoryLabel
  title
  content
  createdAt
  writer {
    no
    nickName
    imageUrl
  }
}
    `, {"fragmentName":"PostDetailParts"});
export const PostListDocument = new TypedDocumentString(`
    query PostList($categoryId: Int) {
  postList(categoryId: $categoryId) {
    totalCount
    itemList {
      ...PostSummaryParts
    }
  }
}
    fragment PostSummaryParts on PostSummary {
  postNo
  categoryNo
  categoryLabel
  title
  subDescription
  author
  createdAt
}`);

export const usePostListQuery = <
      TData = PostListQuery,
      TError = unknown
    >(
      variables?: PostListQueryVariables,
      options?: Omit<UseQueryOptions<PostListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<PostListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<PostListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['PostList'] : ['PostList', variables],
    queryFn: gqlFetch<PostListQuery, PostListQueryVariables>(PostListDocument, variables),
    ...options
  }
    )};

usePostListQuery.getKey = (variables?: PostListQueryVariables) => variables === undefined ? ['PostList'] : ['PostList', variables];

export const useSuspensePostListQuery = <
      TData = PostListQuery,
      TError = unknown
    >(
      variables?: PostListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<PostListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<PostListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<PostListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['PostList'] : ['PostList', variables],
    queryFn: gqlFetch<PostListQuery, PostListQueryVariables>(PostListDocument, variables),
    ...options
  }
    )};

useSuspensePostListQuery.getKey = (variables?: PostListQueryVariables) => variables === undefined ? ['PostList'] : ['PostList', variables];


usePostListQuery.fetcher = (variables?: PostListQueryVariables, options?: RequestInit['headers']) => gqlFetch<PostListQuery, PostListQueryVariables>(PostListDocument, variables, options);

export const GetRecentPostListDocument = new TypedDocumentString(`
    query GetRecentPostList($limitCount: Int) {
  getRecentPostList(limitCount: $limitCount) {
    totalCount
    itemList {
      ...PostSummaryParts
    }
  }
}
    fragment PostSummaryParts on PostSummary {
  postNo
  categoryNo
  categoryLabel
  title
  subDescription
  author
  createdAt
}`);

export const useGetRecentPostListQuery = <
      TData = GetRecentPostListQuery,
      TError = unknown
    >(
      variables?: GetRecentPostListQueryVariables,
      options?: Omit<UseQueryOptions<GetRecentPostListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetRecentPostListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetRecentPostListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetRecentPostList'] : ['GetRecentPostList', variables],
    queryFn: gqlFetch<GetRecentPostListQuery, GetRecentPostListQueryVariables>(GetRecentPostListDocument, variables),
    ...options
  }
    )};

useGetRecentPostListQuery.getKey = (variables?: GetRecentPostListQueryVariables) => variables === undefined ? ['GetRecentPostList'] : ['GetRecentPostList', variables];

export const useSuspenseGetRecentPostListQuery = <
      TData = GetRecentPostListQuery,
      TError = unknown
    >(
      variables?: GetRecentPostListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<GetRecentPostListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<GetRecentPostListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<GetRecentPostListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetRecentPostList'] : ['GetRecentPostList', variables],
    queryFn: gqlFetch<GetRecentPostListQuery, GetRecentPostListQueryVariables>(GetRecentPostListDocument, variables),
    ...options
  }
    )};

useSuspenseGetRecentPostListQuery.getKey = (variables?: GetRecentPostListQueryVariables) => variables === undefined ? ['GetRecentPostList'] : ['GetRecentPostList', variables];


useGetRecentPostListQuery.fetcher = (variables?: GetRecentPostListQueryVariables, options?: RequestInit['headers']) => gqlFetch<GetRecentPostListQuery, GetRecentPostListQueryVariables>(GetRecentPostListDocument, variables, options);

export const PostDocument = new TypedDocumentString(`
    query Post($categoryNo: Int!, $postNo: Int!) {
  post(categoryNo: $categoryNo, postNo: $postNo) {
    ...PostDetailParts
  }
}
    fragment PostDetailParts on Post {
  postNo
  categoryNo
  categoryLabel
  title
  content
  createdAt
  writer {
    no
    nickName
    imageUrl
  }
}`);

export const usePostQuery = <
      TData = PostQuery,
      TError = unknown
    >(
      variables: PostQueryVariables,
      options?: Omit<UseQueryOptions<PostQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<PostQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<PostQuery, TError, TData>(
      {
    queryKey: ['Post', variables],
    queryFn: gqlFetch<PostQuery, PostQueryVariables>(PostDocument, variables),
    ...options
  }
    )};

usePostQuery.getKey = (variables: PostQueryVariables) => ['Post', variables];

export const useSuspensePostQuery = <
      TData = PostQuery,
      TError = unknown
    >(
      variables: PostQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<PostQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<PostQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<PostQuery, TError, TData>(
      {
    queryKey: ['Post', variables],
    queryFn: gqlFetch<PostQuery, PostQueryVariables>(PostDocument, variables),
    ...options
  }
    )};

useSuspensePostQuery.getKey = (variables: PostQueryVariables) => ['Post', variables];


usePostQuery.fetcher = (variables: PostQueryVariables, options?: RequestInit['headers']) => gqlFetch<PostQuery, PostQueryVariables>(PostDocument, variables, options);

export const CategoryListDocument = new TypedDocumentString(`
    query CategoryList {
  categoryList {
    totalCount
    itemList {
      value
      label
    }
  }
}
    `);

export const useCategoryListQuery = <
      TData = CategoryListQuery,
      TError = unknown
    >(
      variables?: CategoryListQueryVariables,
      options?: Omit<UseQueryOptions<CategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<CategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['CategoryList'] : ['CategoryList', variables],
    queryFn: gqlFetch<CategoryListQuery, CategoryListQueryVariables>(CategoryListDocument, variables),
    ...options
  }
    )};

useCategoryListQuery.getKey = (variables?: CategoryListQueryVariables) => variables === undefined ? ['CategoryList'] : ['CategoryList', variables];

export const useSuspenseCategoryListQuery = <
      TData = CategoryListQuery,
      TError = unknown
    >(
      variables?: CategoryListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<CategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<CategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<CategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['CategoryList'] : ['CategoryList', variables],
    queryFn: gqlFetch<CategoryListQuery, CategoryListQueryVariables>(CategoryListDocument, variables),
    ...options
  }
    )};

useSuspenseCategoryListQuery.getKey = (variables?: CategoryListQueryVariables) => variables === undefined ? ['CategoryList'] : ['CategoryList', variables];


useCategoryListQuery.fetcher = (variables?: CategoryListQueryVariables, options?: RequestInit['headers']) => gqlFetch<CategoryListQuery, CategoryListQueryVariables>(CategoryListDocument, variables, options);

export const CreatePostDocument = new TypedDocumentString(`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    categoryNo
    postNo
  }
}
    `);

export const useCreatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePostMutation, TError, CreatePostMutationVariables, TContext>) => {
    
    return useMutation<CreatePostMutation, TError, CreatePostMutationVariables, TContext>(
      {
    mutationKey: ['CreatePost'],
    mutationFn: (variables?: CreatePostMutationVariables) => gqlFetch<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, variables)(),
    ...options
  }
    )};


useCreatePostMutation.fetcher = (variables: CreatePostMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, variables, options);

export const UpdatePostDocument = new TypedDocumentString(`
    mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    categoryNo
    postNo
  }
}
    `);

export const useUpdatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePostMutation, TError, UpdatePostMutationVariables, TContext>) => {
    
    return useMutation<UpdatePostMutation, TError, UpdatePostMutationVariables, TContext>(
      {
    mutationKey: ['UpdatePost'],
    mutationFn: (variables?: UpdatePostMutationVariables) => gqlFetch<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, variables)(),
    ...options
  }
    )};


useUpdatePostMutation.fetcher = (variables: UpdatePostMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, variables, options);

export const DeletePostDocument = new TypedDocumentString(`
    mutation DeletePost($input: DeletePostInput!) {
  deletePost(input: $input)
}
    `);

export const useDeletePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePostMutation, TError, DeletePostMutationVariables, TContext>) => {
    
    return useMutation<DeletePostMutation, TError, DeletePostMutationVariables, TContext>(
      {
    mutationKey: ['DeletePost'],
    mutationFn: (variables?: DeletePostMutationVariables) => gqlFetch<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, variables)(),
    ...options
  }
    )};


useDeletePostMutation.fetcher = (variables: DeletePostMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, variables, options);

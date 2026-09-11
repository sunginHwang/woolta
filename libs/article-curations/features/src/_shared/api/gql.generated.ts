/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type AddArticleToCurationInput = {
  articleId: string;
  weekKey: string;
};

export type ArticleSeoInput = {
  description?: string | null | undefined;
  imageUrl?: string | null | undefined;
  title?: string | null | undefined;
};

export type CreateArticleCategoryInput = {
  name: string;
};

export type CreateArticleInput = {
  categoryId: string;
  seo?: ArticleSeoInput | null | undefined;
  title: string;
  url: string;
};

export type DeleteArticleCategoryInput = {
  id: string;
};

export type DeleteArticleInput = {
  id: string;
};

export type RemoveArticleFromCurationInput = {
  articleId: string;
  weekKey: string;
};

export type UpdateArticleCategoryInput = {
  id: string;
  name: string;
};

export type ArticlePartsFragment = { id: string, categoryId: string, title: string, url: string, createdAt: string, updatedAt: string, seo: { title: string | null, description: string | null, imageUrl: string | null } | null };

export type ArticleCategoryPartsFragment = { id: string, name: string, order: number, createdAt: string };

export type WeeklyCurationPartsFragment = { weekKey: string, articleIds: Array<string> };

export type ArticleListQueryVariables = Exact<{ [key: string]: never; }>;


export type ArticleListQuery = { articleList: { totalCount: number, itemList: Array<{ id: string, categoryId: string, title: string, url: string, createdAt: string, updatedAt: string, seo: { title: string | null, description: string | null, imageUrl: string | null } | null }> } };

export type ArticleCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type ArticleCategoryListQuery = { articleCategoryList: { totalCount: number, itemList: Array<{ id: string, name: string, order: number, createdAt: string }> } };

export type WeeklyCurationListQueryVariables = Exact<{ [key: string]: never; }>;


export type WeeklyCurationListQuery = { weeklyCurationList: { totalCount: number, itemList: Array<{ weekKey: string, articleIds: Array<string> }> } };

export type CreateArticleMutationVariables = Exact<{
  input: CreateArticleInput;
}>;


export type CreateArticleMutation = { createArticle: { id: string, categoryId: string, title: string, url: string, createdAt: string, updatedAt: string, seo: { title: string | null, description: string | null, imageUrl: string | null } | null } };

export type DeleteArticleMutationVariables = Exact<{
  input: DeleteArticleInput;
}>;


export type DeleteArticleMutation = { deleteArticle: boolean };

export type CreateArticleCategoryMutationVariables = Exact<{
  input: CreateArticleCategoryInput;
}>;


export type CreateArticleCategoryMutation = { createArticleCategory: { id: string, name: string, order: number, createdAt: string } };

export type UpdateArticleCategoryMutationVariables = Exact<{
  input: UpdateArticleCategoryInput;
}>;


export type UpdateArticleCategoryMutation = { updateArticleCategory: { id: string, name: string, order: number, createdAt: string } };

export type DeleteArticleCategoryMutationVariables = Exact<{
  input: DeleteArticleCategoryInput;
}>;


export type DeleteArticleCategoryMutation = { deleteArticleCategory: boolean };

export type AddArticleToCurationMutationVariables = Exact<{
  input: AddArticleToCurationInput;
}>;


export type AddArticleToCurationMutation = { addArticleToCuration: { weekKey: string, articleIds: Array<string> } };

export type RemoveArticleFromCurationMutationVariables = Exact<{
  input: RemoveArticleFromCurationInput;
}>;


export type RemoveArticleFromCurationMutation = { removeArticleFromCuration: { weekKey: string, articleIds: Array<string> } };


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
export const ArticlePartsFragmentDoc = new TypedDocumentString(`
    fragment ArticleParts on Article {
  id
  categoryId
  title
  url
  seo {
    title
    description
    imageUrl
  }
  createdAt
  updatedAt
}
    `, {"fragmentName":"ArticleParts"});
export const ArticleCategoryPartsFragmentDoc = new TypedDocumentString(`
    fragment ArticleCategoryParts on ArticleCategory {
  id
  name
  order
  createdAt
}
    `, {"fragmentName":"ArticleCategoryParts"});
export const WeeklyCurationPartsFragmentDoc = new TypedDocumentString(`
    fragment WeeklyCurationParts on WeeklyCuration {
  weekKey
  articleIds
}
    `, {"fragmentName":"WeeklyCurationParts"});
export const ArticleListDocument = new TypedDocumentString(`
    query ArticleList {
  articleList {
    totalCount
    itemList {
      ...ArticleParts
    }
  }
}
    fragment ArticleParts on Article {
  id
  categoryId
  title
  url
  seo {
    title
    description
    imageUrl
  }
  createdAt
  updatedAt
}`);

export const useArticleListQuery = <
      TData = ArticleListQuery,
      TError = unknown
    >(
      variables?: ArticleListQueryVariables,
      options?: Omit<UseQueryOptions<ArticleListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ArticleListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ArticleListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['ArticleList'] : ['ArticleList', variables],
    queryFn: gqlFetch<ArticleListQuery, ArticleListQueryVariables>(ArticleListDocument, variables),
    ...options
  }
    )};

useArticleListQuery.getKey = (variables?: ArticleListQueryVariables) => variables === undefined ? ['ArticleList'] : ['ArticleList', variables];

export const useSuspenseArticleListQuery = <
      TData = ArticleListQuery,
      TError = unknown
    >(
      variables?: ArticleListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ArticleListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ArticleListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ArticleListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['ArticleList'] : ['ArticleList', variables],
    queryFn: gqlFetch<ArticleListQuery, ArticleListQueryVariables>(ArticleListDocument, variables),
    ...options
  }
    )};

useSuspenseArticleListQuery.getKey = (variables?: ArticleListQueryVariables) => variables === undefined ? ['ArticleList'] : ['ArticleList', variables];


useArticleListQuery.fetcher = (variables?: ArticleListQueryVariables, options?: RequestInit['headers']) => gqlFetch<ArticleListQuery, ArticleListQueryVariables>(ArticleListDocument, variables, options);

export const ArticleCategoryListDocument = new TypedDocumentString(`
    query ArticleCategoryList {
  articleCategoryList {
    totalCount
    itemList {
      ...ArticleCategoryParts
    }
  }
}
    fragment ArticleCategoryParts on ArticleCategory {
  id
  name
  order
  createdAt
}`);

export const useArticleCategoryListQuery = <
      TData = ArticleCategoryListQuery,
      TError = unknown
    >(
      variables?: ArticleCategoryListQueryVariables,
      options?: Omit<UseQueryOptions<ArticleCategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ArticleCategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ArticleCategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['ArticleCategoryList'] : ['ArticleCategoryList', variables],
    queryFn: gqlFetch<ArticleCategoryListQuery, ArticleCategoryListQueryVariables>(ArticleCategoryListDocument, variables),
    ...options
  }
    )};

useArticleCategoryListQuery.getKey = (variables?: ArticleCategoryListQueryVariables) => variables === undefined ? ['ArticleCategoryList'] : ['ArticleCategoryList', variables];

export const useSuspenseArticleCategoryListQuery = <
      TData = ArticleCategoryListQuery,
      TError = unknown
    >(
      variables?: ArticleCategoryListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ArticleCategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ArticleCategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ArticleCategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['ArticleCategoryList'] : ['ArticleCategoryList', variables],
    queryFn: gqlFetch<ArticleCategoryListQuery, ArticleCategoryListQueryVariables>(ArticleCategoryListDocument, variables),
    ...options
  }
    )};

useSuspenseArticleCategoryListQuery.getKey = (variables?: ArticleCategoryListQueryVariables) => variables === undefined ? ['ArticleCategoryList'] : ['ArticleCategoryList', variables];


useArticleCategoryListQuery.fetcher = (variables?: ArticleCategoryListQueryVariables, options?: RequestInit['headers']) => gqlFetch<ArticleCategoryListQuery, ArticleCategoryListQueryVariables>(ArticleCategoryListDocument, variables, options);

export const WeeklyCurationListDocument = new TypedDocumentString(`
    query WeeklyCurationList {
  weeklyCurationList {
    totalCount
    itemList {
      ...WeeklyCurationParts
    }
  }
}
    fragment WeeklyCurationParts on WeeklyCuration {
  weekKey
  articleIds
}`);

export const useWeeklyCurationListQuery = <
      TData = WeeklyCurationListQuery,
      TError = unknown
    >(
      variables?: WeeklyCurationListQueryVariables,
      options?: Omit<UseQueryOptions<WeeklyCurationListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<WeeklyCurationListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<WeeklyCurationListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['WeeklyCurationList'] : ['WeeklyCurationList', variables],
    queryFn: gqlFetch<WeeklyCurationListQuery, WeeklyCurationListQueryVariables>(WeeklyCurationListDocument, variables),
    ...options
  }
    )};

useWeeklyCurationListQuery.getKey = (variables?: WeeklyCurationListQueryVariables) => variables === undefined ? ['WeeklyCurationList'] : ['WeeklyCurationList', variables];

export const useSuspenseWeeklyCurationListQuery = <
      TData = WeeklyCurationListQuery,
      TError = unknown
    >(
      variables?: WeeklyCurationListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<WeeklyCurationListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<WeeklyCurationListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<WeeklyCurationListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['WeeklyCurationList'] : ['WeeklyCurationList', variables],
    queryFn: gqlFetch<WeeklyCurationListQuery, WeeklyCurationListQueryVariables>(WeeklyCurationListDocument, variables),
    ...options
  }
    )};

useSuspenseWeeklyCurationListQuery.getKey = (variables?: WeeklyCurationListQueryVariables) => variables === undefined ? ['WeeklyCurationList'] : ['WeeklyCurationList', variables];


useWeeklyCurationListQuery.fetcher = (variables?: WeeklyCurationListQueryVariables, options?: RequestInit['headers']) => gqlFetch<WeeklyCurationListQuery, WeeklyCurationListQueryVariables>(WeeklyCurationListDocument, variables, options);

export const CreateArticleDocument = new TypedDocumentString(`
    mutation CreateArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    ...ArticleParts
  }
}
    fragment ArticleParts on Article {
  id
  categoryId
  title
  url
  seo {
    title
    description
    imageUrl
  }
  createdAt
  updatedAt
}`);

export const useCreateArticleMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateArticleMutation, TError, CreateArticleMutationVariables, TContext>) => {
    
    return useMutation<CreateArticleMutation, TError, CreateArticleMutationVariables, TContext>(
      {
    mutationKey: ['CreateArticle'],
    mutationFn: (variables?: CreateArticleMutationVariables) => gqlFetch<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument, variables)(),
    ...options
  }
    )};


useCreateArticleMutation.fetcher = (variables: CreateArticleMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument, variables, options);

export const DeleteArticleDocument = new TypedDocumentString(`
    mutation DeleteArticle($input: DeleteArticleInput!) {
  deleteArticle(input: $input)
}
    `);

export const useDeleteArticleMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteArticleMutation, TError, DeleteArticleMutationVariables, TContext>) => {
    
    return useMutation<DeleteArticleMutation, TError, DeleteArticleMutationVariables, TContext>(
      {
    mutationKey: ['DeleteArticle'],
    mutationFn: (variables?: DeleteArticleMutationVariables) => gqlFetch<DeleteArticleMutation, DeleteArticleMutationVariables>(DeleteArticleDocument, variables)(),
    ...options
  }
    )};


useDeleteArticleMutation.fetcher = (variables: DeleteArticleMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteArticleMutation, DeleteArticleMutationVariables>(DeleteArticleDocument, variables, options);

export const CreateArticleCategoryDocument = new TypedDocumentString(`
    mutation CreateArticleCategory($input: CreateArticleCategoryInput!) {
  createArticleCategory(input: $input) {
    ...ArticleCategoryParts
  }
}
    fragment ArticleCategoryParts on ArticleCategory {
  id
  name
  order
  createdAt
}`);

export const useCreateArticleCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateArticleCategoryMutation, TError, CreateArticleCategoryMutationVariables, TContext>) => {
    
    return useMutation<CreateArticleCategoryMutation, TError, CreateArticleCategoryMutationVariables, TContext>(
      {
    mutationKey: ['CreateArticleCategory'],
    mutationFn: (variables?: CreateArticleCategoryMutationVariables) => gqlFetch<CreateArticleCategoryMutation, CreateArticleCategoryMutationVariables>(CreateArticleCategoryDocument, variables)(),
    ...options
  }
    )};


useCreateArticleCategoryMutation.fetcher = (variables: CreateArticleCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateArticleCategoryMutation, CreateArticleCategoryMutationVariables>(CreateArticleCategoryDocument, variables, options);

export const UpdateArticleCategoryDocument = new TypedDocumentString(`
    mutation UpdateArticleCategory($input: UpdateArticleCategoryInput!) {
  updateArticleCategory(input: $input) {
    ...ArticleCategoryParts
  }
}
    fragment ArticleCategoryParts on ArticleCategory {
  id
  name
  order
  createdAt
}`);

export const useUpdateArticleCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateArticleCategoryMutation, TError, UpdateArticleCategoryMutationVariables, TContext>) => {
    
    return useMutation<UpdateArticleCategoryMutation, TError, UpdateArticleCategoryMutationVariables, TContext>(
      {
    mutationKey: ['UpdateArticleCategory'],
    mutationFn: (variables?: UpdateArticleCategoryMutationVariables) => gqlFetch<UpdateArticleCategoryMutation, UpdateArticleCategoryMutationVariables>(UpdateArticleCategoryDocument, variables)(),
    ...options
  }
    )};


useUpdateArticleCategoryMutation.fetcher = (variables: UpdateArticleCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateArticleCategoryMutation, UpdateArticleCategoryMutationVariables>(UpdateArticleCategoryDocument, variables, options);

export const DeleteArticleCategoryDocument = new TypedDocumentString(`
    mutation DeleteArticleCategory($input: DeleteArticleCategoryInput!) {
  deleteArticleCategory(input: $input)
}
    `);

export const useDeleteArticleCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteArticleCategoryMutation, TError, DeleteArticleCategoryMutationVariables, TContext>) => {
    
    return useMutation<DeleteArticleCategoryMutation, TError, DeleteArticleCategoryMutationVariables, TContext>(
      {
    mutationKey: ['DeleteArticleCategory'],
    mutationFn: (variables?: DeleteArticleCategoryMutationVariables) => gqlFetch<DeleteArticleCategoryMutation, DeleteArticleCategoryMutationVariables>(DeleteArticleCategoryDocument, variables)(),
    ...options
  }
    )};


useDeleteArticleCategoryMutation.fetcher = (variables: DeleteArticleCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteArticleCategoryMutation, DeleteArticleCategoryMutationVariables>(DeleteArticleCategoryDocument, variables, options);

export const AddArticleToCurationDocument = new TypedDocumentString(`
    mutation AddArticleToCuration($input: AddArticleToCurationInput!) {
  addArticleToCuration(input: $input) {
    ...WeeklyCurationParts
  }
}
    fragment WeeklyCurationParts on WeeklyCuration {
  weekKey
  articleIds
}`);

export const useAddArticleToCurationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddArticleToCurationMutation, TError, AddArticleToCurationMutationVariables, TContext>) => {
    
    return useMutation<AddArticleToCurationMutation, TError, AddArticleToCurationMutationVariables, TContext>(
      {
    mutationKey: ['AddArticleToCuration'],
    mutationFn: (variables?: AddArticleToCurationMutationVariables) => gqlFetch<AddArticleToCurationMutation, AddArticleToCurationMutationVariables>(AddArticleToCurationDocument, variables)(),
    ...options
  }
    )};


useAddArticleToCurationMutation.fetcher = (variables: AddArticleToCurationMutationVariables, options?: RequestInit['headers']) => gqlFetch<AddArticleToCurationMutation, AddArticleToCurationMutationVariables>(AddArticleToCurationDocument, variables, options);

export const RemoveArticleFromCurationDocument = new TypedDocumentString(`
    mutation RemoveArticleFromCuration($input: RemoveArticleFromCurationInput!) {
  removeArticleFromCuration(input: $input) {
    ...WeeklyCurationParts
  }
}
    fragment WeeklyCurationParts on WeeklyCuration {
  weekKey
  articleIds
}`);

export const useRemoveArticleFromCurationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveArticleFromCurationMutation, TError, RemoveArticleFromCurationMutationVariables, TContext>) => {
    
    return useMutation<RemoveArticleFromCurationMutation, TError, RemoveArticleFromCurationMutationVariables, TContext>(
      {
    mutationKey: ['RemoveArticleFromCuration'],
    mutationFn: (variables?: RemoveArticleFromCurationMutationVariables) => gqlFetch<RemoveArticleFromCurationMutation, RemoveArticleFromCurationMutationVariables>(RemoveArticleFromCurationDocument, variables)(),
    ...options
  }
    )};


useRemoveArticleFromCurationMutation.fetcher = (variables: RemoveArticleFromCurationMutationVariables, options?: RequestInit['headers']) => gqlFetch<RemoveArticleFromCurationMutation, RemoveArticleFromCurationMutationVariables>(RemoveArticleFromCurationDocument, variables, options);

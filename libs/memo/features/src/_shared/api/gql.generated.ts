/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type DeleteMemoInput = {
  id: string;
};

export type UpdateMemoInput = {
  content?: unknown;
  id: string;
  title?: string | null | undefined;
};

export type MemoSummaryPartsFragment = { id: string, title: string, createdAt: string, updatedAt: string };

export type MemoPartsFragment = { id: string, title: string, content: unknown, createdAt: string, updatedAt: string };

export type MemoListQueryVariables = Exact<{ [key: string]: never; }>;


export type MemoListQuery = { memoList: { totalCount: number, itemList: Array<{ id: string, title: string, createdAt: string, updatedAt: string }> } };

export type MemoQueryVariables = Exact<{
  id: string;
}>;


export type MemoQuery = { memo: { id: string, title: string, content: unknown, createdAt: string, updatedAt: string } | null };

export type CreateMemoMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateMemoMutation = { createMemo: { id: string, title: string, content: unknown, createdAt: string, updatedAt: string } };

export type UpdateMemoMutationVariables = Exact<{
  input: UpdateMemoInput;
}>;


export type UpdateMemoMutation = { updateMemo: { id: string, title: string, content: unknown, createdAt: string, updatedAt: string } };

export type DeleteMemoMutationVariables = Exact<{
  input: DeleteMemoInput;
}>;


export type DeleteMemoMutation = { deleteMemo: boolean };


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
export const MemoSummaryPartsFragmentDoc = new TypedDocumentString(`
    fragment MemoSummaryParts on MemoSummary {
  id
  title
  createdAt
  updatedAt
}
    `, {"fragmentName":"MemoSummaryParts"});
export const MemoPartsFragmentDoc = new TypedDocumentString(`
    fragment MemoParts on Memo {
  id
  title
  content
  createdAt
  updatedAt
}
    `, {"fragmentName":"MemoParts"});
export const MemoListDocument = new TypedDocumentString(`
    query MemoList {
  memoList {
    totalCount
    itemList {
      ...MemoSummaryParts
    }
  }
}
    fragment MemoSummaryParts on MemoSummary {
  id
  title
  createdAt
  updatedAt
}`);

export const useMemoListQuery = <
      TData = MemoListQuery,
      TError = unknown
    >(
      variables?: MemoListQueryVariables,
      options?: Omit<UseQueryOptions<MemoListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MemoListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MemoListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MemoList'] : ['MemoList', variables],
    queryFn: gqlFetch<MemoListQuery, MemoListQueryVariables>(MemoListDocument, variables),
    ...options
  }
    )};

useMemoListQuery.getKey = (variables?: MemoListQueryVariables) => variables === undefined ? ['MemoList'] : ['MemoList', variables];

export const useSuspenseMemoListQuery = <
      TData = MemoListQuery,
      TError = unknown
    >(
      variables?: MemoListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<MemoListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<MemoListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<MemoListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MemoList'] : ['MemoList', variables],
    queryFn: gqlFetch<MemoListQuery, MemoListQueryVariables>(MemoListDocument, variables),
    ...options
  }
    )};

useSuspenseMemoListQuery.getKey = (variables?: MemoListQueryVariables) => variables === undefined ? ['MemoList'] : ['MemoList', variables];


useMemoListQuery.fetcher = (variables?: MemoListQueryVariables, options?: RequestInit['headers']) => gqlFetch<MemoListQuery, MemoListQueryVariables>(MemoListDocument, variables, options);

export const MemoDocument = new TypedDocumentString(`
    query Memo($id: String!) {
  memo(id: $id) {
    ...MemoParts
  }
}
    fragment MemoParts on Memo {
  id
  title
  content
  createdAt
  updatedAt
}`);

export const useMemoQuery = <
      TData = MemoQuery,
      TError = unknown
    >(
      variables: MemoQueryVariables,
      options?: Omit<UseQueryOptions<MemoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MemoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MemoQuery, TError, TData>(
      {
    queryKey: ['Memo', variables],
    queryFn: gqlFetch<MemoQuery, MemoQueryVariables>(MemoDocument, variables),
    ...options
  }
    )};

useMemoQuery.getKey = (variables: MemoQueryVariables) => ['Memo', variables];

export const useSuspenseMemoQuery = <
      TData = MemoQuery,
      TError = unknown
    >(
      variables: MemoQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<MemoQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<MemoQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<MemoQuery, TError, TData>(
      {
    queryKey: ['Memo', variables],
    queryFn: gqlFetch<MemoQuery, MemoQueryVariables>(MemoDocument, variables),
    ...options
  }
    )};

useSuspenseMemoQuery.getKey = (variables: MemoQueryVariables) => ['Memo', variables];


useMemoQuery.fetcher = (variables: MemoQueryVariables, options?: RequestInit['headers']) => gqlFetch<MemoQuery, MemoQueryVariables>(MemoDocument, variables, options);

export const CreateMemoDocument = new TypedDocumentString(`
    mutation CreateMemo {
  createMemo {
    ...MemoParts
  }
}
    fragment MemoParts on Memo {
  id
  title
  content
  createdAt
  updatedAt
}`);

export const useCreateMemoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateMemoMutation, TError, CreateMemoMutationVariables, TContext>) => {
    
    return useMutation<CreateMemoMutation, TError, CreateMemoMutationVariables, TContext>(
      {
    mutationKey: ['CreateMemo'],
    mutationFn: (variables?: CreateMemoMutationVariables) => gqlFetch<CreateMemoMutation, CreateMemoMutationVariables>(CreateMemoDocument, variables)(),
    ...options
  }
    )};


useCreateMemoMutation.fetcher = (variables?: CreateMemoMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateMemoMutation, CreateMemoMutationVariables>(CreateMemoDocument, variables, options);

export const UpdateMemoDocument = new TypedDocumentString(`
    mutation UpdateMemo($input: UpdateMemoInput!) {
  updateMemo(input: $input) {
    ...MemoParts
  }
}
    fragment MemoParts on Memo {
  id
  title
  content
  createdAt
  updatedAt
}`);

export const useUpdateMemoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateMemoMutation, TError, UpdateMemoMutationVariables, TContext>) => {
    
    return useMutation<UpdateMemoMutation, TError, UpdateMemoMutationVariables, TContext>(
      {
    mutationKey: ['UpdateMemo'],
    mutationFn: (variables?: UpdateMemoMutationVariables) => gqlFetch<UpdateMemoMutation, UpdateMemoMutationVariables>(UpdateMemoDocument, variables)(),
    ...options
  }
    )};


useUpdateMemoMutation.fetcher = (variables: UpdateMemoMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateMemoMutation, UpdateMemoMutationVariables>(UpdateMemoDocument, variables, options);

export const DeleteMemoDocument = new TypedDocumentString(`
    mutation DeleteMemo($input: DeleteMemoInput!) {
  deleteMemo(input: $input)
}
    `);

export const useDeleteMemoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteMemoMutation, TError, DeleteMemoMutationVariables, TContext>) => {
    
    return useMutation<DeleteMemoMutation, TError, DeleteMemoMutationVariables, TContext>(
      {
    mutationKey: ['DeleteMemo'],
    mutationFn: (variables?: DeleteMemoMutationVariables) => gqlFetch<DeleteMemoMutation, DeleteMemoMutationVariables>(DeleteMemoDocument, variables)(),
    ...options
  }
    )};


useDeleteMemoMutation.fetcher = (variables: DeleteMemoMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteMemoMutation, DeleteMemoMutationVariables>(DeleteMemoDocument, variables, options);

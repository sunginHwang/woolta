/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type AccountBookCategoryType =
  | 'EXPENDITURE'
  | 'INCOME';

export type BucketListTodoInput = {
  isComplete: boolean;
  title: string;
};

export type CompleteBucketListInput = {
  id: string | number;
};

export type CreateAccountBookCategoryInput = {
  accountBookCategoryImageId: number;
  name: string;
  type: AccountBookCategoryType;
  useStatistic: boolean;
};

export type CreateAccountBookInput = {
  amount: number;
  categoryId: number;
  installmentMonth?: number | null | undefined;
  isDisabledBudget?: boolean | null | undefined;
  memo?: string | null | undefined;
  registerDateTime: string;
  scheduledPaymentDay?: number | null | undefined;
  scheduledPaymentType?: ScheduledPaymentType | null | undefined;
  title: string;
  type: AccountBookCategoryType;
};

export type CreateAccountBookItemInput = {
  amount: number;
  categoryId: number;
  isDisabledBudget?: boolean | null | undefined;
  memo?: string | null | undefined;
  registerDateTime: string;
  title: string;
  type: AccountBookCategoryType;
};

/**
 * 카드 내역서 벌크 등록. 항목은 단건 생성과 같은 입력을 쓴다.
 * 정기지출/할부(scheduledPayment*)는 받지 않는다 — 내역서 한 줄은 이미 승인된 개별 거래이고,
 * 벌크로 정기지출을 만들면 같은 지출이 매달 자동 생성돼 중복이 된다.
 */
export type CreateAccountBookListInput = {
  itemList: Array<CreateAccountBookItemInput>;
};

export type CreateBucketListInput = {
  completeDate: string;
  description: string;
  imageUrl?: string | null | undefined;
  thumbImageUrl?: string | null | undefined;
  title: string;
  todoList?: Array<BucketListTodoInput> | null | undefined;
};

export type CreateBucketListTodoInput = {
  bucketListId: number;
  isComplete: boolean;
  title: string;
};

export type CreateRegularExpenditureInput = {
  amount: number;
  categoryId: number;
  isAutoExpenditure: boolean;
  regularDate: number;
  title: string;
};

export type DeleteAccountBookInput = {
  id: string | number;
};

export type DeleteBucketListInput = {
  id: string | number;
};

export type DeleteBucketListTodoInput = {
  todoId: string | number;
};

export type DeleteRegularExpenditureInput = {
  id: string | number;
};

export type ScheduledPaymentType =
  | 'INSTALLMENT'
  | 'REPEAT';

export type UpdateAccountBookInput = {
  amount?: number | null | undefined;
  categoryId?: number | null | undefined;
  id: string | number;
  isDisabledBudget?: boolean | null | undefined;
  memo?: string | null | undefined;
  registerDateTime?: string | null | undefined;
  title?: string | null | undefined;
  type?: AccountBookCategoryType | null | undefined;
};

export type UpdateBucketListInput = {
  completeDate: string;
  description: string;
  id: string | number;
  imageUrl?: string | null | undefined;
  thumbImageUrl?: string | null | undefined;
  title: string;
};

export type UpdateBucketListTodoCompleteInput = {
  isComplete: boolean;
  todoId: string | number;
};

export type AccountBookPartsFragment = { id: string, title: string, amount: number, memo: string, type: AccountBookCategoryType, registerDateTime: string, isDisabledBudget: boolean, isRegularExpenditure: boolean, installmentMonth: number | null, paidInstallmentMonth: number | null, regularDate: number | null, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } };

export type AccountBookListQueryVariables = Exact<{
  dateTime: string;
}>;


export type AccountBookListQuery = { accountBookList: { totalCount: number, itemList: Array<{ id: string, title: string, amount: number, memo: string, type: AccountBookCategoryType, registerDateTime: string, isDisabledBudget: boolean, isRegularExpenditure: boolean, installmentMonth: number | null, paidInstallmentMonth: number | null, regularDate: number | null, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } }> } };

export type AccountBookQueryVariables = Exact<{
  id: string | number;
}>;


export type AccountBookQuery = { accountBook: { id: string, title: string, amount: number, memo: string, type: AccountBookCategoryType, registerDateTime: string, isDisabledBudget: boolean, isRegularExpenditure: boolean, installmentMonth: number | null, paidInstallmentMonth: number | null, regularDate: number | null, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } } | null };

export type CreateAccountBookMutationVariables = Exact<{
  input: CreateAccountBookInput;
}>;


export type CreateAccountBookMutation = { createAccountBook: { id: string, title: string, amount: number, memo: string, type: AccountBookCategoryType, registerDateTime: string, isDisabledBudget: boolean, isRegularExpenditure: boolean, installmentMonth: number | null, paidInstallmentMonth: number | null, regularDate: number | null, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } } };

export type CreateAccountBookListMutationVariables = Exact<{
  input: CreateAccountBookListInput;
}>;


export type CreateAccountBookListMutation = { createAccountBookList: { createdCount: number, itemList: Array<{ id: string, title: string, amount: number, memo: string, type: AccountBookCategoryType, registerDateTime: string, isDisabledBudget: boolean, isRegularExpenditure: boolean, installmentMonth: number | null, paidInstallmentMonth: number | null, regularDate: number | null, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } }> } };

export type UpdateAccountBookMutationVariables = Exact<{
  input: UpdateAccountBookInput;
}>;


export type UpdateAccountBookMutation = { updateAccountBook: { id: string, title: string, amount: number, memo: string, type: AccountBookCategoryType, registerDateTime: string, isDisabledBudget: boolean, isRegularExpenditure: boolean, installmentMonth: number | null, paidInstallmentMonth: number | null, regularDate: number | null, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } } };

export type DeleteAccountBookMutationVariables = Exact<{
  input: DeleteAccountBookInput;
}>;


export type DeleteAccountBookMutation = { deleteAccountBook: boolean };

export type AccountBookCategoryImagePartsFragment = { id: string, name: string, imageUrl: string };

export type AccountBookCategoryPartsFragment = { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } };

export type AccountBookCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountBookCategoryListQuery = { accountBookCategoryList: { totalCount: number, itemList: Array<{ id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } }> } };

export type AccountBookCategoryImageListQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountBookCategoryImageListQuery = { accountBookCategoryImageList: { totalCount: number, itemList: Array<{ id: string, name: string, imageUrl: string }> } };

export type CreateAccountBookCategoryMutationVariables = Exact<{
  input: CreateAccountBookCategoryInput;
}>;


export type CreateAccountBookCategoryMutation = { createAccountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } };

export type BucketListTodoPartsFragment = { id: string, title: string, isComplete: boolean, bucketListId: number };

export type BucketListSummaryPartsFragment = { id: string, title: string, completeDate: string, isComplete: boolean, todoCount: number, completeTodoCount: number, thumbImageUrl: string, updatedAt: string };

export type BucketListPartsFragment = { id: string, title: string, description: string, completeDate: string, isComplete: boolean, imageUrl: string, thumbImageUrl: string, createdAt: string, updatedAt: string, todoList: Array<{ id: string, title: string, isComplete: boolean, bucketListId: number }> };

export type BucketListSummaryListQueryVariables = Exact<{
  limitCount?: number | null | undefined;
}>;


export type BucketListSummaryListQuery = { bucketListSummaryList: { totalCount: number, itemList: Array<{ id: string, title: string, completeDate: string, isComplete: boolean, todoCount: number, completeTodoCount: number, thumbImageUrl: string, updatedAt: string }> } };

export type BucketListQueryVariables = Exact<{
  id: string | number;
}>;


export type BucketListQuery = { bucketList: { id: string, title: string, description: string, completeDate: string, isComplete: boolean, imageUrl: string, thumbImageUrl: string, createdAt: string, updatedAt: string, todoList: Array<{ id: string, title: string, isComplete: boolean, bucketListId: number }> } | null };

export type CreateBucketListMutationVariables = Exact<{
  input: CreateBucketListInput;
}>;


export type CreateBucketListMutation = { createBucketList: { id: string, title: string, description: string, completeDate: string, isComplete: boolean, imageUrl: string, thumbImageUrl: string, createdAt: string, updatedAt: string, todoList: Array<{ id: string, title: string, isComplete: boolean, bucketListId: number }> } };

export type UpdateBucketListMutationVariables = Exact<{
  input: UpdateBucketListInput;
}>;


export type UpdateBucketListMutation = { updateBucketList: { id: string, title: string, description: string, completeDate: string, isComplete: boolean, imageUrl: string, thumbImageUrl: string, createdAt: string, updatedAt: string, todoList: Array<{ id: string, title: string, isComplete: boolean, bucketListId: number }> } };

export type DeleteBucketListMutationVariables = Exact<{
  input: DeleteBucketListInput;
}>;


export type DeleteBucketListMutation = { deleteBucketList: boolean };

export type CompleteBucketListMutationVariables = Exact<{
  input: CompleteBucketListInput;
}>;


export type CompleteBucketListMutation = { completeBucketList: boolean };

export type CreateBucketListTodoMutationVariables = Exact<{
  input: CreateBucketListTodoInput;
}>;


export type CreateBucketListTodoMutation = { createBucketListTodo: { id: string, title: string, isComplete: boolean, bucketListId: number } };

export type DeleteBucketListTodoMutationVariables = Exact<{
  input: DeleteBucketListTodoInput;
}>;


export type DeleteBucketListTodoMutation = { deleteBucketListTodo: boolean };

export type UpdateBucketListTodoCompleteMutationVariables = Exact<{
  input: UpdateBucketListTodoCompleteInput;
}>;


export type UpdateBucketListTodoCompleteMutation = { updateBucketListTodoComplete: { id: string, title: string, isComplete: boolean, bucketListId: number } };

export type RegularExpenditureItemPartsFragment = { id: string, title: string, amount: number, regularDate: number, regularExpenditureDay: string, isAutoExpenditure: boolean, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } };

export type RegularExpenditureGroupPartsFragment = { name: string, type: AccountBookCategoryType, imageUrl: string, list: Array<{ id: string, title: string, amount: number, regularDate: number, regularExpenditureDay: string, isAutoExpenditure: boolean, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } }> };

export type RegularExpenditureGroupListQueryVariables = Exact<{
  limitCount?: number | null | undefined;
}>;


export type RegularExpenditureGroupListQuery = { regularExpenditureGroupList: { totalCount: number, itemList: Array<{ name: string, type: AccountBookCategoryType, imageUrl: string, list: Array<{ id: string, title: string, amount: number, regularDate: number, regularExpenditureDay: string, isAutoExpenditure: boolean, accountBookCategoryId: number, accountBookCategory: { id: string, name: string, type: AccountBookCategoryType, useStatistic: boolean, accountBookCategoryImageId: number, accountBookCategoryImage: { id: string, name: string, imageUrl: string } } }> }> } };

export type CreateRegularExpenditureMutationVariables = Exact<{
  input: CreateRegularExpenditureInput;
}>;


export type CreateRegularExpenditureMutation = { createRegularExpenditure: { id: string, title: string, amount: number, regularDate: number, isAutoExpenditure: boolean } };

export type DeleteRegularExpenditureMutationVariables = Exact<{
  input: DeleteRegularExpenditureInput;
}>;


export type DeleteRegularExpenditureMutation = { deleteRegularExpenditure: boolean };

export type StatisticItemPartsFragment = { title: string, amount: number, registerDateTime: string };

export type StatisticPartsFragment = { categoryId: string, categoryName: string, amount: number, percentage: number, useStatistic: boolean, list: Array<{ title: string, amount: number, registerDateTime: string }> };

export type GetAccountBookStatisticListQueryVariables = Exact<{
  startDate: string;
  endDate: string;
  type: AccountBookCategoryType;
}>;


export type GetAccountBookStatisticListQuery = { getAccountBookStatisticList: { totalCount: number, itemList: Array<{ categoryId: string, categoryName: string, amount: number, percentage: number, useStatistic: boolean, list: Array<{ title: string, amount: number, registerDateTime: string }> }> } };


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
export const AccountBookCategoryImagePartsFragmentDoc = new TypedDocumentString(`
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
    `, {"fragmentName":"AccountBookCategoryImageParts"});
export const AccountBookCategoryPartsFragmentDoc = new TypedDocumentString(`
    fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}`, {"fragmentName":"AccountBookCategoryParts"});
export const AccountBookPartsFragmentDoc = new TypedDocumentString(`
    fragment AccountBookParts on AccountBook {
  id
  title
  amount
  memo
  type
  registerDateTime
  isDisabledBudget
  isRegularExpenditure
  installmentMonth
  paidInstallmentMonth
  regularDate
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`, {"fragmentName":"AccountBookParts"});
export const BucketListSummaryPartsFragmentDoc = new TypedDocumentString(`
    fragment BucketListSummaryParts on BucketListSummary {
  id
  title
  completeDate
  isComplete
  todoCount
  completeTodoCount
  thumbImageUrl
  updatedAt
}
    `, {"fragmentName":"BucketListSummaryParts"});
export const BucketListTodoPartsFragmentDoc = new TypedDocumentString(`
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}
    `, {"fragmentName":"BucketListTodoParts"});
export const BucketListPartsFragmentDoc = new TypedDocumentString(`
    fragment BucketListParts on BucketList {
  id
  title
  description
  completeDate
  isComplete
  imageUrl
  thumbImageUrl
  createdAt
  updatedAt
  todoList {
    ...BucketListTodoParts
  }
}
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}`, {"fragmentName":"BucketListParts"});
export const RegularExpenditureItemPartsFragmentDoc = new TypedDocumentString(`
    fragment RegularExpenditureItemParts on CustomRegularExpenditure {
  id
  title
  amount
  regularDate
  regularExpenditureDay
  isAutoExpenditure
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`, {"fragmentName":"RegularExpenditureItemParts"});
export const RegularExpenditureGroupPartsFragmentDoc = new TypedDocumentString(`
    fragment RegularExpenditureGroupParts on RegularExpenditureGroup {
  name
  type
  imageUrl
  list {
    ...RegularExpenditureItemParts
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}
fragment RegularExpenditureItemParts on CustomRegularExpenditure {
  id
  title
  amount
  regularDate
  regularExpenditureDay
  isAutoExpenditure
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}`, {"fragmentName":"RegularExpenditureGroupParts"});
export const StatisticItemPartsFragmentDoc = new TypedDocumentString(`
    fragment StatisticItemParts on StatisticItem {
  title
  amount
  registerDateTime
}
    `, {"fragmentName":"StatisticItemParts"});
export const StatisticPartsFragmentDoc = new TypedDocumentString(`
    fragment StatisticParts on Statistic {
  categoryId
  categoryName
  amount
  percentage
  useStatistic
  list {
    ...StatisticItemParts
  }
}
    fragment StatisticItemParts on StatisticItem {
  title
  amount
  registerDateTime
}`, {"fragmentName":"StatisticParts"});
export const AccountBookListDocument = new TypedDocumentString(`
    query AccountBookList($dateTime: DateTime!) {
  accountBookList(dateTime: $dateTime) {
    totalCount
    itemList {
      ...AccountBookParts
    }
  }
}
    fragment AccountBookParts on AccountBook {
  id
  title
  amount
  memo
  type
  registerDateTime
  isDisabledBudget
  isRegularExpenditure
  installmentMonth
  paidInstallmentMonth
  regularDate
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useAccountBookListQuery = <
      TData = AccountBookListQuery,
      TError = unknown
    >(
      variables: AccountBookListQueryVariables,
      options?: Omit<UseQueryOptions<AccountBookListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AccountBookListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AccountBookListQuery, TError, TData>(
      {
    queryKey: ['AccountBookList', variables],
    queryFn: gqlFetch<AccountBookListQuery, AccountBookListQueryVariables>(AccountBookListDocument, variables),
    ...options
  }
    )};

useAccountBookListQuery.getKey = (variables: AccountBookListQueryVariables) => ['AccountBookList', variables];

export const useSuspenseAccountBookListQuery = <
      TData = AccountBookListQuery,
      TError = unknown
    >(
      variables: AccountBookListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AccountBookListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AccountBookListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AccountBookListQuery, TError, TData>(
      {
    queryKey: ['AccountBookList', variables],
    queryFn: gqlFetch<AccountBookListQuery, AccountBookListQueryVariables>(AccountBookListDocument, variables),
    ...options
  }
    )};

useSuspenseAccountBookListQuery.getKey = (variables: AccountBookListQueryVariables) => ['AccountBookList', variables];


useAccountBookListQuery.fetcher = (variables: AccountBookListQueryVariables, options?: RequestInit['headers']) => gqlFetch<AccountBookListQuery, AccountBookListQueryVariables>(AccountBookListDocument, variables, options);

export const AccountBookDocument = new TypedDocumentString(`
    query AccountBook($id: ID!) {
  accountBook(id: $id) {
    ...AccountBookParts
  }
}
    fragment AccountBookParts on AccountBook {
  id
  title
  amount
  memo
  type
  registerDateTime
  isDisabledBudget
  isRegularExpenditure
  installmentMonth
  paidInstallmentMonth
  regularDate
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useAccountBookQuery = <
      TData = AccountBookQuery,
      TError = unknown
    >(
      variables: AccountBookQueryVariables,
      options?: Omit<UseQueryOptions<AccountBookQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AccountBookQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AccountBookQuery, TError, TData>(
      {
    queryKey: ['AccountBook', variables],
    queryFn: gqlFetch<AccountBookQuery, AccountBookQueryVariables>(AccountBookDocument, variables),
    ...options
  }
    )};

useAccountBookQuery.getKey = (variables: AccountBookQueryVariables) => ['AccountBook', variables];

export const useSuspenseAccountBookQuery = <
      TData = AccountBookQuery,
      TError = unknown
    >(
      variables: AccountBookQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AccountBookQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AccountBookQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AccountBookQuery, TError, TData>(
      {
    queryKey: ['AccountBook', variables],
    queryFn: gqlFetch<AccountBookQuery, AccountBookQueryVariables>(AccountBookDocument, variables),
    ...options
  }
    )};

useSuspenseAccountBookQuery.getKey = (variables: AccountBookQueryVariables) => ['AccountBook', variables];


useAccountBookQuery.fetcher = (variables: AccountBookQueryVariables, options?: RequestInit['headers']) => gqlFetch<AccountBookQuery, AccountBookQueryVariables>(AccountBookDocument, variables, options);

export const CreateAccountBookDocument = new TypedDocumentString(`
    mutation CreateAccountBook($input: CreateAccountBookInput!) {
  createAccountBook(input: $input) {
    ...AccountBookParts
  }
}
    fragment AccountBookParts on AccountBook {
  id
  title
  amount
  memo
  type
  registerDateTime
  isDisabledBudget
  isRegularExpenditure
  installmentMonth
  paidInstallmentMonth
  regularDate
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useCreateAccountBookMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateAccountBookMutation, TError, CreateAccountBookMutationVariables, TContext>) => {
    
    return useMutation<CreateAccountBookMutation, TError, CreateAccountBookMutationVariables, TContext>(
      {
    mutationKey: ['CreateAccountBook'],
    mutationFn: (variables?: CreateAccountBookMutationVariables) => gqlFetch<CreateAccountBookMutation, CreateAccountBookMutationVariables>(CreateAccountBookDocument, variables)(),
    ...options
  }
    )};


useCreateAccountBookMutation.fetcher = (variables: CreateAccountBookMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateAccountBookMutation, CreateAccountBookMutationVariables>(CreateAccountBookDocument, variables, options);

export const CreateAccountBookListDocument = new TypedDocumentString(`
    mutation CreateAccountBookList($input: CreateAccountBookListInput!) {
  createAccountBookList(input: $input) {
    createdCount
    itemList {
      ...AccountBookParts
    }
  }
}
    fragment AccountBookParts on AccountBook {
  id
  title
  amount
  memo
  type
  registerDateTime
  isDisabledBudget
  isRegularExpenditure
  installmentMonth
  paidInstallmentMonth
  regularDate
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useCreateAccountBookListMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateAccountBookListMutation, TError, CreateAccountBookListMutationVariables, TContext>) => {
    
    return useMutation<CreateAccountBookListMutation, TError, CreateAccountBookListMutationVariables, TContext>(
      {
    mutationKey: ['CreateAccountBookList'],
    mutationFn: (variables?: CreateAccountBookListMutationVariables) => gqlFetch<CreateAccountBookListMutation, CreateAccountBookListMutationVariables>(CreateAccountBookListDocument, variables)(),
    ...options
  }
    )};


useCreateAccountBookListMutation.fetcher = (variables: CreateAccountBookListMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateAccountBookListMutation, CreateAccountBookListMutationVariables>(CreateAccountBookListDocument, variables, options);

export const UpdateAccountBookDocument = new TypedDocumentString(`
    mutation UpdateAccountBook($input: UpdateAccountBookInput!) {
  updateAccountBook(input: $input) {
    ...AccountBookParts
  }
}
    fragment AccountBookParts on AccountBook {
  id
  title
  amount
  memo
  type
  registerDateTime
  isDisabledBudget
  isRegularExpenditure
  installmentMonth
  paidInstallmentMonth
  regularDate
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useUpdateAccountBookMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateAccountBookMutation, TError, UpdateAccountBookMutationVariables, TContext>) => {
    
    return useMutation<UpdateAccountBookMutation, TError, UpdateAccountBookMutationVariables, TContext>(
      {
    mutationKey: ['UpdateAccountBook'],
    mutationFn: (variables?: UpdateAccountBookMutationVariables) => gqlFetch<UpdateAccountBookMutation, UpdateAccountBookMutationVariables>(UpdateAccountBookDocument, variables)(),
    ...options
  }
    )};


useUpdateAccountBookMutation.fetcher = (variables: UpdateAccountBookMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateAccountBookMutation, UpdateAccountBookMutationVariables>(UpdateAccountBookDocument, variables, options);

export const DeleteAccountBookDocument = new TypedDocumentString(`
    mutation DeleteAccountBook($input: DeleteAccountBookInput!) {
  deleteAccountBook(input: $input)
}
    `);

export const useDeleteAccountBookMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteAccountBookMutation, TError, DeleteAccountBookMutationVariables, TContext>) => {
    
    return useMutation<DeleteAccountBookMutation, TError, DeleteAccountBookMutationVariables, TContext>(
      {
    mutationKey: ['DeleteAccountBook'],
    mutationFn: (variables?: DeleteAccountBookMutationVariables) => gqlFetch<DeleteAccountBookMutation, DeleteAccountBookMutationVariables>(DeleteAccountBookDocument, variables)(),
    ...options
  }
    )};


useDeleteAccountBookMutation.fetcher = (variables: DeleteAccountBookMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteAccountBookMutation, DeleteAccountBookMutationVariables>(DeleteAccountBookDocument, variables, options);

export const AccountBookCategoryListDocument = new TypedDocumentString(`
    query AccountBookCategoryList {
  accountBookCategoryList {
    totalCount
    itemList {
      ...AccountBookCategoryParts
    }
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useAccountBookCategoryListQuery = <
      TData = AccountBookCategoryListQuery,
      TError = unknown
    >(
      variables?: AccountBookCategoryListQueryVariables,
      options?: Omit<UseQueryOptions<AccountBookCategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AccountBookCategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AccountBookCategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['AccountBookCategoryList'] : ['AccountBookCategoryList', variables],
    queryFn: gqlFetch<AccountBookCategoryListQuery, AccountBookCategoryListQueryVariables>(AccountBookCategoryListDocument, variables),
    ...options
  }
    )};

useAccountBookCategoryListQuery.getKey = (variables?: AccountBookCategoryListQueryVariables) => variables === undefined ? ['AccountBookCategoryList'] : ['AccountBookCategoryList', variables];

export const useSuspenseAccountBookCategoryListQuery = <
      TData = AccountBookCategoryListQuery,
      TError = unknown
    >(
      variables?: AccountBookCategoryListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AccountBookCategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AccountBookCategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AccountBookCategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['AccountBookCategoryList'] : ['AccountBookCategoryList', variables],
    queryFn: gqlFetch<AccountBookCategoryListQuery, AccountBookCategoryListQueryVariables>(AccountBookCategoryListDocument, variables),
    ...options
  }
    )};

useSuspenseAccountBookCategoryListQuery.getKey = (variables?: AccountBookCategoryListQueryVariables) => variables === undefined ? ['AccountBookCategoryList'] : ['AccountBookCategoryList', variables];


useAccountBookCategoryListQuery.fetcher = (variables?: AccountBookCategoryListQueryVariables, options?: RequestInit['headers']) => gqlFetch<AccountBookCategoryListQuery, AccountBookCategoryListQueryVariables>(AccountBookCategoryListDocument, variables, options);

export const AccountBookCategoryImageListDocument = new TypedDocumentString(`
    query AccountBookCategoryImageList {
  accountBookCategoryImageList {
    totalCount
    itemList {
      ...AccountBookCategoryImageParts
    }
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}`);

export const useAccountBookCategoryImageListQuery = <
      TData = AccountBookCategoryImageListQuery,
      TError = unknown
    >(
      variables?: AccountBookCategoryImageListQueryVariables,
      options?: Omit<UseQueryOptions<AccountBookCategoryImageListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AccountBookCategoryImageListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AccountBookCategoryImageListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['AccountBookCategoryImageList'] : ['AccountBookCategoryImageList', variables],
    queryFn: gqlFetch<AccountBookCategoryImageListQuery, AccountBookCategoryImageListQueryVariables>(AccountBookCategoryImageListDocument, variables),
    ...options
  }
    )};

useAccountBookCategoryImageListQuery.getKey = (variables?: AccountBookCategoryImageListQueryVariables) => variables === undefined ? ['AccountBookCategoryImageList'] : ['AccountBookCategoryImageList', variables];

export const useSuspenseAccountBookCategoryImageListQuery = <
      TData = AccountBookCategoryImageListQuery,
      TError = unknown
    >(
      variables?: AccountBookCategoryImageListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AccountBookCategoryImageListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AccountBookCategoryImageListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AccountBookCategoryImageListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['AccountBookCategoryImageList'] : ['AccountBookCategoryImageList', variables],
    queryFn: gqlFetch<AccountBookCategoryImageListQuery, AccountBookCategoryImageListQueryVariables>(AccountBookCategoryImageListDocument, variables),
    ...options
  }
    )};

useSuspenseAccountBookCategoryImageListQuery.getKey = (variables?: AccountBookCategoryImageListQueryVariables) => variables === undefined ? ['AccountBookCategoryImageList'] : ['AccountBookCategoryImageList', variables];


useAccountBookCategoryImageListQuery.fetcher = (variables?: AccountBookCategoryImageListQueryVariables, options?: RequestInit['headers']) => gqlFetch<AccountBookCategoryImageListQuery, AccountBookCategoryImageListQueryVariables>(AccountBookCategoryImageListDocument, variables, options);

export const CreateAccountBookCategoryDocument = new TypedDocumentString(`
    mutation CreateAccountBookCategory($input: CreateAccountBookCategoryInput!) {
  createAccountBookCategory(input: $input) {
    ...AccountBookCategoryParts
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}`);

export const useCreateAccountBookCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateAccountBookCategoryMutation, TError, CreateAccountBookCategoryMutationVariables, TContext>) => {
    
    return useMutation<CreateAccountBookCategoryMutation, TError, CreateAccountBookCategoryMutationVariables, TContext>(
      {
    mutationKey: ['CreateAccountBookCategory'],
    mutationFn: (variables?: CreateAccountBookCategoryMutationVariables) => gqlFetch<CreateAccountBookCategoryMutation, CreateAccountBookCategoryMutationVariables>(CreateAccountBookCategoryDocument, variables)(),
    ...options
  }
    )};


useCreateAccountBookCategoryMutation.fetcher = (variables: CreateAccountBookCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateAccountBookCategoryMutation, CreateAccountBookCategoryMutationVariables>(CreateAccountBookCategoryDocument, variables, options);

export const BucketListSummaryListDocument = new TypedDocumentString(`
    query BucketListSummaryList($limitCount: Int) {
  bucketListSummaryList(limitCount: $limitCount) {
    totalCount
    itemList {
      ...BucketListSummaryParts
    }
  }
}
    fragment BucketListSummaryParts on BucketListSummary {
  id
  title
  completeDate
  isComplete
  todoCount
  completeTodoCount
  thumbImageUrl
  updatedAt
}`);

export const useBucketListSummaryListQuery = <
      TData = BucketListSummaryListQuery,
      TError = unknown
    >(
      variables?: BucketListSummaryListQueryVariables,
      options?: Omit<UseQueryOptions<BucketListSummaryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<BucketListSummaryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<BucketListSummaryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['BucketListSummaryList'] : ['BucketListSummaryList', variables],
    queryFn: gqlFetch<BucketListSummaryListQuery, BucketListSummaryListQueryVariables>(BucketListSummaryListDocument, variables),
    ...options
  }
    )};

useBucketListSummaryListQuery.getKey = (variables?: BucketListSummaryListQueryVariables) => variables === undefined ? ['BucketListSummaryList'] : ['BucketListSummaryList', variables];

export const useSuspenseBucketListSummaryListQuery = <
      TData = BucketListSummaryListQuery,
      TError = unknown
    >(
      variables?: BucketListSummaryListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<BucketListSummaryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<BucketListSummaryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<BucketListSummaryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['BucketListSummaryList'] : ['BucketListSummaryList', variables],
    queryFn: gqlFetch<BucketListSummaryListQuery, BucketListSummaryListQueryVariables>(BucketListSummaryListDocument, variables),
    ...options
  }
    )};

useSuspenseBucketListSummaryListQuery.getKey = (variables?: BucketListSummaryListQueryVariables) => variables === undefined ? ['BucketListSummaryList'] : ['BucketListSummaryList', variables];


useBucketListSummaryListQuery.fetcher = (variables?: BucketListSummaryListQueryVariables, options?: RequestInit['headers']) => gqlFetch<BucketListSummaryListQuery, BucketListSummaryListQueryVariables>(BucketListSummaryListDocument, variables, options);

export const BucketListDocument = new TypedDocumentString(`
    query BucketList($id: ID!) {
  bucketList(id: $id) {
    ...BucketListParts
  }
}
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}
fragment BucketListParts on BucketList {
  id
  title
  description
  completeDate
  isComplete
  imageUrl
  thumbImageUrl
  createdAt
  updatedAt
  todoList {
    ...BucketListTodoParts
  }
}`);

export const useBucketListQuery = <
      TData = BucketListQuery,
      TError = unknown
    >(
      variables: BucketListQueryVariables,
      options?: Omit<UseQueryOptions<BucketListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<BucketListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<BucketListQuery, TError, TData>(
      {
    queryKey: ['BucketList', variables],
    queryFn: gqlFetch<BucketListQuery, BucketListQueryVariables>(BucketListDocument, variables),
    ...options
  }
    )};

useBucketListQuery.getKey = (variables: BucketListQueryVariables) => ['BucketList', variables];

export const useSuspenseBucketListQuery = <
      TData = BucketListQuery,
      TError = unknown
    >(
      variables: BucketListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<BucketListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<BucketListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<BucketListQuery, TError, TData>(
      {
    queryKey: ['BucketList', variables],
    queryFn: gqlFetch<BucketListQuery, BucketListQueryVariables>(BucketListDocument, variables),
    ...options
  }
    )};

useSuspenseBucketListQuery.getKey = (variables: BucketListQueryVariables) => ['BucketList', variables];


useBucketListQuery.fetcher = (variables: BucketListQueryVariables, options?: RequestInit['headers']) => gqlFetch<BucketListQuery, BucketListQueryVariables>(BucketListDocument, variables, options);

export const CreateBucketListDocument = new TypedDocumentString(`
    mutation CreateBucketList($input: CreateBucketListInput!) {
  createBucketList(input: $input) {
    ...BucketListParts
  }
}
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}
fragment BucketListParts on BucketList {
  id
  title
  description
  completeDate
  isComplete
  imageUrl
  thumbImageUrl
  createdAt
  updatedAt
  todoList {
    ...BucketListTodoParts
  }
}`);

export const useCreateBucketListMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateBucketListMutation, TError, CreateBucketListMutationVariables, TContext>) => {
    
    return useMutation<CreateBucketListMutation, TError, CreateBucketListMutationVariables, TContext>(
      {
    mutationKey: ['CreateBucketList'],
    mutationFn: (variables?: CreateBucketListMutationVariables) => gqlFetch<CreateBucketListMutation, CreateBucketListMutationVariables>(CreateBucketListDocument, variables)(),
    ...options
  }
    )};


useCreateBucketListMutation.fetcher = (variables: CreateBucketListMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateBucketListMutation, CreateBucketListMutationVariables>(CreateBucketListDocument, variables, options);

export const UpdateBucketListDocument = new TypedDocumentString(`
    mutation UpdateBucketList($input: UpdateBucketListInput!) {
  updateBucketList(input: $input) {
    ...BucketListParts
  }
}
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}
fragment BucketListParts on BucketList {
  id
  title
  description
  completeDate
  isComplete
  imageUrl
  thumbImageUrl
  createdAt
  updatedAt
  todoList {
    ...BucketListTodoParts
  }
}`);

export const useUpdateBucketListMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateBucketListMutation, TError, UpdateBucketListMutationVariables, TContext>) => {
    
    return useMutation<UpdateBucketListMutation, TError, UpdateBucketListMutationVariables, TContext>(
      {
    mutationKey: ['UpdateBucketList'],
    mutationFn: (variables?: UpdateBucketListMutationVariables) => gqlFetch<UpdateBucketListMutation, UpdateBucketListMutationVariables>(UpdateBucketListDocument, variables)(),
    ...options
  }
    )};


useUpdateBucketListMutation.fetcher = (variables: UpdateBucketListMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateBucketListMutation, UpdateBucketListMutationVariables>(UpdateBucketListDocument, variables, options);

export const DeleteBucketListDocument = new TypedDocumentString(`
    mutation DeleteBucketList($input: DeleteBucketListInput!) {
  deleteBucketList(input: $input)
}
    `);

export const useDeleteBucketListMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteBucketListMutation, TError, DeleteBucketListMutationVariables, TContext>) => {
    
    return useMutation<DeleteBucketListMutation, TError, DeleteBucketListMutationVariables, TContext>(
      {
    mutationKey: ['DeleteBucketList'],
    mutationFn: (variables?: DeleteBucketListMutationVariables) => gqlFetch<DeleteBucketListMutation, DeleteBucketListMutationVariables>(DeleteBucketListDocument, variables)(),
    ...options
  }
    )};


useDeleteBucketListMutation.fetcher = (variables: DeleteBucketListMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteBucketListMutation, DeleteBucketListMutationVariables>(DeleteBucketListDocument, variables, options);

export const CompleteBucketListDocument = new TypedDocumentString(`
    mutation CompleteBucketList($input: CompleteBucketListInput!) {
  completeBucketList(input: $input)
}
    `);

export const useCompleteBucketListMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CompleteBucketListMutation, TError, CompleteBucketListMutationVariables, TContext>) => {
    
    return useMutation<CompleteBucketListMutation, TError, CompleteBucketListMutationVariables, TContext>(
      {
    mutationKey: ['CompleteBucketList'],
    mutationFn: (variables?: CompleteBucketListMutationVariables) => gqlFetch<CompleteBucketListMutation, CompleteBucketListMutationVariables>(CompleteBucketListDocument, variables)(),
    ...options
  }
    )};


useCompleteBucketListMutation.fetcher = (variables: CompleteBucketListMutationVariables, options?: RequestInit['headers']) => gqlFetch<CompleteBucketListMutation, CompleteBucketListMutationVariables>(CompleteBucketListDocument, variables, options);

export const CreateBucketListTodoDocument = new TypedDocumentString(`
    mutation CreateBucketListTodo($input: CreateBucketListTodoInput!) {
  createBucketListTodo(input: $input) {
    ...BucketListTodoParts
  }
}
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}`);

export const useCreateBucketListTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateBucketListTodoMutation, TError, CreateBucketListTodoMutationVariables, TContext>) => {
    
    return useMutation<CreateBucketListTodoMutation, TError, CreateBucketListTodoMutationVariables, TContext>(
      {
    mutationKey: ['CreateBucketListTodo'],
    mutationFn: (variables?: CreateBucketListTodoMutationVariables) => gqlFetch<CreateBucketListTodoMutation, CreateBucketListTodoMutationVariables>(CreateBucketListTodoDocument, variables)(),
    ...options
  }
    )};


useCreateBucketListTodoMutation.fetcher = (variables: CreateBucketListTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateBucketListTodoMutation, CreateBucketListTodoMutationVariables>(CreateBucketListTodoDocument, variables, options);

export const DeleteBucketListTodoDocument = new TypedDocumentString(`
    mutation DeleteBucketListTodo($input: DeleteBucketListTodoInput!) {
  deleteBucketListTodo(input: $input)
}
    `);

export const useDeleteBucketListTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteBucketListTodoMutation, TError, DeleteBucketListTodoMutationVariables, TContext>) => {
    
    return useMutation<DeleteBucketListTodoMutation, TError, DeleteBucketListTodoMutationVariables, TContext>(
      {
    mutationKey: ['DeleteBucketListTodo'],
    mutationFn: (variables?: DeleteBucketListTodoMutationVariables) => gqlFetch<DeleteBucketListTodoMutation, DeleteBucketListTodoMutationVariables>(DeleteBucketListTodoDocument, variables)(),
    ...options
  }
    )};


useDeleteBucketListTodoMutation.fetcher = (variables: DeleteBucketListTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteBucketListTodoMutation, DeleteBucketListTodoMutationVariables>(DeleteBucketListTodoDocument, variables, options);

export const UpdateBucketListTodoCompleteDocument = new TypedDocumentString(`
    mutation UpdateBucketListTodoComplete($input: UpdateBucketListTodoCompleteInput!) {
  updateBucketListTodoComplete(input: $input) {
    ...BucketListTodoParts
  }
}
    fragment BucketListTodoParts on BucketListTodo {
  id
  title
  isComplete
  bucketListId
}`);

export const useUpdateBucketListTodoCompleteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateBucketListTodoCompleteMutation, TError, UpdateBucketListTodoCompleteMutationVariables, TContext>) => {
    
    return useMutation<UpdateBucketListTodoCompleteMutation, TError, UpdateBucketListTodoCompleteMutationVariables, TContext>(
      {
    mutationKey: ['UpdateBucketListTodoComplete'],
    mutationFn: (variables?: UpdateBucketListTodoCompleteMutationVariables) => gqlFetch<UpdateBucketListTodoCompleteMutation, UpdateBucketListTodoCompleteMutationVariables>(UpdateBucketListTodoCompleteDocument, variables)(),
    ...options
  }
    )};


useUpdateBucketListTodoCompleteMutation.fetcher = (variables: UpdateBucketListTodoCompleteMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateBucketListTodoCompleteMutation, UpdateBucketListTodoCompleteMutationVariables>(UpdateBucketListTodoCompleteDocument, variables, options);

export const RegularExpenditureGroupListDocument = new TypedDocumentString(`
    query RegularExpenditureGroupList($limitCount: Int) {
  regularExpenditureGroupList(limitCount: $limitCount) {
    totalCount
    itemList {
      ...RegularExpenditureGroupParts
    }
  }
}
    fragment AccountBookCategoryImageParts on AccountBookCategoryImage {
  id
  name
  imageUrl
}
fragment AccountBookCategoryParts on AccountBookCategory {
  id
  name
  type
  useStatistic
  accountBookCategoryImageId
  accountBookCategoryImage {
    ...AccountBookCategoryImageParts
  }
}
fragment RegularExpenditureItemParts on CustomRegularExpenditure {
  id
  title
  amount
  regularDate
  regularExpenditureDay
  isAutoExpenditure
  accountBookCategoryId
  accountBookCategory {
    ...AccountBookCategoryParts
  }
}
fragment RegularExpenditureGroupParts on RegularExpenditureGroup {
  name
  type
  imageUrl
  list {
    ...RegularExpenditureItemParts
  }
}`);

export const useRegularExpenditureGroupListQuery = <
      TData = RegularExpenditureGroupListQuery,
      TError = unknown
    >(
      variables?: RegularExpenditureGroupListQueryVariables,
      options?: Omit<UseQueryOptions<RegularExpenditureGroupListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<RegularExpenditureGroupListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<RegularExpenditureGroupListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['RegularExpenditureGroupList'] : ['RegularExpenditureGroupList', variables],
    queryFn: gqlFetch<RegularExpenditureGroupListQuery, RegularExpenditureGroupListQueryVariables>(RegularExpenditureGroupListDocument, variables),
    ...options
  }
    )};

useRegularExpenditureGroupListQuery.getKey = (variables?: RegularExpenditureGroupListQueryVariables) => variables === undefined ? ['RegularExpenditureGroupList'] : ['RegularExpenditureGroupList', variables];

export const useSuspenseRegularExpenditureGroupListQuery = <
      TData = RegularExpenditureGroupListQuery,
      TError = unknown
    >(
      variables?: RegularExpenditureGroupListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<RegularExpenditureGroupListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<RegularExpenditureGroupListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<RegularExpenditureGroupListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['RegularExpenditureGroupList'] : ['RegularExpenditureGroupList', variables],
    queryFn: gqlFetch<RegularExpenditureGroupListQuery, RegularExpenditureGroupListQueryVariables>(RegularExpenditureGroupListDocument, variables),
    ...options
  }
    )};

useSuspenseRegularExpenditureGroupListQuery.getKey = (variables?: RegularExpenditureGroupListQueryVariables) => variables === undefined ? ['RegularExpenditureGroupList'] : ['RegularExpenditureGroupList', variables];


useRegularExpenditureGroupListQuery.fetcher = (variables?: RegularExpenditureGroupListQueryVariables, options?: RequestInit['headers']) => gqlFetch<RegularExpenditureGroupListQuery, RegularExpenditureGroupListQueryVariables>(RegularExpenditureGroupListDocument, variables, options);

export const CreateRegularExpenditureDocument = new TypedDocumentString(`
    mutation CreateRegularExpenditure($input: CreateRegularExpenditureInput!) {
  createRegularExpenditure(input: $input) {
    id
    title
    amount
    regularDate
    isAutoExpenditure
  }
}
    `);

export const useCreateRegularExpenditureMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateRegularExpenditureMutation, TError, CreateRegularExpenditureMutationVariables, TContext>) => {
    
    return useMutation<CreateRegularExpenditureMutation, TError, CreateRegularExpenditureMutationVariables, TContext>(
      {
    mutationKey: ['CreateRegularExpenditure'],
    mutationFn: (variables?: CreateRegularExpenditureMutationVariables) => gqlFetch<CreateRegularExpenditureMutation, CreateRegularExpenditureMutationVariables>(CreateRegularExpenditureDocument, variables)(),
    ...options
  }
    )};


useCreateRegularExpenditureMutation.fetcher = (variables: CreateRegularExpenditureMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateRegularExpenditureMutation, CreateRegularExpenditureMutationVariables>(CreateRegularExpenditureDocument, variables, options);

export const DeleteRegularExpenditureDocument = new TypedDocumentString(`
    mutation DeleteRegularExpenditure($input: DeleteRegularExpenditureInput!) {
  deleteRegularExpenditure(input: $input)
}
    `);

export const useDeleteRegularExpenditureMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteRegularExpenditureMutation, TError, DeleteRegularExpenditureMutationVariables, TContext>) => {
    
    return useMutation<DeleteRegularExpenditureMutation, TError, DeleteRegularExpenditureMutationVariables, TContext>(
      {
    mutationKey: ['DeleteRegularExpenditure'],
    mutationFn: (variables?: DeleteRegularExpenditureMutationVariables) => gqlFetch<DeleteRegularExpenditureMutation, DeleteRegularExpenditureMutationVariables>(DeleteRegularExpenditureDocument, variables)(),
    ...options
  }
    )};


useDeleteRegularExpenditureMutation.fetcher = (variables: DeleteRegularExpenditureMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteRegularExpenditureMutation, DeleteRegularExpenditureMutationVariables>(DeleteRegularExpenditureDocument, variables, options);

export const GetAccountBookStatisticListDocument = new TypedDocumentString(`
    query GetAccountBookStatisticList($startDate: DateTime!, $endDate: DateTime!, $type: AccountBookCategoryType!) {
  getAccountBookStatisticList(
    startDate: $startDate
    endDate: $endDate
    type: $type
  ) {
    totalCount
    itemList {
      ...StatisticParts
    }
  }
}
    fragment StatisticItemParts on StatisticItem {
  title
  amount
  registerDateTime
}
fragment StatisticParts on Statistic {
  categoryId
  categoryName
  amount
  percentage
  useStatistic
  list {
    ...StatisticItemParts
  }
}`);

export const useGetAccountBookStatisticListQuery = <
      TData = GetAccountBookStatisticListQuery,
      TError = unknown
    >(
      variables: GetAccountBookStatisticListQueryVariables,
      options?: Omit<UseQueryOptions<GetAccountBookStatisticListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetAccountBookStatisticListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetAccountBookStatisticListQuery, TError, TData>(
      {
    queryKey: ['GetAccountBookStatisticList', variables],
    queryFn: gqlFetch<GetAccountBookStatisticListQuery, GetAccountBookStatisticListQueryVariables>(GetAccountBookStatisticListDocument, variables),
    ...options
  }
    )};

useGetAccountBookStatisticListQuery.getKey = (variables: GetAccountBookStatisticListQueryVariables) => ['GetAccountBookStatisticList', variables];

export const useSuspenseGetAccountBookStatisticListQuery = <
      TData = GetAccountBookStatisticListQuery,
      TError = unknown
    >(
      variables: GetAccountBookStatisticListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<GetAccountBookStatisticListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<GetAccountBookStatisticListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<GetAccountBookStatisticListQuery, TError, TData>(
      {
    queryKey: ['GetAccountBookStatisticList', variables],
    queryFn: gqlFetch<GetAccountBookStatisticListQuery, GetAccountBookStatisticListQueryVariables>(GetAccountBookStatisticListDocument, variables),
    ...options
  }
    )};

useSuspenseGetAccountBookStatisticListQuery.getKey = (variables: GetAccountBookStatisticListQueryVariables) => ['GetAccountBookStatisticList', variables];


useGetAccountBookStatisticListQuery.fetcher = (variables: GetAccountBookStatisticListQueryVariables, options?: RequestInit['headers']) => gqlFetch<GetAccountBookStatisticListQuery, GetAccountBookStatisticListQueryVariables>(GetAccountBookStatisticListDocument, variables, options);

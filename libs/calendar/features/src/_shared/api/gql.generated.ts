/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type CalendarEventRangeInput = {
  /** 조회 끝 (exclusive) */
  endAt: string;
  /** 조회 시작 (inclusive) */
  startAt: string;
};

export type CalendarShareStatus =
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PENDING';

/**
 * 공유 해제/취소. 대기 중 초대는 보낸 사람이 취소하고,
 * 수락된 공유는 양쪽 누구나 해제할 수 있다.
 */
export type CancelCalendarShareInput = {
  id: number;
};

export type CreateCalendarEventInput = {
  color?: string | null | undefined;
  description?: string | null | undefined;
  endAt: string;
  isAllDay?: boolean | null | undefined;
  startAt: string;
  title: string;
};

export type DeleteCalendarEventInput = {
  id: string;
};

export type RequestCalendarShareInput = {
  /** 초대할 상대의 가입 이메일 */
  email: string;
};

export type RequestCalendarShareResultCode =
  /** 상대가 이미 나를 초대해 둬서 즉시 수락 처리했다 */
  | 'ACCEPTED_MUTUAL'
  /** 내가 보낸 초대가 이미 대기 중이다 */
  | 'ALREADY_PENDING'
  /** 이미 공유 중이다 */
  | 'ALREADY_SHARED'
  /** 초대를 새로 보냈다 */
  | 'REQUESTED'
  /** 자기 자신은 초대할 수 없다 */
  | 'SELF'
  /** 가입되지 않은 이메일이다 */
  | 'USER_NOT_FOUND';

export type RespondCalendarShareInput = {
  id: number;
  isAccepted: boolean;
};

export type UpdateCalendarEventInput = {
  color?: string | null | undefined;
  description?: string | null | undefined;
  endAt?: string | null | undefined;
  id: string;
  isAllDay?: boolean | null | undefined;
  startAt?: string | null | undefined;
  title?: string | null | undefined;
};

export type CalendarUserPartsFragment = { id: number, name: string, email: string, profileImg: string };

export type CalendarEventPartsFragment = { id: string, title: string, description: string | null, startAt: string, endAt: string, isAllDay: boolean, color: string | null, isMine: boolean, createdAt: string, updatedAt: string, owner: { id: number, name: string, email: string, profileImg: string } };

export type CalendarSharePartsFragment = { id: number, status: CalendarShareStatus, isOutgoing: boolean, createdAt: string, respondedAt: string | null, counterpart: { id: number, name: string, email: string, profileImg: string } };

export type CalendarEventListQueryVariables = Exact<{
  input: CalendarEventRangeInput;
}>;


export type CalendarEventListQuery = { calendarEventList: { totalCount: number, itemList: Array<{ id: string, title: string, description: string | null, startAt: string, endAt: string, isAllDay: boolean, color: string | null, isMine: boolean, createdAt: string, updatedAt: string, owner: { id: number, name: string, email: string, profileImg: string } }> } };

export type CalendarShareListQueryVariables = Exact<{ [key: string]: never; }>;


export type CalendarShareListQuery = { calendarShareList: { totalCount: number, itemList: Array<{ id: number, status: CalendarShareStatus, isOutgoing: boolean, createdAt: string, respondedAt: string | null, counterpart: { id: number, name: string, email: string, profileImg: string } }> } };

export type PendingCalendarShareListQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingCalendarShareListQuery = { pendingCalendarShareList: { totalCount: number, itemList: Array<{ id: number, status: CalendarShareStatus, isOutgoing: boolean, createdAt: string, respondedAt: string | null, counterpart: { id: number, name: string, email: string, profileImg: string } }> } };

export type CreateCalendarEventMutationVariables = Exact<{
  input: CreateCalendarEventInput;
}>;


export type CreateCalendarEventMutation = { createCalendarEvent: { id: string, title: string, description: string | null, startAt: string, endAt: string, isAllDay: boolean, color: string | null, isMine: boolean, createdAt: string, updatedAt: string, owner: { id: number, name: string, email: string, profileImg: string } } };

export type UpdateCalendarEventMutationVariables = Exact<{
  input: UpdateCalendarEventInput;
}>;


export type UpdateCalendarEventMutation = { updateCalendarEvent: { id: string, title: string, description: string | null, startAt: string, endAt: string, isAllDay: boolean, color: string | null, isMine: boolean, createdAt: string, updatedAt: string, owner: { id: number, name: string, email: string, profileImg: string } } };

export type DeleteCalendarEventMutationVariables = Exact<{
  input: DeleteCalendarEventInput;
}>;


export type DeleteCalendarEventMutation = { deleteCalendarEvent: boolean };

export type RequestCalendarShareMutationVariables = Exact<{
  input: RequestCalendarShareInput;
}>;


export type RequestCalendarShareMutation = { requestCalendarShare: { code: RequestCalendarShareResultCode, share: { id: number, status: CalendarShareStatus, isOutgoing: boolean, createdAt: string, respondedAt: string | null, counterpart: { id: number, name: string, email: string, profileImg: string } } | null } };

export type RespondCalendarShareMutationVariables = Exact<{
  input: RespondCalendarShareInput;
}>;


export type RespondCalendarShareMutation = { respondCalendarShare: { id: number, status: CalendarShareStatus, isOutgoing: boolean, createdAt: string, respondedAt: string | null, counterpart: { id: number, name: string, email: string, profileImg: string } } };

export type CancelCalendarShareMutationVariables = Exact<{
  input: CancelCalendarShareInput;
}>;


export type CancelCalendarShareMutation = { cancelCalendarShare: boolean };


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
export const CalendarUserPartsFragmentDoc = new TypedDocumentString(`
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
    `, {"fragmentName":"CalendarUserParts"});
export const CalendarEventPartsFragmentDoc = new TypedDocumentString(`
    fragment CalendarEventParts on CalendarEvent {
  id
  title
  description
  startAt
  endAt
  isAllDay
  color
  isMine
  owner {
    ...CalendarUserParts
  }
  createdAt
  updatedAt
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}`, {"fragmentName":"CalendarEventParts"});
export const CalendarSharePartsFragmentDoc = new TypedDocumentString(`
    fragment CalendarShareParts on CalendarShare {
  id
  status
  isOutgoing
  counterpart {
    ...CalendarUserParts
  }
  createdAt
  respondedAt
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}`, {"fragmentName":"CalendarShareParts"});
export const CalendarEventListDocument = new TypedDocumentString(`
    query CalendarEventList($input: CalendarEventRangeInput!) {
  calendarEventList(input: $input) {
    totalCount
    itemList {
      ...CalendarEventParts
    }
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarEventParts on CalendarEvent {
  id
  title
  description
  startAt
  endAt
  isAllDay
  color
  isMine
  owner {
    ...CalendarUserParts
  }
  createdAt
  updatedAt
}`);

export const useCalendarEventListQuery = <
      TData = CalendarEventListQuery,
      TError = unknown
    >(
      variables: CalendarEventListQueryVariables,
      options?: Omit<UseQueryOptions<CalendarEventListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CalendarEventListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<CalendarEventListQuery, TError, TData>(
      {
    queryKey: ['CalendarEventList', variables],
    queryFn: gqlFetch<CalendarEventListQuery, CalendarEventListQueryVariables>(CalendarEventListDocument, variables),
    ...options
  }
    )};

useCalendarEventListQuery.getKey = (variables: CalendarEventListQueryVariables) => ['CalendarEventList', variables];

export const useSuspenseCalendarEventListQuery = <
      TData = CalendarEventListQuery,
      TError = unknown
    >(
      variables: CalendarEventListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<CalendarEventListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<CalendarEventListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<CalendarEventListQuery, TError, TData>(
      {
    queryKey: ['CalendarEventList', variables],
    queryFn: gqlFetch<CalendarEventListQuery, CalendarEventListQueryVariables>(CalendarEventListDocument, variables),
    ...options
  }
    )};

useSuspenseCalendarEventListQuery.getKey = (variables: CalendarEventListQueryVariables) => ['CalendarEventList', variables];


useCalendarEventListQuery.fetcher = (variables: CalendarEventListQueryVariables, options?: RequestInit['headers']) => gqlFetch<CalendarEventListQuery, CalendarEventListQueryVariables>(CalendarEventListDocument, variables, options);

export const CalendarShareListDocument = new TypedDocumentString(`
    query CalendarShareList {
  calendarShareList {
    totalCount
    itemList {
      ...CalendarShareParts
    }
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarShareParts on CalendarShare {
  id
  status
  isOutgoing
  counterpart {
    ...CalendarUserParts
  }
  createdAt
  respondedAt
}`);

export const useCalendarShareListQuery = <
      TData = CalendarShareListQuery,
      TError = unknown
    >(
      variables?: CalendarShareListQueryVariables,
      options?: Omit<UseQueryOptions<CalendarShareListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CalendarShareListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<CalendarShareListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['CalendarShareList'] : ['CalendarShareList', variables],
    queryFn: gqlFetch<CalendarShareListQuery, CalendarShareListQueryVariables>(CalendarShareListDocument, variables),
    ...options
  }
    )};

useCalendarShareListQuery.getKey = (variables?: CalendarShareListQueryVariables) => variables === undefined ? ['CalendarShareList'] : ['CalendarShareList', variables];

export const useSuspenseCalendarShareListQuery = <
      TData = CalendarShareListQuery,
      TError = unknown
    >(
      variables?: CalendarShareListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<CalendarShareListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<CalendarShareListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<CalendarShareListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['CalendarShareList'] : ['CalendarShareList', variables],
    queryFn: gqlFetch<CalendarShareListQuery, CalendarShareListQueryVariables>(CalendarShareListDocument, variables),
    ...options
  }
    )};

useSuspenseCalendarShareListQuery.getKey = (variables?: CalendarShareListQueryVariables) => variables === undefined ? ['CalendarShareList'] : ['CalendarShareList', variables];


useCalendarShareListQuery.fetcher = (variables?: CalendarShareListQueryVariables, options?: RequestInit['headers']) => gqlFetch<CalendarShareListQuery, CalendarShareListQueryVariables>(CalendarShareListDocument, variables, options);

export const PendingCalendarShareListDocument = new TypedDocumentString(`
    query PendingCalendarShareList {
  pendingCalendarShareList {
    totalCount
    itemList {
      ...CalendarShareParts
    }
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarShareParts on CalendarShare {
  id
  status
  isOutgoing
  counterpart {
    ...CalendarUserParts
  }
  createdAt
  respondedAt
}`);

export const usePendingCalendarShareListQuery = <
      TData = PendingCalendarShareListQuery,
      TError = unknown
    >(
      variables?: PendingCalendarShareListQueryVariables,
      options?: Omit<UseQueryOptions<PendingCalendarShareListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<PendingCalendarShareListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<PendingCalendarShareListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['PendingCalendarShareList'] : ['PendingCalendarShareList', variables],
    queryFn: gqlFetch<PendingCalendarShareListQuery, PendingCalendarShareListQueryVariables>(PendingCalendarShareListDocument, variables),
    ...options
  }
    )};

usePendingCalendarShareListQuery.getKey = (variables?: PendingCalendarShareListQueryVariables) => variables === undefined ? ['PendingCalendarShareList'] : ['PendingCalendarShareList', variables];

export const useSuspensePendingCalendarShareListQuery = <
      TData = PendingCalendarShareListQuery,
      TError = unknown
    >(
      variables?: PendingCalendarShareListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<PendingCalendarShareListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<PendingCalendarShareListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<PendingCalendarShareListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['PendingCalendarShareList'] : ['PendingCalendarShareList', variables],
    queryFn: gqlFetch<PendingCalendarShareListQuery, PendingCalendarShareListQueryVariables>(PendingCalendarShareListDocument, variables),
    ...options
  }
    )};

useSuspensePendingCalendarShareListQuery.getKey = (variables?: PendingCalendarShareListQueryVariables) => variables === undefined ? ['PendingCalendarShareList'] : ['PendingCalendarShareList', variables];


usePendingCalendarShareListQuery.fetcher = (variables?: PendingCalendarShareListQueryVariables, options?: RequestInit['headers']) => gqlFetch<PendingCalendarShareListQuery, PendingCalendarShareListQueryVariables>(PendingCalendarShareListDocument, variables, options);

export const CreateCalendarEventDocument = new TypedDocumentString(`
    mutation CreateCalendarEvent($input: CreateCalendarEventInput!) {
  createCalendarEvent(input: $input) {
    ...CalendarEventParts
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarEventParts on CalendarEvent {
  id
  title
  description
  startAt
  endAt
  isAllDay
  color
  isMine
  owner {
    ...CalendarUserParts
  }
  createdAt
  updatedAt
}`);

export const useCreateCalendarEventMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCalendarEventMutation, TError, CreateCalendarEventMutationVariables, TContext>) => {
    
    return useMutation<CreateCalendarEventMutation, TError, CreateCalendarEventMutationVariables, TContext>(
      {
    mutationKey: ['CreateCalendarEvent'],
    mutationFn: (variables?: CreateCalendarEventMutationVariables) => gqlFetch<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>(CreateCalendarEventDocument, variables)(),
    ...options
  }
    )};


useCreateCalendarEventMutation.fetcher = (variables: CreateCalendarEventMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>(CreateCalendarEventDocument, variables, options);

export const UpdateCalendarEventDocument = new TypedDocumentString(`
    mutation UpdateCalendarEvent($input: UpdateCalendarEventInput!) {
  updateCalendarEvent(input: $input) {
    ...CalendarEventParts
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarEventParts on CalendarEvent {
  id
  title
  description
  startAt
  endAt
  isAllDay
  color
  isMine
  owner {
    ...CalendarUserParts
  }
  createdAt
  updatedAt
}`);

export const useUpdateCalendarEventMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCalendarEventMutation, TError, UpdateCalendarEventMutationVariables, TContext>) => {
    
    return useMutation<UpdateCalendarEventMutation, TError, UpdateCalendarEventMutationVariables, TContext>(
      {
    mutationKey: ['UpdateCalendarEvent'],
    mutationFn: (variables?: UpdateCalendarEventMutationVariables) => gqlFetch<UpdateCalendarEventMutation, UpdateCalendarEventMutationVariables>(UpdateCalendarEventDocument, variables)(),
    ...options
  }
    )};


useUpdateCalendarEventMutation.fetcher = (variables: UpdateCalendarEventMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateCalendarEventMutation, UpdateCalendarEventMutationVariables>(UpdateCalendarEventDocument, variables, options);

export const DeleteCalendarEventDocument = new TypedDocumentString(`
    mutation DeleteCalendarEvent($input: DeleteCalendarEventInput!) {
  deleteCalendarEvent(input: $input)
}
    `);

export const useDeleteCalendarEventMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCalendarEventMutation, TError, DeleteCalendarEventMutationVariables, TContext>) => {
    
    return useMutation<DeleteCalendarEventMutation, TError, DeleteCalendarEventMutationVariables, TContext>(
      {
    mutationKey: ['DeleteCalendarEvent'],
    mutationFn: (variables?: DeleteCalendarEventMutationVariables) => gqlFetch<DeleteCalendarEventMutation, DeleteCalendarEventMutationVariables>(DeleteCalendarEventDocument, variables)(),
    ...options
  }
    )};


useDeleteCalendarEventMutation.fetcher = (variables: DeleteCalendarEventMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteCalendarEventMutation, DeleteCalendarEventMutationVariables>(DeleteCalendarEventDocument, variables, options);

export const RequestCalendarShareDocument = new TypedDocumentString(`
    mutation RequestCalendarShare($input: RequestCalendarShareInput!) {
  requestCalendarShare(input: $input) {
    code
    share {
      ...CalendarShareParts
    }
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarShareParts on CalendarShare {
  id
  status
  isOutgoing
  counterpart {
    ...CalendarUserParts
  }
  createdAt
  respondedAt
}`);

export const useRequestCalendarShareMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RequestCalendarShareMutation, TError, RequestCalendarShareMutationVariables, TContext>) => {
    
    return useMutation<RequestCalendarShareMutation, TError, RequestCalendarShareMutationVariables, TContext>(
      {
    mutationKey: ['RequestCalendarShare'],
    mutationFn: (variables?: RequestCalendarShareMutationVariables) => gqlFetch<RequestCalendarShareMutation, RequestCalendarShareMutationVariables>(RequestCalendarShareDocument, variables)(),
    ...options
  }
    )};


useRequestCalendarShareMutation.fetcher = (variables: RequestCalendarShareMutationVariables, options?: RequestInit['headers']) => gqlFetch<RequestCalendarShareMutation, RequestCalendarShareMutationVariables>(RequestCalendarShareDocument, variables, options);

export const RespondCalendarShareDocument = new TypedDocumentString(`
    mutation RespondCalendarShare($input: RespondCalendarShareInput!) {
  respondCalendarShare(input: $input) {
    ...CalendarShareParts
  }
}
    fragment CalendarUserParts on CalendarUser {
  id
  name
  email
  profileImg
}
fragment CalendarShareParts on CalendarShare {
  id
  status
  isOutgoing
  counterpart {
    ...CalendarUserParts
  }
  createdAt
  respondedAt
}`);

export const useRespondCalendarShareMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RespondCalendarShareMutation, TError, RespondCalendarShareMutationVariables, TContext>) => {
    
    return useMutation<RespondCalendarShareMutation, TError, RespondCalendarShareMutationVariables, TContext>(
      {
    mutationKey: ['RespondCalendarShare'],
    mutationFn: (variables?: RespondCalendarShareMutationVariables) => gqlFetch<RespondCalendarShareMutation, RespondCalendarShareMutationVariables>(RespondCalendarShareDocument, variables)(),
    ...options
  }
    )};


useRespondCalendarShareMutation.fetcher = (variables: RespondCalendarShareMutationVariables, options?: RequestInit['headers']) => gqlFetch<RespondCalendarShareMutation, RespondCalendarShareMutationVariables>(RespondCalendarShareDocument, variables, options);

export const CancelCalendarShareDocument = new TypedDocumentString(`
    mutation CancelCalendarShare($input: CancelCalendarShareInput!) {
  cancelCalendarShare(input: $input)
}
    `);

export const useCancelCalendarShareMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CancelCalendarShareMutation, TError, CancelCalendarShareMutationVariables, TContext>) => {
    
    return useMutation<CancelCalendarShareMutation, TError, CancelCalendarShareMutationVariables, TContext>(
      {
    mutationKey: ['CancelCalendarShare'],
    mutationFn: (variables?: CancelCalendarShareMutationVariables) => gqlFetch<CancelCalendarShareMutation, CancelCalendarShareMutationVariables>(CancelCalendarShareDocument, variables)(),
    ...options
  }
    )};


useCancelCalendarShareMutation.fetcher = (variables: CancelCalendarShareMutationVariables, options?: RequestInit['headers']) => gqlFetch<CancelCalendarShareMutation, CancelCalendarShareMutationVariables>(CancelCalendarShareDocument, variables, options);

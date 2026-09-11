/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type LoginByShareCodeInput = {
  shareCode: string;
};

export type LoginBySocialInput = {
  email?: string | null | undefined;
  imageUrl?: string | null | undefined;
  loginType: SocialLoginType;
  name?: string | null | undefined;
  /**
   * provider가 발급한 토큰. GOOGLE = id_token, KAKAO_TALK / FACEBOOK = access token.
   * 서버가 provider에 되물어 검증하며, 여기서 확인된 식별자만 socialId로 쓴다.
   */
  token: string;
};

export type SocialLoginType =
  | 'FACEBOOK'
  | 'GOOGLE'
  | 'KAKAO_TALK';

export type UserInfoPartsFragment = { id: number, name: string, email: string, profileImg: string, loginType: string, authType: string | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: number, name: string, email: string, profileImg: string, loginType: string, authType: string | null } };

export type CheckAccessQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckAccessQuery = { checkAccess: number };

export type GetShareCodeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShareCodeQuery = { getShareCode: string };

export type LoginBySocialMutationVariables = Exact<{
  input: LoginBySocialInput;
}>;


export type LoginBySocialMutation = { loginBySocial: { id: number, name: string, email: string, profileImg: string, loginType: string, authType: string | null } };

export type LoginByShareCodeMutationVariables = Exact<{
  input: LoginByShareCodeInput;
}>;


export type LoginByShareCodeMutation = { loginByShareCode: { id: number, name: string, email: string, profileImg: string, loginType: string, authType: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type RefreshSessionMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshSessionMutation = { refreshSession: boolean };

export type UpsertShareCodeMutationVariables = Exact<{ [key: string]: never; }>;


export type UpsertShareCodeMutation = { upsertShareCode: string };


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
export const UserInfoPartsFragmentDoc = new TypedDocumentString(`
    fragment UserInfoParts on UserInfo {
  id
  name
  email
  profileImg
  loginType
  authType
}
    `, {"fragmentName":"UserInfoParts"});
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    ...UserInfoParts
  }
}
    fragment UserInfoParts on UserInfo {
  id
  name
  email
  profileImg
  loginType
  authType
}`);

export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables,
      options?: Omit<UseQueryOptions<MeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Me'] : ['Me', variables],
    queryFn: gqlFetch<MeQuery, MeQueryVariables>(MeDocument, variables),
    ...options
  }
    )};

useMeQuery.getKey = (variables?: MeQueryVariables) => variables === undefined ? ['Me'] : ['Me', variables];

export const useSuspenseMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<MeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<MeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<MeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Me'] : ['Me', variables],
    queryFn: gqlFetch<MeQuery, MeQueryVariables>(MeDocument, variables),
    ...options
  }
    )};

useSuspenseMeQuery.getKey = (variables?: MeQueryVariables) => variables === undefined ? ['Me'] : ['Me', variables];


useMeQuery.fetcher = (variables?: MeQueryVariables, options?: RequestInit['headers']) => gqlFetch<MeQuery, MeQueryVariables>(MeDocument, variables, options);

export const CheckAccessDocument = new TypedDocumentString(`
    query CheckAccess {
  checkAccess
}
    `);

export const useCheckAccessQuery = <
      TData = CheckAccessQuery,
      TError = unknown
    >(
      variables?: CheckAccessQueryVariables,
      options?: Omit<UseQueryOptions<CheckAccessQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CheckAccessQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<CheckAccessQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['CheckAccess'] : ['CheckAccess', variables],
    queryFn: gqlFetch<CheckAccessQuery, CheckAccessQueryVariables>(CheckAccessDocument, variables),
    ...options
  }
    )};

useCheckAccessQuery.getKey = (variables?: CheckAccessQueryVariables) => variables === undefined ? ['CheckAccess'] : ['CheckAccess', variables];

export const useSuspenseCheckAccessQuery = <
      TData = CheckAccessQuery,
      TError = unknown
    >(
      variables?: CheckAccessQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<CheckAccessQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<CheckAccessQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<CheckAccessQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['CheckAccess'] : ['CheckAccess', variables],
    queryFn: gqlFetch<CheckAccessQuery, CheckAccessQueryVariables>(CheckAccessDocument, variables),
    ...options
  }
    )};

useSuspenseCheckAccessQuery.getKey = (variables?: CheckAccessQueryVariables) => variables === undefined ? ['CheckAccess'] : ['CheckAccess', variables];


useCheckAccessQuery.fetcher = (variables?: CheckAccessQueryVariables, options?: RequestInit['headers']) => gqlFetch<CheckAccessQuery, CheckAccessQueryVariables>(CheckAccessDocument, variables, options);

export const GetShareCodeDocument = new TypedDocumentString(`
    query GetShareCode {
  getShareCode
}
    `);

export const useGetShareCodeQuery = <
      TData = GetShareCodeQuery,
      TError = unknown
    >(
      variables?: GetShareCodeQueryVariables,
      options?: Omit<UseQueryOptions<GetShareCodeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetShareCodeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetShareCodeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetShareCode'] : ['GetShareCode', variables],
    queryFn: gqlFetch<GetShareCodeQuery, GetShareCodeQueryVariables>(GetShareCodeDocument, variables),
    ...options
  }
    )};

useGetShareCodeQuery.getKey = (variables?: GetShareCodeQueryVariables) => variables === undefined ? ['GetShareCode'] : ['GetShareCode', variables];

export const useSuspenseGetShareCodeQuery = <
      TData = GetShareCodeQuery,
      TError = unknown
    >(
      variables?: GetShareCodeQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<GetShareCodeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<GetShareCodeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<GetShareCodeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetShareCode'] : ['GetShareCode', variables],
    queryFn: gqlFetch<GetShareCodeQuery, GetShareCodeQueryVariables>(GetShareCodeDocument, variables),
    ...options
  }
    )};

useSuspenseGetShareCodeQuery.getKey = (variables?: GetShareCodeQueryVariables) => variables === undefined ? ['GetShareCode'] : ['GetShareCode', variables];


useGetShareCodeQuery.fetcher = (variables?: GetShareCodeQueryVariables, options?: RequestInit['headers']) => gqlFetch<GetShareCodeQuery, GetShareCodeQueryVariables>(GetShareCodeDocument, variables, options);

export const LoginBySocialDocument = new TypedDocumentString(`
    mutation LoginBySocial($input: LoginBySocialInput!) {
  loginBySocial(input: $input) {
    ...UserInfoParts
  }
}
    fragment UserInfoParts on UserInfo {
  id
  name
  email
  profileImg
  loginType
  authType
}`);

export const useLoginBySocialMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginBySocialMutation, TError, LoginBySocialMutationVariables, TContext>) => {
    
    return useMutation<LoginBySocialMutation, TError, LoginBySocialMutationVariables, TContext>(
      {
    mutationKey: ['LoginBySocial'],
    mutationFn: (variables?: LoginBySocialMutationVariables) => gqlFetch<LoginBySocialMutation, LoginBySocialMutationVariables>(LoginBySocialDocument, variables)(),
    ...options
  }
    )};


useLoginBySocialMutation.fetcher = (variables: LoginBySocialMutationVariables, options?: RequestInit['headers']) => gqlFetch<LoginBySocialMutation, LoginBySocialMutationVariables>(LoginBySocialDocument, variables, options);

export const LoginByShareCodeDocument = new TypedDocumentString(`
    mutation LoginByShareCode($input: LoginByShareCodeInput!) {
  loginByShareCode(input: $input) {
    ...UserInfoParts
  }
}
    fragment UserInfoParts on UserInfo {
  id
  name
  email
  profileImg
  loginType
  authType
}`);

export const useLoginByShareCodeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginByShareCodeMutation, TError, LoginByShareCodeMutationVariables, TContext>) => {
    
    return useMutation<LoginByShareCodeMutation, TError, LoginByShareCodeMutationVariables, TContext>(
      {
    mutationKey: ['LoginByShareCode'],
    mutationFn: (variables?: LoginByShareCodeMutationVariables) => gqlFetch<LoginByShareCodeMutation, LoginByShareCodeMutationVariables>(LoginByShareCodeDocument, variables)(),
    ...options
  }
    )};


useLoginByShareCodeMutation.fetcher = (variables: LoginByShareCodeMutationVariables, options?: RequestInit['headers']) => gqlFetch<LoginByShareCodeMutation, LoginByShareCodeMutationVariables>(LoginByShareCodeDocument, variables, options);

export const LogoutDocument = new TypedDocumentString(`
    mutation Logout {
  logout
}
    `);

export const useLogoutMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>) => {
    
    return useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
      {
    mutationKey: ['Logout'],
    mutationFn: (variables?: LogoutMutationVariables) => gqlFetch<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables)(),
    ...options
  }
    )};


useLogoutMutation.fetcher = (variables?: LogoutMutationVariables, options?: RequestInit['headers']) => gqlFetch<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables, options);

export const RefreshSessionDocument = new TypedDocumentString(`
    mutation RefreshSession {
  refreshSession
}
    `);

export const useRefreshSessionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RefreshSessionMutation, TError, RefreshSessionMutationVariables, TContext>) => {
    
    return useMutation<RefreshSessionMutation, TError, RefreshSessionMutationVariables, TContext>(
      {
    mutationKey: ['RefreshSession'],
    mutationFn: (variables?: RefreshSessionMutationVariables) => gqlFetch<RefreshSessionMutation, RefreshSessionMutationVariables>(RefreshSessionDocument, variables)(),
    ...options
  }
    )};


useRefreshSessionMutation.fetcher = (variables?: RefreshSessionMutationVariables, options?: RequestInit['headers']) => gqlFetch<RefreshSessionMutation, RefreshSessionMutationVariables>(RefreshSessionDocument, variables, options);

export const UpsertShareCodeDocument = new TypedDocumentString(`
    mutation UpsertShareCode {
  upsertShareCode
}
    `);

export const useUpsertShareCodeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpsertShareCodeMutation, TError, UpsertShareCodeMutationVariables, TContext>) => {
    
    return useMutation<UpsertShareCodeMutation, TError, UpsertShareCodeMutationVariables, TContext>(
      {
    mutationKey: ['UpsertShareCode'],
    mutationFn: (variables?: UpsertShareCodeMutationVariables) => gqlFetch<UpsertShareCodeMutation, UpsertShareCodeMutationVariables>(UpsertShareCodeDocument, variables)(),
    ...options
  }
    )};


useUpsertShareCodeMutation.fetcher = (variables?: UpsertShareCodeMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpsertShareCodeMutation, UpsertShareCodeMutationVariables>(UpsertShareCodeDocument, variables, options);

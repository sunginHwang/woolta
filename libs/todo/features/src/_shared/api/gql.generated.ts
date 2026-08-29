/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { gqlFetch } from './fetcher';
export type CompleteTodoInput = {
  id: string;
  isCompleted: boolean;
};

export type CreateTodoCategoryInput = {
  name: string;
};

export type CreateTodoInput = {
  categoryId?: string | null | undefined;
  dueDate?: string | null | undefined;
  priority?: TodoPriority | null | undefined;
  title: string;
};

export type DeleteTodoCategoryInput = {
  id: string;
};

export type DeleteTodoInput = {
  id: string;
};

export type ImportTodoCategoryInput = {
  clientId: string;
  createdAt?: string | null | undefined;
  name: string;
  order: number;
};

export type ImportTodoInput = {
  categoryClientId?: string | null | undefined;
  clientId: string;
  completedAt?: string | null | undefined;
  createdAt?: string | null | undefined;
  deletedAt?: string | null | undefined;
  dueDate?: string | null | undefined;
  isCompleted: boolean;
  memo: string;
  order: number;
  priority: TodoPriority;
  title: string;
  updatedAt?: string | null | undefined;
};

export type ImportTodoListInput = {
  categoryList: Array<ImportTodoCategoryInput>;
  itemList: Array<ImportTodoInput>;
};

export type RestoreTodoInput = {
  id: string;
};

export type TodoPriority =
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | 'NONE';

export type TrashTodoInput = {
  id: string;
};

export type UpdateTodoCategoryInput = {
  id: string;
  name: string;
};

export type UpdateTodoInput = {
  categoryId?: string | null | undefined;
  dueDate?: string | null | undefined;
  id: string;
  memo?: string | null | undefined;
  priority?: TodoPriority | null | undefined;
  title?: string | null | undefined;
};

export type TodoPartsFragment = { id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string };

export type TodoListQueryVariables = Exact<{ [key: string]: never; }>;


export type TodoListQuery = { todoList: { totalCount: number, itemList: Array<{ id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string }> } };

export type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;


export type CreateTodoMutation = { createTodo: { id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string } };

export type UpdateTodoMutationVariables = Exact<{
  input: UpdateTodoInput;
}>;


export type UpdateTodoMutation = { updateTodo: { id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string } };

export type CompleteTodoMutationVariables = Exact<{
  input: CompleteTodoInput;
}>;


export type CompleteTodoMutation = { completeTodo: { id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string } };

export type TrashTodoMutationVariables = Exact<{
  input: TrashTodoInput;
}>;


export type TrashTodoMutation = { trashTodo: { id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string } };

export type RestoreTodoMutationVariables = Exact<{
  input: RestoreTodoInput;
}>;


export type RestoreTodoMutation = { restoreTodo: { id: string, title: string, memo: string, dueDate: string | null, categoryId: string | null, priority: TodoPriority, isCompleted: boolean, completedAt: string | null, deletedAt: string | null, order: number, createdAt: string, updatedAt: string } };

export type DeleteTodoMutationVariables = Exact<{
  input: DeleteTodoInput;
}>;


export type DeleteTodoMutation = { deleteTodo: boolean };

export type EmptyTrashMutationVariables = Exact<{ [key: string]: never; }>;


export type EmptyTrashMutation = { emptyTrash: boolean };

export type ImportTodoListMutationVariables = Exact<{
  input: ImportTodoListInput;
}>;


export type ImportTodoListMutation = { importTodoList: { categoryIdMap: Array<{ from: string, to: string }>, todoIdMap: Array<{ from: string, to: string }> } };

export type TodoCategoryPartsFragment = { id: string, name: string, order: number, createdAt: string };

export type TodoCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type TodoCategoryListQuery = { todoCategoryList: { totalCount: number, itemList: Array<{ id: string, name: string, order: number, createdAt: string }> } };

export type CreateTodoCategoryMutationVariables = Exact<{
  input: CreateTodoCategoryInput;
}>;


export type CreateTodoCategoryMutation = { createTodoCategory: { id: string, name: string, order: number, createdAt: string } };

export type UpdateTodoCategoryMutationVariables = Exact<{
  input: UpdateTodoCategoryInput;
}>;


export type UpdateTodoCategoryMutation = { updateTodoCategory: { id: string, name: string, order: number, createdAt: string } };

export type DeleteTodoCategoryMutationVariables = Exact<{
  input: DeleteTodoCategoryInput;
}>;


export type DeleteTodoCategoryMutation = { deleteTodoCategory: boolean };


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
export const TodoPartsFragmentDoc = new TypedDocumentString(`
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}
    `, {"fragmentName":"TodoParts"});
export const TodoCategoryPartsFragmentDoc = new TypedDocumentString(`
    fragment TodoCategoryParts on TodoCategory {
  id
  name
  order
  createdAt
}
    `, {"fragmentName":"TodoCategoryParts"});
export const TodoListDocument = new TypedDocumentString(`
    query TodoList {
  todoList {
    totalCount
    itemList {
      ...TodoParts
    }
  }
}
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}`);

export const useTodoListQuery = <
      TData = TodoListQuery,
      TError = unknown
    >(
      variables?: TodoListQueryVariables,
      options?: Omit<UseQueryOptions<TodoListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TodoListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TodoListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['TodoList'] : ['TodoList', variables],
    queryFn: gqlFetch<TodoListQuery, TodoListQueryVariables>(TodoListDocument, variables),
    ...options
  }
    )};

useTodoListQuery.getKey = (variables?: TodoListQueryVariables) => variables === undefined ? ['TodoList'] : ['TodoList', variables];

export const useSuspenseTodoListQuery = <
      TData = TodoListQuery,
      TError = unknown
    >(
      variables?: TodoListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<TodoListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<TodoListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<TodoListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['TodoList'] : ['TodoList', variables],
    queryFn: gqlFetch<TodoListQuery, TodoListQueryVariables>(TodoListDocument, variables),
    ...options
  }
    )};

useSuspenseTodoListQuery.getKey = (variables?: TodoListQueryVariables) => variables === undefined ? ['TodoList'] : ['TodoList', variables];


useTodoListQuery.fetcher = (variables?: TodoListQueryVariables, options?: RequestInit['headers']) => gqlFetch<TodoListQuery, TodoListQueryVariables>(TodoListDocument, variables, options);

export const CreateTodoDocument = new TypedDocumentString(`
    mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    ...TodoParts
  }
}
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}`);

export const useCreateTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTodoMutation, TError, CreateTodoMutationVariables, TContext>) => {
    
    return useMutation<CreateTodoMutation, TError, CreateTodoMutationVariables, TContext>(
      {
    mutationKey: ['CreateTodo'],
    mutationFn: (variables?: CreateTodoMutationVariables) => gqlFetch<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, variables)(),
    ...options
  }
    )};


useCreateTodoMutation.fetcher = (variables: CreateTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, variables, options);

export const UpdateTodoDocument = new TypedDocumentString(`
    mutation UpdateTodo($input: UpdateTodoInput!) {
  updateTodo(input: $input) {
    ...TodoParts
  }
}
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}`);

export const useUpdateTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateTodoMutation, TError, UpdateTodoMutationVariables, TContext>) => {
    
    return useMutation<UpdateTodoMutation, TError, UpdateTodoMutationVariables, TContext>(
      {
    mutationKey: ['UpdateTodo'],
    mutationFn: (variables?: UpdateTodoMutationVariables) => gqlFetch<UpdateTodoMutation, UpdateTodoMutationVariables>(UpdateTodoDocument, variables)(),
    ...options
  }
    )};


useUpdateTodoMutation.fetcher = (variables: UpdateTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateTodoMutation, UpdateTodoMutationVariables>(UpdateTodoDocument, variables, options);

export const CompleteTodoDocument = new TypedDocumentString(`
    mutation CompleteTodo($input: CompleteTodoInput!) {
  completeTodo(input: $input) {
    ...TodoParts
  }
}
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}`);

export const useCompleteTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CompleteTodoMutation, TError, CompleteTodoMutationVariables, TContext>) => {
    
    return useMutation<CompleteTodoMutation, TError, CompleteTodoMutationVariables, TContext>(
      {
    mutationKey: ['CompleteTodo'],
    mutationFn: (variables?: CompleteTodoMutationVariables) => gqlFetch<CompleteTodoMutation, CompleteTodoMutationVariables>(CompleteTodoDocument, variables)(),
    ...options
  }
    )};


useCompleteTodoMutation.fetcher = (variables: CompleteTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<CompleteTodoMutation, CompleteTodoMutationVariables>(CompleteTodoDocument, variables, options);

export const TrashTodoDocument = new TypedDocumentString(`
    mutation TrashTodo($input: TrashTodoInput!) {
  trashTodo(input: $input) {
    ...TodoParts
  }
}
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}`);

export const useTrashTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TrashTodoMutation, TError, TrashTodoMutationVariables, TContext>) => {
    
    return useMutation<TrashTodoMutation, TError, TrashTodoMutationVariables, TContext>(
      {
    mutationKey: ['TrashTodo'],
    mutationFn: (variables?: TrashTodoMutationVariables) => gqlFetch<TrashTodoMutation, TrashTodoMutationVariables>(TrashTodoDocument, variables)(),
    ...options
  }
    )};


useTrashTodoMutation.fetcher = (variables: TrashTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<TrashTodoMutation, TrashTodoMutationVariables>(TrashTodoDocument, variables, options);

export const RestoreTodoDocument = new TypedDocumentString(`
    mutation RestoreTodo($input: RestoreTodoInput!) {
  restoreTodo(input: $input) {
    ...TodoParts
  }
}
    fragment TodoParts on Todo {
  id
  title
  memo
  dueDate
  categoryId
  priority
  isCompleted
  completedAt
  deletedAt
  order
  createdAt
  updatedAt
}`);

export const useRestoreTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RestoreTodoMutation, TError, RestoreTodoMutationVariables, TContext>) => {
    
    return useMutation<RestoreTodoMutation, TError, RestoreTodoMutationVariables, TContext>(
      {
    mutationKey: ['RestoreTodo'],
    mutationFn: (variables?: RestoreTodoMutationVariables) => gqlFetch<RestoreTodoMutation, RestoreTodoMutationVariables>(RestoreTodoDocument, variables)(),
    ...options
  }
    )};


useRestoreTodoMutation.fetcher = (variables: RestoreTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<RestoreTodoMutation, RestoreTodoMutationVariables>(RestoreTodoDocument, variables, options);

export const DeleteTodoDocument = new TypedDocumentString(`
    mutation DeleteTodo($input: DeleteTodoInput!) {
  deleteTodo(input: $input)
}
    `);

export const useDeleteTodoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTodoMutation, TError, DeleteTodoMutationVariables, TContext>) => {
    
    return useMutation<DeleteTodoMutation, TError, DeleteTodoMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTodo'],
    mutationFn: (variables?: DeleteTodoMutationVariables) => gqlFetch<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, variables)(),
    ...options
  }
    )};


useDeleteTodoMutation.fetcher = (variables: DeleteTodoMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, variables, options);

export const EmptyTrashDocument = new TypedDocumentString(`
    mutation EmptyTrash {
  emptyTrash
}
    `);

export const useEmptyTrashMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<EmptyTrashMutation, TError, EmptyTrashMutationVariables, TContext>) => {
    
    return useMutation<EmptyTrashMutation, TError, EmptyTrashMutationVariables, TContext>(
      {
    mutationKey: ['EmptyTrash'],
    mutationFn: (variables?: EmptyTrashMutationVariables) => gqlFetch<EmptyTrashMutation, EmptyTrashMutationVariables>(EmptyTrashDocument, variables)(),
    ...options
  }
    )};


useEmptyTrashMutation.fetcher = (variables?: EmptyTrashMutationVariables, options?: RequestInit['headers']) => gqlFetch<EmptyTrashMutation, EmptyTrashMutationVariables>(EmptyTrashDocument, variables, options);

export const ImportTodoListDocument = new TypedDocumentString(`
    mutation ImportTodoList($input: ImportTodoListInput!) {
  importTodoList(input: $input) {
    categoryIdMap {
      from
      to
    }
    todoIdMap {
      from
      to
    }
  }
}
    `);

export const useImportTodoListMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ImportTodoListMutation, TError, ImportTodoListMutationVariables, TContext>) => {
    
    return useMutation<ImportTodoListMutation, TError, ImportTodoListMutationVariables, TContext>(
      {
    mutationKey: ['ImportTodoList'],
    mutationFn: (variables?: ImportTodoListMutationVariables) => gqlFetch<ImportTodoListMutation, ImportTodoListMutationVariables>(ImportTodoListDocument, variables)(),
    ...options
  }
    )};


useImportTodoListMutation.fetcher = (variables: ImportTodoListMutationVariables, options?: RequestInit['headers']) => gqlFetch<ImportTodoListMutation, ImportTodoListMutationVariables>(ImportTodoListDocument, variables, options);

export const TodoCategoryListDocument = new TypedDocumentString(`
    query TodoCategoryList {
  todoCategoryList {
    totalCount
    itemList {
      ...TodoCategoryParts
    }
  }
}
    fragment TodoCategoryParts on TodoCategory {
  id
  name
  order
  createdAt
}`);

export const useTodoCategoryListQuery = <
      TData = TodoCategoryListQuery,
      TError = unknown
    >(
      variables?: TodoCategoryListQueryVariables,
      options?: Omit<UseQueryOptions<TodoCategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TodoCategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TodoCategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['TodoCategoryList'] : ['TodoCategoryList', variables],
    queryFn: gqlFetch<TodoCategoryListQuery, TodoCategoryListQueryVariables>(TodoCategoryListDocument, variables),
    ...options
  }
    )};

useTodoCategoryListQuery.getKey = (variables?: TodoCategoryListQueryVariables) => variables === undefined ? ['TodoCategoryList'] : ['TodoCategoryList', variables];

export const useSuspenseTodoCategoryListQuery = <
      TData = TodoCategoryListQuery,
      TError = unknown
    >(
      variables?: TodoCategoryListQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<TodoCategoryListQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<TodoCategoryListQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<TodoCategoryListQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['TodoCategoryList'] : ['TodoCategoryList', variables],
    queryFn: gqlFetch<TodoCategoryListQuery, TodoCategoryListQueryVariables>(TodoCategoryListDocument, variables),
    ...options
  }
    )};

useSuspenseTodoCategoryListQuery.getKey = (variables?: TodoCategoryListQueryVariables) => variables === undefined ? ['TodoCategoryList'] : ['TodoCategoryList', variables];


useTodoCategoryListQuery.fetcher = (variables?: TodoCategoryListQueryVariables, options?: RequestInit['headers']) => gqlFetch<TodoCategoryListQuery, TodoCategoryListQueryVariables>(TodoCategoryListDocument, variables, options);

export const CreateTodoCategoryDocument = new TypedDocumentString(`
    mutation CreateTodoCategory($input: CreateTodoCategoryInput!) {
  createTodoCategory(input: $input) {
    ...TodoCategoryParts
  }
}
    fragment TodoCategoryParts on TodoCategory {
  id
  name
  order
  createdAt
}`);

export const useCreateTodoCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTodoCategoryMutation, TError, CreateTodoCategoryMutationVariables, TContext>) => {
    
    return useMutation<CreateTodoCategoryMutation, TError, CreateTodoCategoryMutationVariables, TContext>(
      {
    mutationKey: ['CreateTodoCategory'],
    mutationFn: (variables?: CreateTodoCategoryMutationVariables) => gqlFetch<CreateTodoCategoryMutation, CreateTodoCategoryMutationVariables>(CreateTodoCategoryDocument, variables)(),
    ...options
  }
    )};


useCreateTodoCategoryMutation.fetcher = (variables: CreateTodoCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<CreateTodoCategoryMutation, CreateTodoCategoryMutationVariables>(CreateTodoCategoryDocument, variables, options);

export const UpdateTodoCategoryDocument = new TypedDocumentString(`
    mutation UpdateTodoCategory($input: UpdateTodoCategoryInput!) {
  updateTodoCategory(input: $input) {
    ...TodoCategoryParts
  }
}
    fragment TodoCategoryParts on TodoCategory {
  id
  name
  order
  createdAt
}`);

export const useUpdateTodoCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateTodoCategoryMutation, TError, UpdateTodoCategoryMutationVariables, TContext>) => {
    
    return useMutation<UpdateTodoCategoryMutation, TError, UpdateTodoCategoryMutationVariables, TContext>(
      {
    mutationKey: ['UpdateTodoCategory'],
    mutationFn: (variables?: UpdateTodoCategoryMutationVariables) => gqlFetch<UpdateTodoCategoryMutation, UpdateTodoCategoryMutationVariables>(UpdateTodoCategoryDocument, variables)(),
    ...options
  }
    )};


useUpdateTodoCategoryMutation.fetcher = (variables: UpdateTodoCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<UpdateTodoCategoryMutation, UpdateTodoCategoryMutationVariables>(UpdateTodoCategoryDocument, variables, options);

export const DeleteTodoCategoryDocument = new TypedDocumentString(`
    mutation DeleteTodoCategory($input: DeleteTodoCategoryInput!) {
  deleteTodoCategory(input: $input)
}
    `);

export const useDeleteTodoCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTodoCategoryMutation, TError, DeleteTodoCategoryMutationVariables, TContext>) => {
    
    return useMutation<DeleteTodoCategoryMutation, TError, DeleteTodoCategoryMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTodoCategory'],
    mutationFn: (variables?: DeleteTodoCategoryMutationVariables) => gqlFetch<DeleteTodoCategoryMutation, DeleteTodoCategoryMutationVariables>(DeleteTodoCategoryDocument, variables)(),
    ...options
  }
    )};


useDeleteTodoCategoryMutation.fetcher = (variables: DeleteTodoCategoryMutationVariables, options?: RequestInit['headers']) => gqlFetch<DeleteTodoCategoryMutation, DeleteTodoCategoryMutationVariables>(DeleteTodoCategoryDocument, variables, options);

import { ExecutionResult, ExecutionRequest } from './Interfaces';
declare type MaybePromise<T> = Promise<T> | T;
declare type MaybeAsyncIterable<T> = AsyncIterable<T> | T;
export declare type AsyncExecutor<TBaseContext = Record<string, any>, TBaseExtensions = Record<string, any>> = <TReturn = any, TArgs = Record<string, any>, TContext extends TBaseContext = TBaseContext, TRoot = any, TExtensions extends TBaseExtensions = TBaseExtensions>(request: ExecutionRequest<TArgs, TContext, TRoot, TExtensions>) => Promise<MaybeAsyncIterable<ExecutionResult<TReturn>>>;
export declare type SyncExecutor<TBaseContext = Record<string, any>, TBaseExtensions = Record<string, any>> = <TReturn = any, TArgs = Record<string, any>, TContext extends TBaseContext = TBaseContext, TRoot = any, TExtensions extends TBaseExtensions = TBaseExtensions>(request: ExecutionRequest<TArgs, TContext, TRoot, TExtensions>) => ExecutionResult<TReturn>;
export declare type Executor<TBaseContext = Record<string, any>, TBaseExtensions = Record<string, any>> = <TReturn = any, TArgs = Record<string, any>, TContext extends TBaseContext = TBaseContext, TRoot = any, TExtensions extends TBaseExtensions = TBaseExtensions>(request: ExecutionRequest<TArgs, TContext, TRoot, TExtensions>) => MaybePromise<MaybeAsyncIterable<ExecutionResult<TReturn>>>;
export {};

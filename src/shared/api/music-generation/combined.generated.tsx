import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type GeneratePoemInput = {
  genre?: Scalars['String'];
  requestText: Scalars['String'];
  userId: Scalars['String'];
};

export type GenerateSongInput = {
  songStyle: Scalars['String'];
  text?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export enum ImageGenerationStatusEnum {
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Ready = 'READY'
}

export type MakeReactionInput = {
  reaction: ReactionType;
  songId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteSong: Scalars['Boolean'];
  generateSong: SongEntity;
  makeReaction: ReactionEntity;
  poetryGenerate: PoetryEntity;
  registerUser: UserEntity;
};


export type MutationDeleteSongArgs = {
  songId: Scalars['String'];
};


export type MutationGenerateSongArgs = {
  input: GenerateSongInput;
};


export type MutationMakeReactionArgs = {
  input: MakeReactionInput;
};


export type MutationPoetryGenerateArgs = {
  input: GeneratePoemInput;
};


export type MutationRegisterUserArgs = {
  userId: Scalars['String'];
};

export type PoetryEntity = {
  __typename?: 'PoetryEntity';
  createdAt: Scalars['String'];
  estimation?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  requestId?: Maybe<Scalars['String']>;
  requestText: Scalars['String'];
  resultText?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  status: Scalars['String'];
  user: UserEntity;
  variants?: Maybe<Array<Scalars['String']>>;
};

export type Query = {
  __typename?: 'Query';
  generateText: Scalars['String'];
  getGigachatToken: Scalars['String'];
  getSongById?: Maybe<SongEntity>;
  getSongs: Array<SongEntity>;
  poetryGetResult: PoetryEntity;
};


export type QueryGenerateTextArgs = {
  prompt: Scalars['String'];
};


export type QueryGetSongByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetSongsArgs = {
  input: SongQueryInput;
};


export type QueryPoetryGetResultArgs = {
  poetryId: Scalars['String'];
};

export type ReactionEntity = {
  __typename?: 'ReactionEntity';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  reaction: ReactionType;
  song: SongEntity;
  songId: Scalars['String'];
};

export enum ReactionType {
  Dislike = 'Dislike',
  Like = 'Like'
}

export type SongEntity = {
  __typename?: 'SongEntity';
  coordinatorQueryId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['DateTime'];
  /** Продолжительность записи в секундах */
  duration?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  imageGenerationStatus: ImageGenerationStatusEnum;
  imageQueryId?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  midiUrl?: Maybe<Scalars['String']>;
  mp3Url?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  reactions?: Maybe<Array<ReactionEntity>>;
  status: SongStatus;
  style?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  user: UserEntity;
  userId: Scalars['Float'];
};

export type SongQueryInput = {
  from?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<SortOrder>;
  take?: InputMaybe<Scalars['Int']>;
  userId: Scalars['ID'];
};

export enum SongStatus {
  Cancelled = 'Cancelled',
  Censored = 'Censored',
  Finished = 'Finished',
  Started = 'Started'
}

export enum SortOrder {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  LikesAsc = 'LIKES_ASC',
  LikesDesc = 'LIKES_DESC'
}

export type UserEntity = {
  __typename?: 'UserEntity';
  browserSessionId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  jwtKey?: Maybe<Scalars['String']>;
  songs: Array<SongEntity>;
};

export type PoetryEntityFieldsFragment = { __typename?: 'PoetryEntity', createdAt: string, estimation?: number | null, id: string, requestId?: string | null, requestText: string, resultText?: string | null, score?: number | null, status: string, variants?: Array<string> | null };

export type ReactionEntityFieldsFragment = { __typename?: 'ReactionEntity', id: string, createdAt: any, songId: string, reaction: ReactionType };

export type SongEntityFieldsFragment = { __typename?: 'SongEntity', coordinatorQueryId?: string | null, createdAt: any, duration?: number | null, id: string, imageGenerationStatus: ImageGenerationStatusEnum, imageQueryId?: string | null, imageUrl?: string | null, midiUrl?: string | null, mp3Url?: string | null, name: string, status: SongStatus, style?: string | null, text?: string | null };

export type UserEntityFieldsFragment = { __typename?: 'UserEntity', id: string, browserSessionId: string, createdAt: any, songs: Array<{ __typename?: 'SongEntity', id: string, name: string }> };

export type DeleteSongMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteSongMutation = { __typename?: 'Mutation', deleteSong: boolean };

export type GenerateSongMutationVariables = Exact<{
  input: GenerateSongInput;
}>;


export type GenerateSongMutation = { __typename?: 'Mutation', generateSong: { __typename?: 'SongEntity', coordinatorQueryId?: string | null, createdAt: any, duration?: number | null, id: string, imageGenerationStatus: ImageGenerationStatusEnum, imageQueryId?: string | null, imageUrl?: string | null, midiUrl?: string | null, mp3Url?: string | null, name: string, status: SongStatus, style?: string | null, text?: string | null } };

export type MakeReactionMutationVariables = Exact<{
  input: MakeReactionInput;
}>;


export type MakeReactionMutation = { __typename?: 'Mutation', makeReaction: { __typename?: 'ReactionEntity', id: string, createdAt: any, songId: string, reaction: ReactionType } };

export type PoetryGenerateMutationVariables = Exact<{
  input: GeneratePoemInput;
}>;


export type PoetryGenerateMutation = { __typename?: 'Mutation', poetryGenerate: { __typename?: 'PoetryEntity', createdAt: string, estimation?: number | null, id: string, requestId?: string | null, requestText: string, resultText?: string | null, score?: number | null, status: string, variants?: Array<string> | null } };

export type RegisterUserMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserEntity', id: string, browserSessionId: string } };

export type GenerateTextQueryVariables = Exact<{
  prompt: Scalars['String'];
}>;


export type GenerateTextQuery = { __typename?: 'Query', generateText: string };

export type GetGigachatTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGigachatTokenQuery = { __typename?: 'Query', getGigachatToken: string };

export type GetSongByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetSongByIdQuery = { __typename?: 'Query', getSongById?: { __typename?: 'SongEntity', coordinatorQueryId?: string | null, createdAt: any, duration?: number | null, id: string, imageGenerationStatus: ImageGenerationStatusEnum, imageQueryId?: string | null, imageUrl?: string | null, midiUrl?: string | null, mp3Url?: string | null, name: string, status: SongStatus, style?: string | null, text?: string | null } | null };

export type GetSongsQueryVariables = Exact<{
  input: SongQueryInput;
}>;


export type GetSongsQuery = { __typename?: 'Query', getSongs: Array<{ __typename?: 'SongEntity', coordinatorQueryId?: string | null, createdAt: any, duration?: number | null, id: string, imageGenerationStatus: ImageGenerationStatusEnum, imageQueryId?: string | null, imageUrl?: string | null, midiUrl?: string | null, mp3Url?: string | null, name: string, status: SongStatus, style?: string | null, text?: string | null }> };

export type PoetryGetResultQueryVariables = Exact<{
  poetryId: Scalars['String'];
}>;


export type PoetryGetResultQuery = { __typename?: 'Query', poetryGetResult: { __typename?: 'PoetryEntity', createdAt: string, estimation?: number | null, id: string, requestId?: string | null, requestText: string, resultText?: string | null, score?: number | null, status: string, variants?: Array<string> | null } };

export const PoetryEntityFieldsFragmentDoc = gql`
    fragment PoetryEntityFields on PoetryEntity {
  createdAt
  estimation
  id
  requestId
  requestText
  resultText
  score
  status
  variants
}
    `;
export const ReactionEntityFieldsFragmentDoc = gql`
    fragment ReactionEntityFields on ReactionEntity {
  id
  createdAt
  songId
  reaction
}
    `;
export const SongEntityFieldsFragmentDoc = gql`
    fragment SongEntityFields on SongEntity {
  coordinatorQueryId
  createdAt
  duration
  id
  imageGenerationStatus
  imageQueryId
  imageUrl
  midiUrl
  mp3Url
  name
  status
  style
  text
}
    `;
export const UserEntityFieldsFragmentDoc = gql`
    fragment UserEntityFields on UserEntity {
  id
  browserSessionId
  createdAt
  songs {
    id
    name
  }
}
    `;
export const DeleteSongDocument = gql`
    mutation deleteSong($id: String!) {
  deleteSong(songId: $id)
}
    `;
export type DeleteSongMutationFn = Apollo.MutationFunction<DeleteSongMutation, DeleteSongMutationVariables>;

/**
 * __useDeleteSongMutation__
 *
 * To run a mutation, you first call `useDeleteSongMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSongMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSongMutation, { data, loading, error }] = useDeleteSongMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSongMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSongMutation, DeleteSongMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSongMutation, DeleteSongMutationVariables>(DeleteSongDocument, options);
      }
export type DeleteSongMutationHookResult = ReturnType<typeof useDeleteSongMutation>;
export type DeleteSongMutationResult = Apollo.MutationResult<DeleteSongMutation>;
export type DeleteSongMutationOptions = Apollo.BaseMutationOptions<DeleteSongMutation, DeleteSongMutationVariables>;
export const GenerateSongDocument = gql`
    mutation GenerateSong($input: GenerateSongInput!) {
  generateSong(input: $input) {
    ...SongEntityFields
  }
}
    ${SongEntityFieldsFragmentDoc}`;
export type GenerateSongMutationFn = Apollo.MutationFunction<GenerateSongMutation, GenerateSongMutationVariables>;

/**
 * __useGenerateSongMutation__
 *
 * To run a mutation, you first call `useGenerateSongMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateSongMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateSongMutation, { data, loading, error }] = useGenerateSongMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateSongMutation(baseOptions?: Apollo.MutationHookOptions<GenerateSongMutation, GenerateSongMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateSongMutation, GenerateSongMutationVariables>(GenerateSongDocument, options);
      }
export type GenerateSongMutationHookResult = ReturnType<typeof useGenerateSongMutation>;
export type GenerateSongMutationResult = Apollo.MutationResult<GenerateSongMutation>;
export type GenerateSongMutationOptions = Apollo.BaseMutationOptions<GenerateSongMutation, GenerateSongMutationVariables>;
export const MakeReactionDocument = gql`
    mutation makeReaction($input: MakeReactionInput!) {
  makeReaction(input: $input) {
    ...ReactionEntityFields
  }
}
    ${ReactionEntityFieldsFragmentDoc}`;
export type MakeReactionMutationFn = Apollo.MutationFunction<MakeReactionMutation, MakeReactionMutationVariables>;

/**
 * __useMakeReactionMutation__
 *
 * To run a mutation, you first call `useMakeReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMakeReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [makeReactionMutation, { data, loading, error }] = useMakeReactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMakeReactionMutation(baseOptions?: Apollo.MutationHookOptions<MakeReactionMutation, MakeReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MakeReactionMutation, MakeReactionMutationVariables>(MakeReactionDocument, options);
      }
export type MakeReactionMutationHookResult = ReturnType<typeof useMakeReactionMutation>;
export type MakeReactionMutationResult = Apollo.MutationResult<MakeReactionMutation>;
export type MakeReactionMutationOptions = Apollo.BaseMutationOptions<MakeReactionMutation, MakeReactionMutationVariables>;
export const PoetryGenerateDocument = gql`
    mutation PoetryGenerate($input: GeneratePoemInput!) {
  poetryGenerate(input: $input) {
    ...PoetryEntityFields
  }
}
    ${PoetryEntityFieldsFragmentDoc}`;
export type PoetryGenerateMutationFn = Apollo.MutationFunction<PoetryGenerateMutation, PoetryGenerateMutationVariables>;

/**
 * __usePoetryGenerateMutation__
 *
 * To run a mutation, you first call `usePoetryGenerateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePoetryGenerateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [poetryGenerateMutation, { data, loading, error }] = usePoetryGenerateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePoetryGenerateMutation(baseOptions?: Apollo.MutationHookOptions<PoetryGenerateMutation, PoetryGenerateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PoetryGenerateMutation, PoetryGenerateMutationVariables>(PoetryGenerateDocument, options);
      }
export type PoetryGenerateMutationHookResult = ReturnType<typeof usePoetryGenerateMutation>;
export type PoetryGenerateMutationResult = Apollo.MutationResult<PoetryGenerateMutation>;
export type PoetryGenerateMutationOptions = Apollo.BaseMutationOptions<PoetryGenerateMutation, PoetryGenerateMutationVariables>;
export const RegisterUserDocument = gql`
    mutation registerUser($userId: String!) {
  registerUser(userId: $userId) {
    id
    browserSessionId
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const GenerateTextDocument = gql`
    query GenerateText($prompt: String!) {
  generateText(prompt: $prompt)
}
    `;

/**
 * __useGenerateTextQuery__
 *
 * To run a query within a React component, call `useGenerateTextQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateTextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateTextQuery({
 *   variables: {
 *      prompt: // value for 'prompt'
 *   },
 * });
 */
export function useGenerateTextQuery(baseOptions: Apollo.QueryHookOptions<GenerateTextQuery, GenerateTextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateTextQuery, GenerateTextQueryVariables>(GenerateTextDocument, options);
      }
export function useGenerateTextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateTextQuery, GenerateTextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateTextQuery, GenerateTextQueryVariables>(GenerateTextDocument, options);
        }
export type GenerateTextQueryHookResult = ReturnType<typeof useGenerateTextQuery>;
export type GenerateTextLazyQueryHookResult = ReturnType<typeof useGenerateTextLazyQuery>;
export type GenerateTextQueryResult = Apollo.QueryResult<GenerateTextQuery, GenerateTextQueryVariables>;
export const GetGigachatTokenDocument = gql`
    query GetGigachatToken {
  getGigachatToken
}
    `;

/**
 * __useGetGigachatTokenQuery__
 *
 * To run a query within a React component, call `useGetGigachatTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGigachatTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGigachatTokenQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGigachatTokenQuery(baseOptions?: Apollo.QueryHookOptions<GetGigachatTokenQuery, GetGigachatTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGigachatTokenQuery, GetGigachatTokenQueryVariables>(GetGigachatTokenDocument, options);
      }
export function useGetGigachatTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGigachatTokenQuery, GetGigachatTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGigachatTokenQuery, GetGigachatTokenQueryVariables>(GetGigachatTokenDocument, options);
        }
export type GetGigachatTokenQueryHookResult = ReturnType<typeof useGetGigachatTokenQuery>;
export type GetGigachatTokenLazyQueryHookResult = ReturnType<typeof useGetGigachatTokenLazyQuery>;
export type GetGigachatTokenQueryResult = Apollo.QueryResult<GetGigachatTokenQuery, GetGigachatTokenQueryVariables>;
export const GetSongByIdDocument = gql`
    query GetSongById($id: String!) {
  getSongById(id: $id) {
    ...SongEntityFields
  }
}
    ${SongEntityFieldsFragmentDoc}`;

/**
 * __useGetSongByIdQuery__
 *
 * To run a query within a React component, call `useGetSongByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSongByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSongByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSongByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSongByIdQuery, GetSongByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSongByIdQuery, GetSongByIdQueryVariables>(GetSongByIdDocument, options);
      }
export function useGetSongByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSongByIdQuery, GetSongByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSongByIdQuery, GetSongByIdQueryVariables>(GetSongByIdDocument, options);
        }
export type GetSongByIdQueryHookResult = ReturnType<typeof useGetSongByIdQuery>;
export type GetSongByIdLazyQueryHookResult = ReturnType<typeof useGetSongByIdLazyQuery>;
export type GetSongByIdQueryResult = Apollo.QueryResult<GetSongByIdQuery, GetSongByIdQueryVariables>;
export const GetSongsDocument = gql`
    query getSongs($input: SongQueryInput!) {
  getSongs(input: $input) {
    ...SongEntityFields
  }
}
    ${SongEntityFieldsFragmentDoc}`;

/**
 * __useGetSongsQuery__
 *
 * To run a query within a React component, call `useGetSongsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSongsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSongsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSongsQuery(baseOptions: Apollo.QueryHookOptions<GetSongsQuery, GetSongsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSongsQuery, GetSongsQueryVariables>(GetSongsDocument, options);
      }
export function useGetSongsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSongsQuery, GetSongsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSongsQuery, GetSongsQueryVariables>(GetSongsDocument, options);
        }
export type GetSongsQueryHookResult = ReturnType<typeof useGetSongsQuery>;
export type GetSongsLazyQueryHookResult = ReturnType<typeof useGetSongsLazyQuery>;
export type GetSongsQueryResult = Apollo.QueryResult<GetSongsQuery, GetSongsQueryVariables>;
export const PoetryGetResultDocument = gql`
    query PoetryGetResult($poetryId: String!) {
  poetryGetResult(poetryId: $poetryId) {
    ...PoetryEntityFields
  }
}
    ${PoetryEntityFieldsFragmentDoc}`;

/**
 * __usePoetryGetResultQuery__
 *
 * To run a query within a React component, call `usePoetryGetResultQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoetryGetResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoetryGetResultQuery({
 *   variables: {
 *      poetryId: // value for 'poetryId'
 *   },
 * });
 */
export function usePoetryGetResultQuery(baseOptions: Apollo.QueryHookOptions<PoetryGetResultQuery, PoetryGetResultQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PoetryGetResultQuery, PoetryGetResultQueryVariables>(PoetryGetResultDocument, options);
      }
export function usePoetryGetResultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PoetryGetResultQuery, PoetryGetResultQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PoetryGetResultQuery, PoetryGetResultQueryVariables>(PoetryGetResultDocument, options);
        }
export type PoetryGetResultQueryHookResult = ReturnType<typeof usePoetryGetResultQuery>;
export type PoetryGetResultLazyQueryHookResult = ReturnType<typeof usePoetryGetResultLazyQuery>;
export type PoetryGetResultQueryResult = Apollo.QueryResult<PoetryGetResultQuery, PoetryGetResultQueryVariables>;
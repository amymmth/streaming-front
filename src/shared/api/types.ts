export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

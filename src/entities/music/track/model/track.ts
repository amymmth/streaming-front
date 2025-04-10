import {SongStatus} from "shared/api/types.ts";

export interface Track {
    id: string
    title: string
    lyrics: string
    genre: string
    coverUrl: string
    audioUrl: string
    createdAt: string
    status: SongStatus
    duration: number
}

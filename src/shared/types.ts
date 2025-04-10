// Тип для треков
export interface Track {
    id: number
    title: string
    genre: string
    coverUrl: string
    audioUrl: string
    lyrics: string
}

// Тип для MusicStylesWidget
export interface MusicStylesWidgetProps {
    musicStyles: string[]
    setMusicStyles: (styles: string[]) => void
}

// Тип для LyricsWidget
export interface LyricsWidgetProps {
    lyrics: string
    setLyrics: (lyrics: string) => void
}

// Тип для CreateTrackButton
export interface CreateTrackButtonProps {
    tracks: Track[]
    setTracks: (tracks: Track[]) => void
    lyrics: string
    musicStyles: string[]
}

// Тип для TrackListWidget
export interface TrackListWidgetProps {
    tracks: Track[]
}

// Тип для TrackPlaybackButton (если нужен для функционала воспроизведения)
export interface TrackPlaybackButtonProps {
    trackId: number
}

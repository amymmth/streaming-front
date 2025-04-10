"use client"

import type React from "react"
import { usePlayingTrack } from "entities/music/music-player"
import { useTracks } from "entities/music/track"
import { Play, Pause } from "lucide-react"
import { styled } from "@linaria/react"

export const TrendingTracks = () => {
    const { tracks } = useTracks()
    const { playingTrack, isPlaying, onPlay, onPause, setPlayingTrack } = usePlayingTrack()

    // Sort tracks by some criteria to simulate "trending" tracks
    // In a real app, this would come from an API or be calculated based on play counts
    const trendingTracks = [...tracks].sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 5)

    return (
        <div className="w-full mt-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Набирающие популярность</h2>
                <button className="text-sm text-stone-400 hover:text-white transition-colors">Показать все</button>
            </div>

            <div className="space-y-2">
                {trendingTracks.map((track) => (
                    <TrendingTrackItem
                        key={track.id}
                        track={track}
                        isPlaying={isPlaying && playingTrack?.id === track.id}
                        onTogglePlay={() => {
                            if (playingTrack?.id === track.id) {
                                isPlaying ? onPause() : onPlay()
                            } else {
                                setPlayingTrack(track)
                                onPlay()
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

interface TrendingTrackItemProps {
    track: any
    isPlaying: boolean
    onTogglePlay: () => void
}

// Update the TrendingTrackItem component to make buttons always visible
const TrendingTrackItem: React.FC<TrendingTrackItemProps> = ({ track, isPlaying, onTogglePlay }) => {
    // Calculate a random number of plays (for demo purposes)
    const plays = Math.floor(Math.random() * 10000) + 1000

    return (
        <div
            className="flex items-center p-3 rounded-lg transition-colors hover:bg-stone-800/50 cursor-pointer max-w-96"
            onClick={() => onTogglePlay()}
        >
            <div className="relative mr-4 flex-shrink-0">
                <img
                    src={track.coverUrl || "/placeholder.svg?height=60&width=60"}
                    alt={track.title}
                    className="w-12 h-12 rounded-md object-cover"
                />
                <PlayPauseButton
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation()
                        onTogglePlay()
                    }}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </PlayPauseButton>
            </div>

            <div className="flex-grow min-w-0">
                <h3 className="text-white font-medium truncate">{track.title}</h3>
                <p className="text-stone-400 text-sm truncate">{track.genre}</p>
            </div>

            <div className="flex items-center text-stone-400 text-sm ml-4">
                <span>{formatNumber(plays)} прослушиваний</span>
            </div>
        </div>
    )
}

const PlayPauseButton = styled.button`
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }
`

// Helper function to format numbers (e.g., 1500 -> 1.5K)
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
}

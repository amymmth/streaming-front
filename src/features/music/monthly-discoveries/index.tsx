"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ScrollArea } from "shared/ui/scroll-area"
import { usePlayingTrack } from "entities/music/music-player"
import { useTracks } from "entities/music/track"
import { Play, Pause, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { cn } from "shared/lib/utils"
import { styled } from "@linaria/react"

export const MonthlyDiscoveries = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const { tracks } = useTracks()
    const { playingTrack, isPlaying, onPlay, onPause, setPlayingTrack } = usePlayingTrack()

    // Get current month name in Russian
    const currentMonth = new Date().toLocaleString("ru-RU", { month: "long" })

    // Capitalize first letter
    const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)

    // In a real app, these would be specially curated tracks for the month
    // For now, we'll just use our existing tracks with a different sort
    const discoveryTracks = [...tracks]
        .sort(() => Math.random() - 0.5) // Random sort for demo
        .slice(0, 10)

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
        }
    }

    return (
        <div className="w-full mt-12 mb-16 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Открытия месяца</h2>
                <button className="text-sm text-stone-400 hover:text-white transition-colors">Показать все</button>
            </div>

            <div className="relative">
                <ScrollArea orientation="horizontal" className="w-full" viewportRef={scrollRef}>
                    <div className="flex gap-4 pb-4">
                        {discoveryTracks.map((track) => (
                            <DiscoveryCard
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
                </ScrollArea>

                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-stone-800/80 backdrop-blur-sm p-2 rounded-full text-white shadow-lg z-10"
                    onClick={scrollLeft}
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-stone-800/80 backdrop-blur-sm p-2 rounded-full text-white shadow-lg z-10"
                    onClick={scrollRight}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    )
}

interface DiscoveryCardProps {
    track: any
    isPlaying: boolean
    onTogglePlay: () => void
}

// Update the DiscoveryCard component to make buttons always visible
const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ track, isPlaying, onTogglePlay }) => {
    const [isLiked, setIsLiked] = useState(false)

    // Random play count for demo
    const plays = Math.floor(Math.random() * 5000) + 100

    return (
        <div className="flex-shrink-0 w-48 relative">
            <div className="relative group">
                <div className="w-48 h-48 rounded-lg overflow-hidden bg-stone-800">
                    <img
                        src={track.coverUrl || "/placeholder.svg?height=200&width=200"}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                    />
                </div>

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayButton onClick={onTogglePlay}>
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </PlayButton>
                </div>

                <LikeButton
                    className={cn("absolute top-2 right-2", isLiked && "text-red-500")}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsLiked(!isLiked)
                    }}
                >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </LikeButton>
            </div>

            <div className="mt-2">
                <h3 className="text-white font-medium truncate">{track.title}</h3>
                <p className="text-stone-400 text-sm truncate">{track.genre}</p>
                <div className="flex items-center justify-between mt-1 text-xs text-stone-500">
                    <span>{plays} прослушиваний</span>
                    <span>{formatDuration(track.duration || 0)}</span>
                </div>
            </div>
        </div>
    )
}

const PlayButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05) !important;
    }
`

const LikeButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    color: white;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
        transform: scale(1.05);
    }
`

// Helper function to format duration (seconds to MM:SS)
const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

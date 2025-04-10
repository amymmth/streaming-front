"use client"

import type React from "react"

import { useState } from "react"
import { ScrollArea } from "shared/ui/scroll-area"
import { cn } from "shared/lib/utils"
import { Play } from "lucide-react"
import { styled } from "@linaria/react"
import { usePlayingTrack } from "entities/music/music-player"
import { useTracks } from "entities/music/track"

// Sample genre data - in a real app, this would come from an API
const genres = [
    {
        id: 1,
        title: "Поп",
        description: "Современные хиты и популярные мелодии",
        image: "/genre-images/pop.jpg",
        color: "from-purple-500 to-pink-500",
        trackCount: 20,
        playCount: 6800,
    },
    {
        id: 2,
        title: "Рок",
        description: "Энергичные гитарные риффы и мощный вокал",
        image: "/genre-images/rock.jpg",
        color: "from-red-500 to-orange-500",
        trackCount: 18,
        playCount: 5200,
    },
    {
        id: 3,
        title: "Электронная",
        description: "Современные биты и синтезаторные мелодии",
        image: "/genre-images/electronic.jpg",
        color: "from-blue-500 to-cyan-500",
        trackCount: 25,
        playCount: 7500,
    },
    {
        id: 4,
        title: "Хип-хоп",
        description: "Ритмичные биты и выразительные тексты",
        image: "/genre-images/hiphop.jpg",
        color: "from-yellow-500 to-amber-500",
        trackCount: 22,
        playCount: 8100,
    },
    {
        id: 5,
        title: "Классика",
        description: "Вечная музыка великих композиторов",
        image: "/genre-images/classical.jpg",
        color: "from-emerald-500 to-teal-500",
        trackCount: 15,
        playCount: 3200,
    },
]

export const GenrePlaylists = () => {
    return (
        <div className="w-full mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Популярные жанры</h2>
                <button className="text-sm text-stone-400 hover:text-white transition-colors">Показать все</button>
            </div>

            <ScrollArea orientation="horizontal" className="w-full">
                <div className="flex gap-4 pb-4">
                    {genres.map((genre) => (
                        <GenreCard key={genre.id} genre={genre} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

interface GenreCardProps {
    genre: (typeof genres)[0]
}

// Update the GenreCard component to make buttons always visible and add playlist opening functionality
const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { isPlaying, onPlay, setPlayingTrack } = usePlayingTrack()
    const { tracks } = useTracks()

    // In a real implementation, we would filter tracks by genre
    // For now, we'll just use the first few tracks from our existing collection
    const genreTracks = tracks.slice(0, 5)

    const handlePlayGenre = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (genreTracks.length > 0) {
            setPlayingTrack(genreTracks[0])
            onPlay()
        }
    }

    const handleOpenPlaylist = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="flex-shrink-0 w-64">
            <div className="relative w-64 h-64 rounded-xl overflow-hidden group cursor-pointer" onClick={handleOpenPlaylist}>
                {/* Gradient overlay */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", genre.color)} />

                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{
                        backgroundImage: `url(${genre.image || "/placeholder.svg?height=400&width=400"})`,
                        transition: "transform 0.3s ease-in-out",
                    }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="text-xs text-white/80">
                            {genre.trackCount} треков • {genre.playCount.toLocaleString()} прослушиваний
                        </div>
                        <PlayButton onClick={handlePlayGenre}>
                            <Play size={16} />
                        </PlayButton>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{genre.title}</h3>
                        <p className="text-sm text-white/80">{genre.description}</p>
                    </div>
                </div>
            </div>

            {/* Expanded playlist view */}
            {isExpanded && (
                <div className="mt-2 bg-stone-800/80 backdrop-blur-sm rounded-lg p-3 animate-fadeIn">
                    <h4 className="text-sm font-semibold text-white mb-2">Треки в плейлисте</h4>
                    <div className="space-y-2">
                        {genreTracks.map((track) => (
                            <div
                                key={track.id}
                                className="flex items-center p-2 hover:bg-stone-700/50 rounded-md cursor-pointer"
                                onClick={() => {
                                    setPlayingTrack(track)
                                    onPlay()
                                }}
                            >
                                <img
                                    src={track.coverUrl || "/placeholder.svg?height=40&width=40"}
                                    alt={track.title}
                                    className="w-8 h-8 rounded-md mr-3"
                                />
                                <div>
                                    <p className="text-sm text-white truncate">{track.title}</p>
                                    <p className="text-xs text-stone-400 truncate">{track.genre}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const PlayButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.2s ease;
    z-index: 10;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }
`

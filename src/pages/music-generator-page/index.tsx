import { useEffect, useMemo, useState } from "react"
import { Logo } from "shared/ui/symformer-logo"
import { useNavigate } from "react-router-dom"
import { VolumeControl } from "features/music-generator/volume-control"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "shared/ui/drawer.tsx"
import { useMediaQuery } from "shared/hooks/useMediaQuery.ts"
import { MusicModeEnum, MusicModeSelector } from "features/music-generator/music-mode-selector"
import { SongGenresInput } from "features/music-generator/song-genre"
import { SongLyricsInput } from "features/music-generator/song-lyrics"
import { CreateSongButton, CreateSongFlyButton } from "features/music-generator/create-song-button"
import { MusicPlayerControls, MusicTrackInfo } from "features/music-generator/music-player"
import { Playlist } from "features/music-generator/playlist"
import { Background3D } from "features/music-generator/background-3d"
import type { Intensities } from "features/music-generator/music-player/models/intensities.model.ts"
import { usePlayingTrack } from "entities/music/music-player"
import { cn } from "shared/lib/utils.ts"
import { useLogin } from "entities/music/auth/hooks/use-auth.ts"
import { Cross1Icon } from "@radix-ui/react-icons"
import { Technologies } from "widgets/technologies/technologies.tsx"
import { poetryGeneratingVar } from "features/music-generator/song-lyrics/hooks/usePoetryGenerate.ts"
import SymfornerLogoTextImage from "shared/ui/symformer-logo/assets/symforner_logo.png"
import { GenrePlaylists } from "features/music/genre-playlists"
import { TrendingTracks } from "features/music/trending-tracks"
import { MonthlyDiscoveries } from "features/music/monthly-discoveries"

export const MusicGeneratorPage = () => {
    const isMdOrLarger = useMediaQuery("(min-width: 768px)")
    const navigate = useNavigate()
    const [activeMode, setActiveMode] = useState<MusicModeEnum>(MusicModeEnum.withLyrics)
    const [showDiscovery, setShowDiscovery] = useState(false)

    const { isLoggedIn } = useLogin()

    const { playingTrack } = usePlayingTrack()

    const [intensities, setIntensities] = useState<Intensities>({
        bass: 0,
        mid: 0,
        average: 0,
        treble: 0,
    })
    const memoizedIntensities = useMemo(() => intensities as Intensities, [intensities])

    useEffect(() => {
        return () => {
            poetryGeneratingVar(false)
        }
    }, [])

    if (!isLoggedIn) {
        return null
    }

    return (
        <div className="flex flex-col md:h-screen text-white md:overflow-hidden">
            {/* Header */}
            <header className="py-4 px-4 md:px-12 flex flex-row justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className={"flex items-center gap-1"}>
                    <div className="hidden md:flex z-10 relative" onClick={() => navigate("/radio")}>
                        <Logo withoutCircleText={true} className={"w-12"} />
                        <img src={SymfornerLogoTextImage || "/placeholder.svg"} alt={"Symformer"} className={"h-[46px] ml-1"} />
                    </div>

                    <Drawer>
                        <DrawerTrigger asChild>
                            <div className="block md:hidden z-10 relative">
                                <Logo />
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className={"max-h-[calc(100vh-150px)]"}>
                            <DrawerHeader>
                                <DrawerTitle>
                  <span className="absolute top-5 left-1/2 -translate-x-1/2 text-lg font-semibold text-center">
                    Технологии Сбера
                  </span>
                                </DrawerTitle>
                                <DrawerClose className="absolute right-4 top-4 text-gray-600">
                                    <span className="sr-only">Закрыть</span>
                                    <Cross1Icon />
                                </DrawerClose>
                            </DrawerHeader>
                            <div className="p-4 flex flex-col gap-8 flex-0 max-h-[calc(100vh-220px)] mb-8">
                                <p className="text-sm text-white/80 px-4 text-center">
                                    Для работы сервиса были использованы следующие технологии:
                                </p>
                                <Technologies />
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <div className={"hidden md:flex"}>
                        <Technologies />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className={cn(
                            "px-4 py-2 rounded-full text-sm transition-colors",
                            showDiscovery ? "bg-stone-700 text-white" : "bg-stone-800/50 text-stone-300",
                        )}
                        onClick={() => setShowDiscovery(!showDiscovery)}
                    >
                        {showDiscovery ? "Создать музыку" : "Открыть для себя"}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className={"flex "}>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 px-0 md:pl-12 pb-12 pt-2 ">
                    {showDiscovery ? (
                        // Discovery view
                        <section className="md:col-span-12 px-4 md:px-0">
                            <GenrePlaylists />
                            <TrendingTracks />
                            <MonthlyDiscoveries />
                        </section>
                    ) : (
                        <>
                            {/* Left Section */}
                            <section
                                className="md:col-span-4 flex-col items-start justify-start gap-6 hidden md:flex w-full max-w-lg "
                                aria-labelledby="song-creation-title"
                            >
                                <h2 id="song-creation-title" className="sr-only">
                                    Инструменты создания песни
                                </h2>

                                {/* Mode Selector */}
                                <div className="w-full flex justify-end">
                                    <MusicModeSelector activeMode={activeMode} onChange={setActiveMode} />
                                </div>

                                {/* Genre Selector */}
                                <SongGenresInput activeMode={activeMode} className={"w-full flex flex-col gap-3"} />

                                {/* Song Text */}
                                {activeMode === MusicModeEnum.withLyrics && (
                                    <SongLyricsInput className={"w-full flex flex-col gap-3"} />
                                )}

                                <div className="flex-1" />

                                {/* Generate Button */}
                                <CreateSongButton activeMode={activeMode} />
                            </section>

                            {/* Right Section */}
                            <section
                                className=" md:col-span-8 lg:col-span-8 flex w-full max-w-6xl mx-auto gap-4"
                                aria-labelledby="track-list-title"
                            >
                                <h2 id="track-list-title" className="sr-only">
                                    Плейлист
                                </h2>
                                <div className={" flex flex-col gap-8 md:h-[calc(100vh-3.5rem-124.31px)] md:flex-col-reverse  w-full"}>
                                    <div
                                        className={cn(
                                            "sticky top-[132.31px] md:relative md:top-0  md:rounded-lg  flex-grow  z-20 flex flex-col min-h-0  overflow-hidden flex-shrink-0 transition-opacity duration-400",
                                            playingTrack ? "md:min-h-[45%] opacity-100" : "opacity-0",
                                        )}
                                    >
                                        <MusicTrackInfo />
                                        {isMdOrLarger && (
                                            <MusicPlayerControls className={"hidden md:flex flex-col"} onChangeIntensities={setIntensities} />
                                        )}
                                    </div>

                                    <Playlist />
                                </div>
                            </section>
                        </>
                    )}

                    {!isMdOrLarger && (
                        <div className={"flex flex-col fixed bottom-0 left-0 right-0 z-50 "}>
                            <MusicPlayerControls onChangeIntensities={setIntensities} className={"relative z-50"} />
                        </div>
                    )}
                </div>

                <div className={"hidden md:flex h-72 self-end pr-12 pl-6 pb-12"}>
                    <VolumeControl vertical={true} />
                </div>
            </div>
            <Background3D intensities={memoizedIntensities} />

            {/* Floating Action Button with Drawer */}
            {!showDiscovery && (
                <div className="fixed bottom-4 right-4 md:hidden z-50">
                    <Drawer>
                        <DrawerTrigger>
                            <CreateSongFlyButton />
                        </DrawerTrigger>

                        <DrawerContent className={"max-h-[calc(100vh-150px)]"}>
                            <DrawerHeader>
                                <DrawerClose className="absolute right-4 top-4 text-gray-600">
                                    <span className="sr-only">Закрыть</span>
                                    <Cross1Icon />
                                </DrawerClose>
                                <DrawerTitle>
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xl font-semibold text-center">
                    Создание песни
                  </span>
                                </DrawerTitle>
                            </DrawerHeader>

                            <div className="p-4 flex flex-col gap-8 flex-0 h-screen max-h-[calc(100vh-220px)]">
                                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 ">
                                    <div className="w-full flex justify-end">
                                        <MusicModeSelector activeMode={activeMode} onChange={setActiveMode} />
                                    </div>
                                    <SongGenresInput activeMode={activeMode} className={"w-full flex flex-col gap-3"} />
                                    {activeMode === MusicModeEnum.withLyrics && (
                                        <SongLyricsInput className={"w-full flex flex-col gap-3"} />
                                    )}
                                </div>
                                <CreateSongButton activeMode={activeMode} />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            )}
        </div>
    )
}

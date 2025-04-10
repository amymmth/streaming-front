import {useTrackCreation} from "./useTrackCreation.ts";
import {cn} from "shared/lib/utils.ts";
import {Loader2} from "lucide-react";
import styles from "./style.module.css";
import {useTracks} from "entities/music/track/hooks/use-track.ts";
import {useMusicStyles} from "entities/music/music-styles";
import {MusicModeEnum} from "features/music-generator/music-mode-selector";
import {useLyrics} from "entities/music/lyrics";
import {SongStatus} from "shared/api/types.ts";
import React, {useEffect, useState} from "react";
import {Toast} from "shared/ui/toast";
import {useReactiveVar} from "@apollo/client";
import {poetryGeneratingVar} from "features/music-generator/song-lyrics/hooks/usePoetryGenerate.ts";

export const CreateSongButton = ({activeMode}: { activeMode: MusicModeEnum }) => {
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpen, setToastOpen] = useState(false);

    const {createTrack, error} = useTrackCreation(
        (error) => {
            setToastOpen(false);
            setToastMessage(error);
        }
    );
    const [isLoading, setIsLoading] = useState(false);
    const {musicStyles} = useMusicStyles();
    const {lyrics} = useLyrics()
    const {tracks} = useTracks();

    useEffect(() => {
        setIsLoading(!error && !toastMessage && tracks.some((t) => t.status == SongStatus.Started));
    }, [tracks, error, toastMessage]);

    const disabled = activeMode === MusicModeEnum.withLyrics ? lyrics.length === 0 || musicStyles.length === 0 : musicStyles.length === 0


    const showToast = () => {
        setToastOpen(true);
    };

    const poetryGenerating = useReactiveVar(poetryGeneratingVar);

    return (
        <div className="w-full flex flex-col flex-0">
            {/* reset button */}
            <button
                className={
                    cn(styles.gradient,
                        "text-white px-5 py-3 rounded-md text-xl font-semibold text-center w-auto",
                        (disabled || isLoading || poetryGenerating) && "opacity-50 pointer-events-none"
                    )}
                onClick={() => {
                    createTrack(activeMode)
                    setIsLoading(true);
                    showToast();
                }}
                disabled={isLoading || poetryGenerating}
            >
                {isLoading ?
                    <div className={'flex items-center justify-center w-full'}>
                        <Loader2 size={30} className="animate-spin"/></div>
                    : 'Сгенерировать'
                }
            </button>


            <Toast
                open={toastOpen}
                onOpenChange={setToastOpen}
                description="Генерация займёт пару минут, песня появится последней в плейлисте. Пока идёт генерация,
                    послушайте композиции других пользователей"
                autoCloseDelay={7000}
                fullscreen={true}
                swipeDirection="down"

            />

            <Toast
                open={!!toastMessage}
                onOpenChange={(open) => {
                    if (!open) setToastMessage('');
                }}
                title={toastMessage}
                description={'Попробуйте еще раз'}
                swipeDirection="right"
                autoCloseDelay={7000}
            />

        </div>
    );
}
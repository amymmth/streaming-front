import { useEffect } from "react";
import {ImageGenerationStatusEnum, useGetSongByIdLazyQuery} from "shared/api/music-generation/combined.generated";
import { SongStatus } from "shared/api/music-generation/combined.generated";
import {Track, useTracks} from "entities/music/track";
import {usePlayingTrack} from "entities/music/music-player";

export const useTrackGeneration = (track:Track, onError?: (error: string) => void) => {
    const [getGenerationResult] = useGetSongByIdLazyQuery({
        fetchPolicy: 'network-only',
    });
    const { updateTrack } = useTracks();
    const { setPlayingTrack, onPlay, onPause } = usePlayingTrack();

    useEffect(() => {
        if (track.status === SongStatus.Finished) return;

        const intervalId = setInterval(async () => {
            const result = await getGenerationResult({
                variables: { id: track.id }
            });
            const generationResult = result?.data?.getSongById;

            if (generationResult?.imageUrl && track.coverUrl !== generationResult.imageUrl) {
                const updatedTrack = { ...track, coverUrl: generationResult.imageUrl as string }
                updateTrack(updatedTrack);
            }

            if (
                generationResult?.status === SongStatus.Censored
            ) {
                clearInterval(intervalId);
                if (onError) onError('Описание песни не соответствует политике безопасности');
            }

            if (
                result?.error
            ) {
                clearInterval(intervalId);
                if (onError) onError('Ошибка генерации песни');
            }

            if (
                generationResult?.status === SongStatus.Finished
                && generationResult?.imageGenerationStatus === ImageGenerationStatusEnum.Ready
                && generationResult?.mp3Url
                && generationResult?.imageUrl
            ) {
                clearInterval(intervalId);
                const updatedTrack = { ...track,
                    audioUrl: generationResult.mp3Url,
                    lyrics: generationResult.text || '',
                    coverUrl: generationResult.imageUrl,
                    genre: generationResult?.style || 'Неизвестный стиль',
                    status: SongStatus.Finished,
                    duration: generationResult?.duration || 0
                }
                updateTrack(updatedTrack);
                setPlayingTrack(updatedTrack);
                onPlay();
            }
        }, 1000);

        return () => clearInterval(intervalId);

    }, [track]);
};

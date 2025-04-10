import { useEffect } from "react";
import {ImageGenerationStatusEnum, useGetSongByIdLazyQuery} from "shared/api/music-generation/combined.generated";
import { SongStatus } from "shared/api/music-generation/combined.generated";
import {Track, useTracks} from "entities/music/track";
import {songGeneratingVar} from "entities/music/track/hooks/use-track.ts";

export const useTrackGeneration = (track:Track) => {
    const [getGenerationResult] = useGetSongByIdLazyQuery({
        fetchPolicy: 'network-only',
    });
    const { updateTrack } = useTracks();

    useEffect(() => {
        if (track.status !== 'Finished') {
            const intervalId = setInterval(async () => {
                const result = await getGenerationResult({
                    variables: { id: track.id }
                });
                const generationResult = result?.data?.getSongById;

                if (generationResult?.imageUrl) {
                    updateTrack({ ...track, coverUrl: generationResult.imageUrl as string });
                }

                if (generationResult?.mp3Url) {
                    updateTrack({ ...track, audioUrl: generationResult.mp3Url as string });
                }

                if (
                    generationResult?.status === SongStatus.Finished
                    && generationResult?.imageGenerationStatus === ImageGenerationStatusEnum.Ready
                    && generationResult?.mp3Url
                    && generationResult?.imageUrl
                ) {
                    clearInterval(intervalId);
                    updateTrack({ ...track,
                        audioUrl: generationResult.mp3Url,
                        lyrics: generationResult.text,
                        coverUrl: generationResult.imageUrl,
                        genre: generationResult?.style || 'Неизвестный стиль',
                        status: SongStatus.Finished
                    });
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [track, getGenerationResult, updateTrack]);
};

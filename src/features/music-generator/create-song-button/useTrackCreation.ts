import {Track, useTracks} from "entities/music/track";
import {useLyrics} from "entities/music/lyrics";
import {useMusicStyles} from "entities/music/music-styles";
import {SongStatus, useGenerateSongMutation} from "shared/api/music-generation/combined.generated";
import {GenerateSongInput} from "shared/api/types.ts";
import {useAuth} from "entities/music/auth";
import {MusicModeEnum} from "features/music-generator/music-mode-selector";

export const useTrackCreation = (onError?: (error: string) => void) => {
    const [generateSongMutation, {error, loading}] = useGenerateSongMutation();
    const {addTrack} = useTracks();
    const {lyrics} = useLyrics();
    const {musicStyles} = useMusicStyles();
    const {userId} = useAuth()


    const createTrack = (activeMode: MusicModeEnum) => {
        generateSongMutation({
                variables: {
                    input: {
                        songStyle: musicStyles,
                        userId: userId,
                        text: activeMode === MusicModeEnum.withLyrics ? lyrics : '',
                    } as GenerateSongInput
                }
            }
        ).then(({data}) => {
            const generateSong = data?.generateSong

            if (
                generateSong?.status === SongStatus.Censored
            ) {
                if (onError) onError('Описание песни не соответствует политике безопасности');
                return;
            }

            if (generateSong) {
                const newTrack: Track = {
                    id: generateSong.id,
                    title: generateSong.name,
                    genre: generateSong?.style || 'Неизвестный стиль',
                    coverUrl: generateSong?.imageUrl || '',
                    audioUrl: generateSong?.mp3Url || generateSong?.midiUrl || '',
                    lyrics: generateSong?.text || '',
                    createdAt: generateSong?.createdAt,
                    status: generateSong.status,
                    duration: generateSong?.duration || 0
                }
                addTrack(newTrack)
            }
        });
    };

    return {createTrack, loading, error}
}

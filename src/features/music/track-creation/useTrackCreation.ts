import {Track, useTracks} from "entities/music/track";
import {useLyrics} from "entities/music/lyrics";
import {useMusicStyles} from "entities/music/music-styles";
import {useGenerateSongMutation} from "shared/api/music-generation/combined.generated";
import {GenerateSongInput} from "shared/api/types.ts";
import {useAuth} from "entities/music/auth";
import {songGeneratingVar} from "entities/music/track/hooks/use-track.ts";

export const useTrackCreation = () => {
    const [generateSongMutation, { error, loading}] = useGenerateSongMutation();
    const {addTrack} = useTracks();
    const {lyrics} = useLyrics();
    const {musicStyles} = useMusicStyles();
    const {userId} = useAuth()


    const createTrack = () => {
        songGeneratingVar(true)
        generateSongMutation({
                variables: {
                    input: {
                        songStyle: musicStyles,
                        userId: userId,
                        text: lyrics
                    } as GenerateSongInput
                }
            }
        ).then(({data}) => {
            const generateSong = data?.generateSong

            if (generateSong) {
                const newTrack: Track = {
                    id: generateSong.id,
                    title: generateSong.name,
                    genre: generateSong?.style || 'Неизвестный стиль',
                    coverUrl: generateSong?.imageUrl || '',
                    audioUrl: generateSong?.mp3Url || generateSong?.midiUrl || '',
                    lyrics: generateSong?.text,
                    createdAt: generateSong?.createdAt,
                    status: generateSong.status,
                }
                addTrack(newTrack)
            }
        });
    };

    return {createTrack, loading, error}
}

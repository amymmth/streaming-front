import {Track} from "entities/music/track";
import {usePlayingTrack} from "entities/music/music-player";

export const useTrackPlayback = () => {
    const {playingTrack, setPlayingTrack, onPlay, onPause, isPlaying} = usePlayingTrack()

    const togglePlay = (track: Track | null) => {
        if (playingTrack?.id === track?.id) {
            if (isPlaying) {
                onPause()
            } else {
                onPlay()
            }
        } else {
            setPlayingTrack(track)
            onPlay()
        }
    }

    return {playingTrack, setPlayingTrack, togglePlay, isPlaying}
}

import {makeVar, useReactiveVar} from "@apollo/client";
import {Track} from "entities/music/track";

export const playingTrackVar = makeVar<Track | null>(null);
export const isPlayingVar = makeVar<boolean>(false);
const volumeVar = makeVar<number>(1);
const isMutedVar = makeVar<boolean>(false);


export const usePlayingTrack = (reactiveVar=playingTrackVar) => {
    const playingTrack = useReactiveVar(reactiveVar);
    const isPlaying = useReactiveVar(isPlayingVar);
    const volume = useReactiveVar(volumeVar);
    const isMuted = useReactiveVar(isMutedVar);

    const onPause = () => {
        isPlayingVar(false);
    }

    const onPlay = () => {
        isPlayingVar(true);
    }

    const setPlayingTrack = (track: Track | null) => {
        reactiveVar(track);
    }

    const setVolume = (value: number) => {
        volumeVar(Math.max(0, Math.min(value, 1)));
    }

    const setMuted = (muted: boolean) => {
        isMutedVar(muted);
    };


    return {
        playingTrack,
        isPlaying,
        onPause,
        onPlay,
        setPlayingTrack,
        setVolume,
        volume,
        isMuted,
        setMuted,
    }

};
export interface Intensities {
    bass: number;
    mid: number;
    treble: number;
    average: number;
}

export const audioIntensitiesVar = makeVar<Intensities>({
    bass: 0,
    mid: 0,
    average: 0,
    treble: 0
});

export const useAudioIntensities = (reactiveVar = audioIntensitiesVar) => {
    const audioIntensities = useReactiveVar(reactiveVar);

    const onChangeIntensities = (intensities: Intensities) => {
        reactiveVar(intensities);
    }

    return {
        onChangeIntensities,
        audioIntensities
    }

};
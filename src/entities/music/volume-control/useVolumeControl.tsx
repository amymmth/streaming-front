import {makeVar, useReactiveVar} from "@apollo/client";

export const VolumeControlVar = makeVar<{
    volume: number,
    isMuted: boolean,
}>({
    volume: 100,
    isMuted: false
});

export const useVolumeControl = (reactiveVar=VolumeControlVar) => {
    const {volume, isMuted} = useReactiveVar(reactiveVar);

    const setVolume = (value: number) => {
        reactiveVar({...reactiveVar(), volume: value});
    };

    const toggleMute = () => {
        reactiveVar({...reactiveVar(), isMuted: !isMuted});
    };

    return {volume, isMuted, setVolume, toggleMute};

}
import {makeVar, useReactiveVar} from "@apollo/client";

export const musicStylesVar = makeVar<string>("");


export const useMusicStyles = (reactiveVar=musicStylesVar) => {
    const musicStyles = useReactiveVar(reactiveVar);

    const setMusicStyles = (newMusicStyles: string) => {
        reactiveVar(newMusicStyles);
    }

    return { musicStyles, setMusicStyles }

};
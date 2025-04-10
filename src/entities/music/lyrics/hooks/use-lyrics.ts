import {makeVar, useReactiveVar} from "@apollo/client";

export const lyricsVar = makeVar<string>("");


export const useLyrics = (reactiveVar = lyricsVar) => {
    const lyrics = useReactiveVar(reactiveVar);

    const setLyrics = (newLyrics: string) => {
        reactiveVar(newLyrics);
    }

    return {lyrics, setLyrics}

};
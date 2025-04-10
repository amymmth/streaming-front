import {makeVar, useReactiveVar} from "@apollo/client";
import {Track} from "../model/track";
import {SortOrder, useGetSongsLazyQuery} from "shared/api/music-generation/combined.generated.tsx";
import {useEffect} from "react";
import {useAuth} from "entities/music/auth";
import {isPlayingVar, playingTrackVar} from "entities/music/music-player";

export const tracksVar = makeVar<Track[]>([]);
export const selectedTrackVar = makeVar<Track | null>(null);


export const useSelectedTrack = (selectedTrackReactiveVar = selectedTrackVar) => {
    const selectedTrack = useReactiveVar(selectedTrackReactiveVar);

    const selectTrack = (track: Track) => {
        selectedTrackReactiveVar(track);
    };

    const resetSelectedTrack = () => {
        selectedTrackReactiveVar(null);
    };

    return {
        selectedTrack,
        selectTrack,
        resetSelectedTrack,
    };
};


export const useTracks = (tracksReactiveVar = tracksVar) => {
    const tracks = useReactiveVar(tracksReactiveVar);

    const addTrack = (track: Track) => {
        const newTrack = {...track};
        tracksReactiveVar([...tracks, newTrack]);
    };

    const updateTrack = (track: Track) => {
        const index = tracks.findIndex((t) => t.id === track.id);
        if (index !== -1) {
            const newTracks = [...tracks];
            newTracks[index] = track;
            tracksReactiveVar(newTracks);
        }
    };

    const removeTrack = (trackId: string) => {
        tracksReactiveVar(tracks.filter((t) => t.id !== trackId));
    };

    return {
        tracks,
        addTrack,
        updateTrack,
        removeTrack,
    };
};


export const useInitializeTracks = (tracksReactiveVar = tracksVar) => {
    const {userId} = useAuth()

    const [getSongs, {called, loading}] = useGetSongsLazyQuery({
        variables: {
            input: {
                from: 0,
                take: 0,
                sortBy: SortOrder.CreatedAtDesc,
                userId: userId
            },
        },
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            const newTracks = [...(data.getSongs || [])]
                .reverse()
                .map(
                    (song) =>
                        ({
                            id: song.id,
                            title: song.name,
                            genre: song.style,
                            lyrics: song.text,
                            coverUrl: song.imageUrl,
                            audioUrl: song.mp3Url,
                            status: song.status,
                            duration: song?.duration || 0
                        } as Track)
                );
            tracksReactiveVar(newTracks);
            playingTrackVar(newTracks[newTracks.length - 1]);
            isPlayingVar(false);
        },
        onError: (error) => {
            console.error("Error fetching songs:", error);
        },
    });

    useEffect(() => {
        if (!called && !loading) {
            getSongs();
        }
    }, [called, loading, getSongs]);

    return {
        loading
    }

};
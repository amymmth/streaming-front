import {create} from 'zustand';
import {musicStations} from "./music-stations-list.ts";

export interface MusicStation {
    id: number;
    title: string;
    image: string;
    description: string;

    genre: string;
}

export interface MusicStationSettingsState {
    audioUrl?: string;
    m3u8Url?: string;
    tonality: number;
    bass: number;
    brightness: number;
    volume: number;
    isMuted: boolean;
    currentStation: MusicStation;
    stations: MusicStation[];

    loading: boolean;

    setVolume: (value: number) => void;
    toggleMute: () => void;

    onLoaded: () => void;

    setCurrentStation: (stationId: number) => void;

    setTonality: (value: number) => void;
    setBass: (value: number) => void;
    setBrightness: (value: number) => void;
}

export const useMusicStationStore = create<MusicStationSettingsState>((set, get) => ({
    tonality: -3,
    bass: 1,
    brightness: 4,
    volume: 100,
    isMuted: false,
    currentStation: musicStations[1],
    stations: musicStations,
    loading: false,

    setVolume: (value: number) => set({volume: value}),
    toggleMute: () => set((state) => ({isMuted: !state.isMuted})),

    onLoaded: () => {
        set({loading: false});
    },

    setCurrentStation: (stationId: number) => {
        set({currentStation: get().stations.find((station) => station.id === stationId) as MusicStation, loading: true});
    },


    setTonality: (value: number) => {
        set({tonality: value, loading: true});
    },

    setBass: (value: number) => {
        set({bass: value, loading: true});
    },

    setBrightness: (value: number) => {
        set({brightness: value, loading: true});
    },
}));

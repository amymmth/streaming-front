import {useMusicStationStore} from "entities/radio/music-station";
import {useSocket} from "app/providers/socket/socket-context.tsx";

export const useMusicSwitcher = () => {
    const {
        setCurrentStation,
        tonality,
        bass,
        brightness,
        stations,
        loading
    } = useMusicStationStore((state) => state);
    const {updateSession, isConnected} = useSocket();

    const onStationChange = (id: number) => {
        setCurrentStation(id);
        if (isConnected) updateSession({station: id, knobs: [tonality, bass, brightness]})
    }

    return {
        stations,
        loading,
        onStationChange,
    }
}
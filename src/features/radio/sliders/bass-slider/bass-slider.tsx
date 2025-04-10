import {FC} from 'react';
import {ControlSlider} from "../ui/control-slider";
import {useMusicStationStore} from "entities/radio/music-station";
import {useDebouncedCallback} from "use-debounce";
import {useSocket} from "app/providers/socket/socket-context.tsx";


export const BassSlider: FC = () => {
    const {currentStation:{id: station},
        setBass,
        brightness,
        bass,
        tonality
    } = useMusicStationStore((state) => state);
    const {updateSession} = useSocket()

    const debouncedUpdateSession = useDebouncedCallback(
        (station, knobs) => {
            updateSession({station, knobs});
        },
        300
    );
    const onChange = (value: number) => {
        setBass(value);
        debouncedUpdateSession(station, [value, tonality, brightness])
    };

    return (
        <ControlSlider
            value={bass}
            onChange={onChange}
            label="Шум"
            description="Меняйте фон композиции от мягкого шороха до напряжённого гула"
        />
    );
};

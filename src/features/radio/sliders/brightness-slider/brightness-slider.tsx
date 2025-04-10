import {FC} from "react";
import {ControlSlider} from "../ui/control-slider";
import {useMusicStationStore} from "entities/radio/music-station";
import {useDebouncedCallback} from "use-debounce";
import {useSocket} from "app/providers/socket/socket-context.tsx";

export const BrightnessSlider: FC = () => {
    const {
        currentStation: {id: station},
        setBrightness,
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
        setBrightness(value);
        debouncedUpdateSession(station, [bass, tonality, value])
    };

    return (
        <ControlSlider
            value={brightness}
            onChange={onChange}
            label="Эхо"
            description={`Регулируйте глубину пространства от сжатого до необъятного`}
        />
    );
};

import {FC} from 'react';
import {ControlSlider} from "../ui/control-slider";
import {useMusicStationStore} from "entities/radio/music-station";
import {useDebouncedCallback} from "use-debounce";
import {useSocket} from "app/providers/socket/socket-context.tsx";

export const TonalitySlider: FC = () => {
    const {
        currentStation: {id: station},
        setTonality,
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
        setTonality(value);
        debouncedUpdateSession(station, [bass, value, brightness])
    };

    return (
        <ControlSlider
            value={tonality}
            onChange={onChange}
            label="Эффект"
            description={`Задавайте новые ритмы от сплошного полотна до вкраплений отдельных нот`}
        />
    );
};

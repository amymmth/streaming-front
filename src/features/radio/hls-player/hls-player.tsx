import {FC, useEffect, useRef} from 'react';
import {HlsPlayer as ReactHlsPlayer} from "shared/ui/hls-player";
import {useMusicStationStore} from "entities/radio/music-station";

export const HlsPlayer: FC = () => {
    const ref = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const volume = useMusicStationStore((state) => state.volume);
    const isMuted = useMusicStationStore((state) => state.isMuted);
    const m3u8Url = useMusicStationStore((state) => state.m3u8Url);
    const audioUrl = useMusicStationStore((state) => state.audioUrl);
    const onLoaded = useMusicStationStore((state) => state.onLoaded);

    useEffect(() => {
        if (ref.current) {
            ref.current.volume = volume / 100;
        }
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);


    return (
        <>
            {m3u8Url && <ReactHlsPlayer
                src={m3u8Url || ''}
                autoPlay
                controls={false}
                style={{
                    position: 'absolute',
                    zIndex: -1,
                    opacity: 0,
                }}
                playerRef={ref}
                onError={(e) => console.error(e)}
                muted={isMuted}
                playsInline
                disablePictureInPicture
                onLoadedData={() => onLoaded()}
                {...{pip: 'false'}}

            />}

            {audioUrl && <audio
                src={audioUrl}
                autoPlay
                controls={false}
                style={{
                    position: 'absolute',
                    zIndex: -1,
                    opacity: 0,
                }}
                muted={isMuted}
                ref={audioRef}
                onLoadedData={() => onLoaded()}
            />}
        </>

    );
}

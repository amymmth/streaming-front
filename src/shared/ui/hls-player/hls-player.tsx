import React, {FC, RefObject, useEffect} from "react";
import Config from "hls.js";
import Hls from "hls.js";

declare const window: Window &
    typeof globalThis & {
    Hls: unknown
}

interface HlsPlayerProps
    extends React.VideoHTMLAttributes<HTMLVideoElement> {
    hlsConfig?: Config;
    playerRef: RefObject<HTMLVideoElement>;
    getHLSRef?: (hlsObj: Hls) => void;
    src: string;
}

export const HlsPlayer:FC<HlsPlayerProps> = (rest) => {
    const {
        hlsConfig,
        playerRef = React.createRef<HTMLVideoElement>(),
        getHLSRef,
        src,
        autoPlay,
        ...props
    } = rest;

    useEffect(() => {
        let hls: Hls;

        function _initPlayer() {
            if (hls != null) {
                hls.destroy();
            }

            window.Hls = Hls;

            const newHls = new Hls({
                enableWorker: false,
                ...hlsConfig,
            });

            if (getHLSRef) {
                getHLSRef(newHls);
            }

            if (playerRef.current != null) {
                newHls.attachMedia(playerRef.current);
            }

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                newHls.loadSource(src);

                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (autoPlay) {
                        playerRef?.current
                            ?.play()
                            .catch(() =>
                                console.log(
                                    'Невозможно выполнить автозапуск до взаимодействия пользователя с домом.'
                                )
                            );
                    }
                });
            });

            newHls.on(Hls.Events.ERROR, function (_event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError();
                            break;
                        default:
                            _initPlayer();
                            break;
                    }
                }
            });

            hls = newHls;
        }

        // Проверка поддержки источника мультимедиа
        if (Hls.isSupported()) {
            _initPlayer();
        }

        return () => {
            if (hls != null) {
                hls.destroy();
            }
        };
    }, [autoPlay, hlsConfig, playerRef, getHLSRef, src]);
    // Если источник мультимедиа поддерживается, используйте HLS.js для воспроизведения видео.
    if (Hls.isSupported()) return <video ref={playerRef} {...props} />;
    // Возврат к использованию обычного видеоплеера, если HLS по умолчанию поддерживается в браузере пользователя.
    return <video ref={playerRef} src={src} autoPlay={autoPlay} {...props} />;
};
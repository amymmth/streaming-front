import {useCallback, useEffect, useRef} from 'react';
import {useMusicStationStore} from "entities/radio/music-station";
import {MusicStationSwiper} from "features/radio/music-station-swiper";
import {VolumeControl} from "features/radio/volume-control";
import {Logo} from "shared/ui/symformer-logo";
import {MusicStationControls} from "widgets/radio/music-station-controls";
import PCMPlayer from 'pcm-player'
import {useNavigate} from "react-router-dom";
import {useSocket} from "app/providers/socket/socket-context.tsx";
import {Background3D} from "features/radio/background-3d";

export const RadioPage = () => {
    const navigate = useNavigate()
    const currentStation = useMusicStationStore((state) => state.currentStation);
    const tonality = useMusicStationStore((state) => state.tonality);
    const bass = useMusicStationStore((state) => state.bass);
    const brightness = useMusicStationStore((state) => state.brightness);
    const {createNewSession, closeConnection, chunk, isConnected} = useSocket();
    const {playAudio} = useAudioPlayer();
    const setVolume = useMusicStationStore((state) => state.setVolume);

    useEffect(() => {
        if (!isConnected) return;
        createNewSession({station: currentStation.id, knobs: [tonality, bass, brightness]});

    }, [isConnected]);

    useEffect(() => {
        return () => {
            closeConnection()
        }
    }, []);

    useEffect(() => {
        playAudio(chunk);
    }, [chunk, playAudio]);

    useEffect(() => {
        setVolume(100)
    }, [])

    return (
        <div className="min-h-screen text-white flex flex-col radio">
            <Background3D/>
            {/*Header*/}
            <header className="py-4 px-4 md:px-12 flex  w-full items-center justify-between m-auto ">
                <div onClick={() => navigate('/music-generator')}>
                    <Logo/>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center z-10 grow">

                {/* Music Station Swiper */}
                <div className={'px-4 grow w-full flex flex-col justify-center items-center'}>
                    <MusicStationSwiper/>
                </div>

                {/* Music Controls */}
                <div className={'flex w-full items-end justify-end'}>

                    <div className={'w-full flex items-center justify-center md:pl-[calc(44px+3rem)]'}>
                        <div className={'container mb-14 mt-9 w-full flex flex-col justify-end'}>
                            <MusicStationControls/>
                        </div>
                    </div>

                    <div className={'hidden md:flex h-72 pr-12 pb-12'}>
                        <VolumeControl vertical/>
                    </div>
                </div>

            </main>
        </div>
    )

};


export const useAudioPlayer = () => {
    const playerRef = useRef<PCMPlayer | null>(null);
    const volume = useMusicStationStore((state) => state.volume);
    const isMuted = useMusicStationStore((state) => state.isMuted);
    const {isLoading} =useSocket()

    useEffect(() => {
        playerRef.current = new PCMPlayer({
            inputCodec: 'Int16',
            channels: 2,
            sampleRate: 44100,
            flushTime: 50,
            fftSize: 2048,
        });
        playerRef.current.volume(volume / 100);

        return () => {
            playerRef.current?.destroy();
        };
    }, [isLoading]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.volume(volume / 100);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isMuted ? playerRef.current.volume(0) : playerRef.current.volume(volume / 100);
        }
    }, [volume, isMuted]);

    const playAudio = useCallback((pcmData?: ArrayBuffer) => {
        if (!playerRef.current || !pcmData) return;
        playerRef.current?.feed(pcmData);
    }, [playerRef]);

    return {playAudio};
};


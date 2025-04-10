import {usePlayingTrack} from "entities/music/music-player";
import {useEffect, useState} from "react";
import {Button} from "shared/ui/button.tsx";
import {TrackNextIcon, TrackPreviousIcon} from "@radix-ui/react-icons";
import {Loader2, PauseIcon, PlayIcon, Volume2Icon, VolumeIcon} from "lucide-react";
import {useTracks} from "entities/music/track";
import {Slider} from "shared/ui/slider.tsx";
import {AudioPlayer} from "features/music/music-player/ui/audio-player.tsx";

const formatTime = (currentTime: number) => new Date(currentTime * 1000).toISOString().substr(11, 8).slice(3);

export const MusicPlayer = () => {
    const {tracks} = useTracks();
    const {
        playingTrack,
        isPlaying,
        onPause,
        onPlay,
        setPlayingTrack,
        volume,
        setVolume,
        isMuted,
        setMuted
    } = usePlayingTrack();
    const playingTrackIndex = tracks.findIndex(track => track.id === playingTrack?.id);
    const [url, setUrl] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);


    useEffect(() => {
        if (playingTrack?.audioUrl) {
            setUrl(playingTrack.audioUrl);
        }
    }, [playingTrack]);

    const handlePreviousTrack = () => {
        setPlayingTrack(tracks[playingTrackIndex + 1]);
    };

    const handleNextTrack = () => {
        setPlayingTrack(tracks[playingTrackIndex - 1]);
    };

    const handleTimeUpdate = (currentTime: number) => {
        setCurrentTime(currentTime)
    };
    const handleDurationChange = (duration: number) => {
        setDuration(duration)
    };

    const togglePlay = () => {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
    };

    if (!playingTrack) {
        return null;
    }


    return (
        <>
            <AudioPlayer
                key={playingTrack.id}
                url={url}
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
                onChangeAudioData={() => {}}
            />

            <div className={'grid grid-cols-3 grid-rows-1 items-center gap-4  p-2'}>
                <div className={'flex items-center'}>

                    <img
                        src={playingTrack?.coverUrl}
                        alt={playingTrack?.title}
                        className={'rounded-lg object-cover w-14 h-14 mr-5'}
                    />

                    <div className={'flex flex-col min-w-0'}>
                        <div className={'truncate text-ellipsis min-w-0'}>{playingTrack?.title}</div>
                        <div style={{
                            fontSize: '0.8rem',
                            opacity: '0.7'
                        }}>
                            {formatTime(currentTime) || '--:--'} / {duration ? formatTime(duration) : '--:--'}
                        </div>
                    </div>
                </div>

                <div className={'flex items-center justify-center gap-4'}>
                    <Button
                        className={'rounded-full p-3'}
                        variant={'ghost'}
                        size={'icon'}
                        onClick={handlePreviousTrack}
                        disabled={playingTrackIndex === tracks.length - 1}
                    >
                        <TrackPreviousIcon/>
                    </Button>
                    <Button
                        className={'rounded-full p-4'}
                        variant={'ghost'}
                        size={'icon'}
                        onClick={togglePlay}
                        disabled={playingTrack.status !== 'Finished'}
                    >
                        {!isPlaying ? <PlayIcon/> : <PauseIcon/>}
                    </Button>
                    <Button
                        className={'rounded-full p-3'}
                        variant={'ghost'}
                        size={'icon'}
                        onClick={handleNextTrack}
                        disabled={playingTrackIndex === 0}
                    >
                        <TrackNextIcon/>
                    </Button>
                </div>

                <div className={'flex items-center justify-end pr-4 gap-4'}>
                    <div onClick={() => setMuted(!isMuted)}>
                        {isMuted ? <VolumeIcon size={25} style={{opacity: '0.5'}}/> : <Volume2Icon size={25}/>}
                    </div>
                    <Slider
                        max={100}
                        step={1}
                        min={0}
                        onValueChange={([value]) => setVolume(value / 100)}
                        value={[Math.round(volume * 100)]}
                        className={'w-24'}
                    />
                </div>


            </div>
        </>
    );
};
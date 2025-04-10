import {FC, useEffect, useState} from "react";
import {useTracks} from "entities/music/track";
import {usePlayingTrack} from "entities/music/music-player";
import {cn} from "shared/lib/utils.ts";
import {AudioPlayer} from "./audio-player.tsx";
import {styles} from "./styles";
import {Button} from "shared/ui/button.tsx";
import {Loader2, Pause, Play, SkipBack, SkipForward} from "lucide-react";
import {Intensities} from "./models/intensities.model.ts";
import {SongStatus} from "shared/api/types.ts";

interface MusicPlayerControlsProps {
    onChangeIntensities: (intensities: Intensities) => void
    className?: string
}

export const MusicPlayerControls: FC<MusicPlayerControlsProps> = ({onChangeIntensities, className}) => {

    const {tracks} = useTracks();
    const {
        playingTrack,
        isPlaying,
        onPause,
        onPlay,
        setPlayingTrack,
    } = usePlayingTrack();
    const playingTrackIndex = tracks?.filter(
        t=> t?.status === SongStatus.Finished
    )?.findIndex(track => track.id === playingTrack?.id);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (playingTrack?.audioUrl && playingTrack?.id) {
            setUrl(playingTrack.audioUrl);
        } else {
            setUrl('')
        }
    }, [playingTrack?.id, playingTrack?.audioUrl]);


    const handleNextTrack = () => {
        const nextIndex = playingTrackIndex + 1;
        const filteredTracks = tracks?.filter(
            t=> t?.status === SongStatus.Finished
        )
        setPlayingTrack(filteredTracks[nextIndex >= filteredTracks.length ? 0 : nextIndex]);
    };

    const handlePreviousTrack = () => {
        const prevIndex = playingTrackIndex - 1;
        const filteredTracks = tracks?.filter(
            t=> t?.status === SongStatus.Finished
        )
        setPlayingTrack(filteredTracks[prevIndex < 0 ? filteredTracks.length - 1 : prevIndex]);
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

    const loading = (playingTrack?.status !== SongStatus.Finished)

    return (
        <div className={cn(className)}>
            {<AudioPlayer
                key={playingTrack.id}
                url={url}
                // url={'placeholder.mp3'}
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
                onChangeIntensities={onChangeIntensities}
                duration={playingTrack.duration}
                onEnd={handleNextTrack}
            />}

            <div className={styles.footer}>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/80 hover:text-white hover:bg-white/10"
                        onClick={handlePreviousTrack}
                        disabled={tracks.length === 1}
                    >
                        <SkipBack className="h-6 w-6"/>
                    </Button>

                    <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        onClick={() => {
                            if (loading) return;
                            togglePlay()
                        }}
                    >
                        {loading && <Loader2 className="animate-spin h-6 w-6"/>}
                        {!loading && (isPlaying ? <Pause className="h-6 w-6"/> : <Play className="h-6 w-6 ml-1"/>)}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/80 hover:text-white hover:bg-white/10"
                        onClick={handleNextTrack}
                        disabled={tracks.length === 1}
                    >
                        <SkipForward className="h-6 w-6"/>
                    </Button>
                </div>
            </div>

        </div>
    );
};
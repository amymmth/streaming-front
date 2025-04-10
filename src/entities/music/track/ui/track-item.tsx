import {cn} from "shared/lib/utils.ts";
import {TrackPlaybackButton} from "features/music/track-playback/ui.tsx";
import {Track, useTracks} from "entities/music/track";
import {useTrackGeneration} from "features/music/track-creation/useTrackGeneration.ts";
import {useSelectedTrack} from "entities/music/track/hooks/use-track.ts";

interface TrackItemProps {
    track: Track;
}

export const TrackItem = ({track}: TrackItemProps) => {
    const {selectedTrack, selectTrack} = useSelectedTrack();
    const isSelected = selectedTrack?.id === track.id;
    useTrackGeneration(track);

    return (
        <div
            key={track.id}
            className={cn(
                "w-full flex items-center justify-between px-3 py-1 cursor-pointer bg-transparent bg-opacity-30 transition-all backdrop-blur-sm duration-200",
                isSelected ? "bg-stone-800" : "bg-transparent"
            )}
            onClick={() => selectTrack(track)}
        >
            <div className={'flex items-center gap-4 flex-shrink min-w-0'}>
                <TrackPlaybackButton track={track}/>
                <div className="flex flex-col flex-shrink min-w-0">
                    <span className="text-sm font-semibold truncate text-ellipsis min-w-0">{track.title}</span>
                    <span className="text-sm text-stone-400 truncate text-ellipsis min-w-0">{track.genre}</span>
                </div>
            </div>

        </div>
    );
};
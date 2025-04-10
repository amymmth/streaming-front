import {ScrollArea} from "shared/ui/scroll-area.tsx";
import {TrackItem, useTracks} from "entities/music/track";
import {usePlayingTrack} from "entities/music/music-player";


export const TrackList = () => {
    const {tracks} = useTracks()
    const {playingTrack} = usePlayingTrack()

    return (
        <>
            <div className={'sticky top-0  p-3 pb-0 '}>
                <h2 id="track-list-title" className="text-md font-semibold ">
                    Список песен
                </h2>
            </div>
            <ScrollArea className={'w-full h-full mt-4'}>
                <div
                    className={`flex flex-col-reverse gap-0 w-full  overflow-y-auto ${playingTrack ? 'pb-[120px]' : ''} ${(playingTrack && tracks.length < 7) ? ' h-[calc(100%+110px)]' : 'h-full'}`}>
                    {tracks.map(track => (
                        <TrackItem
                            key={track.id}
                            track={track}
                        />
                    ))}
                </div>
            </ScrollArea>
        </>
    )
}


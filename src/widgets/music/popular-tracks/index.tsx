import React, {useState} from "react";
import {Track, useTracks} from "entities/music/track";
import {useTrackPlayback} from "features/music/track-playback/model.ts";
import {Button} from "shared/ui/button.tsx";
import {Pause, Play} from "lucide-react";
import {ScrollArea} from "shared/ui/scroll-area.tsx";
import {styled} from "@linaria/react";

export const PopularTracks = () => {
    const {tracks} = useTracks();

    return (
        <div className="w-full mt-2">
            <div className={'mb-4'}>
                <h2 className="text-xs font-semibold text-stone-400">
                    Популярные песни
                </h2>
            </div>

            <ScrollArea orientation={'horizontal'} type={'hover'} >
                <div className="flex gap-6 pb-2">
                    {[...tracks].slice(0, 10)
                        .sort((a, b) => b.likes - a.likes)
                        .map((track, index) => (
                            <PopularTrackCard
                                key={index}
                                track={track}
                                index={index+1}
                            />
                        ))}
                </div>
            </ScrollArea>
        </div>
    );
};


interface PopularTrackCardProps {
    track: Track;
    index: number;
}

export const PopularTrackCard: React.FC<PopularTrackCardProps> = ({track, index,}) => {
    const { playingTrack, togglePlay, isPlaying } = useTrackPlayback()
    const [isHovered, setIsHovered] = useState(false);


    return (
        <Button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={'w-60 h-28 flex-shrink-0 rounded-lg overflow-hidden relative bg-stone-800 hover:bg-background text-white'}
            onClick={() => togglePlay(track)}
        >
            <div className="px-2 py-1 absolute z-10 flex flex-col justify-end text-left w-full h-full">
                <p className="text-xs text-stone-200">#{index}</p>
                <h3 className="text-sm font-bold truncate text-ellipsis">{track.title}</h3>
            </div>

            <div
                className={'opacity-50 absolute inset-0'}
                style={{
                    background: `url(${track.coverUrl}) no-repeat center center / 100%`,
                }}
            />

            <Icon>
                {playingTrack?.id === track?.id && isPlaying ? (
                    isHovered ? (
                        <Pause />
                    ) : (
                        <AnimationBars>
                            <Bar />
                            <Bar />
                            <Bar />
                        </AnimationBars>
                    )
                ) : (
                    <Play />
                )}
            </Icon>
        </Button>
    );
};

const Icon = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AnimationBars = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
    justify-content: center;
`;

const Bar = styled.span`
    width: 4px;
    height: 12px;
    background-color: white;
    animation: bounce 1s infinite ease-in-out;

    &:nth-child(1) {
        animation-delay: -0.2s;
    }
    &:nth-child(2) {
        animation-delay: -0.1s;
    }
    &:nth-child(3) {
        animation-delay: 0s;
    }
    
    @keyframes bounce {
        0%, 40%, 100% {
            transform: scaleY(1);
        }
        20% {
            transform: scaleY(1.8);
        }
    }
`;

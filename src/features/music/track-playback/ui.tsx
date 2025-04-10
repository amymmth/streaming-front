import { Play, Pause, Loader2  } from "lucide-react";
import { Button } from "shared/ui/button";
import { useTrackPlayback } from "./model";
import { Track } from "entities/music/track";
import { useState } from "react";
import { styled } from "@linaria/react";
import {css} from "@linaria/core";

export const TrackPlaybackButton = ({ track }: { track: Track }) => {
    const { playingTrack, togglePlay, isPlaying } = useTrackPlayback();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => track.status === 'Finished' && togglePlay(track)}
            className={buttonStyle}
        >
            <Icon>
                {track.status !== 'Finished' ? (
                    <Loader2 className="animate-spin" />
                ) : playingTrack?.id === track?.id && isPlaying ? (
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
            <div className={'cover-image'} style={{ backgroundImage: `url(${track.coverUrl})` }} />
        </Button>
    );
};


const buttonStyle = css`
    background-color: var(--background) !important;
    color: white;
    height: 4rem;
    width: 4rem;
    position: relative;
    overflow: hidden;

    &:hover .cover-image{
        opacity: 0.6;
    }
    
    .cover-image {
        opacity: 0.7;
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        z-index: 0;
        transition: opacity 0.3s ease;
    }
    
`;

const Icon = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
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


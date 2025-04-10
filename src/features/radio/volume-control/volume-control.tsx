import React from 'react';
import VolumeHigh from './assets/volume-high.svg?react';
import VolumeLow from './assets/volume-low.svg?react';
import VolumeMute from './assets/volume-mute.svg?react';
import clsx from "clsx";
import {useMusicStationStore} from "entities/radio/music-station";
import {styled} from "@linaria/react";
import RcSlider from "rc-slider";

const Slider = styled(RcSlider)`
    width: 100%;
    height: 100%;
    position: relative;

    .rc-slider-handle {
        border-radius: 1.25rem;
        border-color: transparent;
        opacity: 0;
        box-shadow: none;
    }

    .rc-slider-handle.rc-slider-handle-dragging {
        box-shadow: none;
        border-color: transparent;
    }

    .rc-slider-rail {
        border-radius: 1.25rem;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .rc-slider-track {
        border-radius: 1.25rem;
    }

`;


export const VolumeControl: React.FC<{ vertical?: boolean }> = ({vertical}) => {
    const isMuted = useMusicStationStore((state) => state.isMuted);
    const toggleMute = useMusicStationStore((state) => state.toggleMute);
    const volume = useMusicStationStore((state) => state.volume);
    const setVolume = useMusicStationStore((state) => state.setVolume);


    return (
        <div className={'h-full flex items-center gap-2 flex-col'}>
            <span className={clsx(`text-sm  min-w-11 `,
                vertical ? 'text-center' : 'text-right'
            )}>
                {`${isMuted ? 0 : volume}%`}
            </span>
            <div
                className={clsx(
                    "flex  items-center rounded-3xl h-full",
                    "text-gray-300  hover:text-white transition-all duration-200",
                    "bg-gray-400  bg-opacity-30 backdrop-filter backdrop-blur hover:bg-opacity-40",
                    vertical ? "flex-col-reverse py-4 gap-6 px-2 justify-center" : "flex-row  px-4 py-1 gap-4 justify-between"
                )}
            >
                <button
                    className="p-1  text-inherit relative z-10 "
                    onClick={toggleMute}
                >
                    {
                        isMuted || volume === 0
                            ? <VolumeMute className={'w-5 text-gray-400'}/>
                            : volume >= 50 ? <VolumeHigh className={'w-5 '}/> : <VolumeLow className={'w-5 '}/>
                    }
                </button>
                <Slider
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={(value) => setVolume(value as number)}
                    className={clsx(
                        "flex-grow overflow-hidden",
                        vertical ? "w-3 h-full" : "w-full h-3",
                    )}

                    vertical={vertical}
                    classNames={{
                        rail: clsx('bg-gray-400 bg-opacity-30',
                            vertical ? '!w-full !left-0 !right-0' : '!top-0 !bottom-0 !h-full',
                        ),
                        track: clsx(
                            'bg-white ',
                            vertical ? '!w-[calc(100%-4px)] !left-[2px] !right-0' : '!top-[2px] !bottom-0 !h-[calc(100%-4px)]',
                        ),
                        handle: clsx(
                            'transform !m-0',
                            vertical ?
                                '!h-[400%] !w-full !-translate-x-1/2 !translate-y-[75%]' :
                                '!w-[400%] !h-full !-translate-y-1/2 !-translate-x-[50%]'
                        )
                    }}
                    style={{
                        cursor: 'pointer',
                        transition: 'width 0.2s ease-in-out',
                        marginLeft: '0',
                        ...(vertical ? {height: '90px'} : {width: '90px'}),
                    }}
                />
            </div>
        </div>
    );
};

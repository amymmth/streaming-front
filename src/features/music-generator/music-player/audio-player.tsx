import * as React from 'react';
import {FC, useEffect, useRef, useState} from 'react';
import {Intensities} from "./models/intensities.model.ts";
import {useAudioAnalyzer} from "features/music/music-player/ui/audio-player.tsx";
import {formatTime} from "shared/lib/utils.ts";
import RcSlider from "rc-slider";
import {styled} from "@linaria/react";
import {useVolumeControl} from "entities/music/volume-control/useVolumeControl.tsx";


interface AudioPlayerProps {
    url: string;
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    onChangeIntensities: (intensities: Intensities) => void
    duration: number
    onEnd: () => void
}

const Slider = styled(RcSlider)`
    width: 100%;
    height: 20px;

    &.rc-slider {
        height: 20px;
    }

    .rc-slider-handle {
        width: 50px;
        height: 30px;
        border-radius: 0;
        border-color: transparent;
        opacity: 0;
        margin-top: -13px;
        //background: transparent;
        box-shadow: none;
    }

    .rc-slider-handle.rc-slider-handle-dragging {
        box-shadow: none;
        border-color: transparent;
    }

    .rc-slider-rail {
        border-radius: 0;
        height: 20px;
        margin-top: -5px;
        background-color: rgb(36, 36, 36);
    }

    .rc-slider-track {
        border-radius: 0;
        height: 20px;
        margin-top: -5px;
        background-color: rgb(159, 101, 209);
    }

`;

export const AudioPlayer: FC<AudioPlayerProps> = (props: AudioPlayerProps) => {
    const {url, isPlaying, onPlay, onPause, onChangeIntensities, duration, onEnd} = props;
    const {isMuted, volume,} = useVolumeControl();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [stoppedAnalyzer, setStoppedAnalyzer] = useState(false);

    const intensities = useAudioAnalyzer(audioRef.current, isPlaying);

    useEffect(() => {
        if (!intensities) return;

        const isStop = Object.values(intensities).every((value) => value === 0);
        if (!isStop && stoppedAnalyzer) {
            setStoppedAnalyzer(false);
        }

        if (!stoppedAnalyzer) {
            const newIntensities = isStop
                ? Object.keys(intensities).reduce((acc, key) => {
                    acc[key as keyof Intensities] = 0;
                    return acc;
                }, {} as Intensities)
                : intensities;

            onChangeIntensities(newIntensities);
            if (isStop) setStoppedAnalyzer(true);
        }
    }, [intensities, stoppedAnalyzer, onChangeIntensities]);

    // Обновление текущего времени и вызов onTimeUpdate на каждом кадре
    const updateProgress = () => {
        if (audioRef.current) {
            const targetTime = audioRef.current.currentTime;
            setCurrentTime(targetTime);
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    };

    // Управление воспроизведением
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().then(onPlay).catch((error) => console.error('Play error:', error));
                animationFrameRef.current = requestAnimationFrame(updateProgress); // Запускаем обновление прогресса
            } else {
                audioRef.current.pause();
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current); // Останавливаем обновление прогресса
                }
            }
        }
    }, [isPlaying]);

    // Установка громкости
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    // Установка mute
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Установка продолжительности трека после его загрузки
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.play().then(onPlay).catch((error) => console.error('Play error:', error));
        }
    };

    // Обновление прогресса при перемотке слайдера
    const handleSliderChange = (value: number) => {
        setCurrentTime(value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
        }
    };

    // Обновление продолжительности и очистка анимации при завершении трека
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('ended', () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                setCurrentTime(0);
                onEnd()
            });
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);


    return (
        <div className="flex items-center relative z-10">
            <audio
                ref={audioRef}
                src={url}
                onLoadedMetadata={handleLoadedMetadata}
                style={{display: 'none'}}
                crossOrigin="anonymous"
            />

            {/* Слайдер для управления воспроизведением */}
            {/*<input*/}
            {/*    type="range"*/}
            {/*    min="0"*/}
            {/*    max={duration.toString()}*/}
            {/*    value={currentTime}*/}
            {/*    onChange={handleSliderChange}*/}
            {/*    step="0.1"*/}
            {/*    className={styles.slider}*/}
            {/*/>*/}
            <Slider
                min={0}
                max={duration}
                value={currentTime}
                onChange={(value) => handleSliderChange(value as number)}
            />

            <div
                className="flex justify-between text-sm text-white/80 absolute inset-0 px-2 items-center select-none pointer-events-none">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : '--:--'}</span>
            </div>
        </div>
    );
};




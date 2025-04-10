import {useEffect, useRef, useState} from "react";
import {Intensities} from "./intensities.model.ts";

interface UseAudioAnalyzerOptions {
    fftSize?: number; // Размер FFT (по умолчанию 2048)
}

/**
 * Хук для работы с Web Audio API и анализа аудиоданных.
 * Возвращает данные интенсивности для баса, средних, высоких частот и общего уровня.
 * @param audioElement HTMLAudioElement для анализа.
 * @param options Настройки анализатора.
 * @returns Объект с данными частотных интенсивностей.
 */
export const useAudioAnalyzer = (
    audioElement: HTMLAudioElement | null,
    options: UseAudioAnalyzerOptions = {}
) => {
    const {fftSize = 2048} = options;

    const [intensities, setIntensities] = useState<Intensities>({
        bass: 0,
        mid: 0,
        treble: 0,
        average: 0,
    });

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isAudioReady, setAudioReady] = useState(false);

    useEffect(() => {
        if (!audioElement) {
            return;
        }

        // Инициализация AudioContext и AnalyserNode
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyserNode = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioElement);

        // Подключение цепочки: audio -> analyser -> output
        source.connect(analyserNode);
        analyserNode.connect(audioContext.destination);

        // Настройка AnalyserNode
        analyserNode.fftSize = fftSize;
        const bufferLength = analyserNode.frequencyBinCount; // Половина fftSize
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        analyserRef.current = analyserNode;
        audioContextRef.current = audioContext;

        setAudioReady(true);

        return () => {
            // Очистка ресурсов
            if (audioContextRef.current) {
                console.log('Очистка ресурсов')
                audioContextRef.current.close();
                audioContextRef.current = null;
                setAudioReady(false);
            }
        };
    }, [audioElement, fftSize]);

    useEffect(() => {
        if (!isAudioReady || !analyserRef.current || !dataArrayRef.current) return;

        // Функция для расчета средней интенсивности в диапазоне
        const getAverageIntensity = (dataArray: Uint8Array, start: number, end: number): number => {
            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += dataArray[i];
            }
            return sum / (end - start) / 255; // Нормализация в диапазон 0-1
        };

        // Обновление данных в анимационном цикле
        const updateAudioData = () => {
            const analyser = analyserRef.current!;
            const dataArray = dataArrayRef.current!;

            analyser.getByteFrequencyData(dataArray);

            const bufferLength = analyser.frequencyBinCount;
            const bassEnd = Math.floor(bufferLength * 0.1); // 10% для низких частот
            const midEnd = Math.floor(bufferLength * 0.5);  // 50% для средних частот

            const bassIntensity = getAverageIntensity(dataArray, 0, bassEnd);
            const midIntensity = getAverageIntensity(dataArray, bassEnd, midEnd);
            const trebleIntensity = getAverageIntensity(dataArray, midEnd, bufferLength);
            const averageIntensity = getAverageIntensity(dataArray, 0, bufferLength);

            setIntensities({
                bass: bassIntensity,
                mid: midIntensity,
                treble: trebleIntensity,
                average: averageIntensity,
            });

            animationFrameRef.current = requestAnimationFrame(updateAudioData);
        };

        animationFrameRef.current = requestAnimationFrame(updateAudioData);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isAudioReady]);

    return intensities;
};

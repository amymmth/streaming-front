import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Canvas} from "@react-three/fiber";
import {Blob} from "./ui/blob";
import {usePalette} from "color-thief-react";
import {getBrightness, hexToColor} from "./lib/color-helpers";
import {usePlayingTrack} from "entities/music/music-player";
import {Intensities} from "entities/music/music-player/hooks/use-playing-track.ts";
import {
    BackgroundGradient
} from "features/music-generator/background-3d/ui/background-gradient/background-gradient.tsx";

const BLACK_COLOR = '#050000';


export const Background3D = React.memo(({intensities}: { intensities: Intensities }) => {
    const {playingTrack, isPlaying} = usePlayingTrack();
    const src = playingTrack?.id ? `${import.meta.env.VITE_MUSIC_GENERATION_API_URL}/song-image-file/${playingTrack?.id}` : '';

    const [imageUrl, setImageUrl] = useState<string| null>(null);

    const {data} = usePalette(imageUrl || src, 6, 'hex', {quality: 1});

    useEffect(() => {
        if (src) {
            fetch(src)
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                })
                .catch(err => {
                    console.error('Ошибка загрузки изображения:', err)
                    setImageUrl(null)
                });
        }
    }, [src]);


    const previousColorsRef = useRef({
        color1: hexToColor(BLACK_COLOR),
        color2: hexToColor('#572957'),
        color3: hexToColor('#b8a2c3'),
        color4: hexToColor('#9296d8'),
        color5: hexToColor('#7373f2'),
        color6: hexToColor('#541d2b'),
        color7: hexToColor('#4c4351'),
        color8: hexToColor('#8181da'),
        color9: hexToColor(BLACK_COLOR),
    });

    // Вычисляем цвета
    const colors = useMemo(() => {
        if (!data) {
            return previousColorsRef.current;
        }
        const colorObjects = data.map(hexToColor).sort((a, b) => getBrightness(b) - getBrightness(a));

        previousColorsRef.current = {
            color1: hexToColor(BLACK_COLOR),
            color2: colorObjects[0],
            color3: colorObjects[1],
            color4: colorObjects[2],
            color5: colorObjects[2],
            color6: colorObjects[3],
            color7: colorObjects[4],
            color8: colorObjects[2],
            color9: hexToColor(BLACK_COLOR),
        };

        return previousColorsRef.current;
    }, [data]);


    return (
        <>
            <div className={'w-full h-screen fixed top-0 right-0 -z-10'}>
                <div
                    className={'w-full  absolute top-0 left-0 z-[1]'}
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        transition: 'opacity .5s ease-in-out',

                        filter: 'blur(10px)',
                    }}
                >
                    <Canvas
                        camera={{position: [0, 0, 4], fov: 40, near: 0.01, far: 1000}}>
                        <directionalLight position={[5, 5, 5]} intensity={1}/>
                        <fog attach="fog" args={['white', 50, 190]}/>
                        <pointLight distance={100} intensity={4} color="white"/>
                        <ambientLight intensity={Math.PI}/>
                        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow/>
                        <Blob
                            colors={colors}
                            isLoading={false}
                            bassIntensity={intensities.mid}
                            isPlaying={isPlaying}
                        />
                        <BackgroundGradient
                            colors={colors}
                            intensity={intensities.bass}
                            isPlaying={isPlaying}
                        />
                    </Canvas>
                </div>
            </div>
        </>
    );
});

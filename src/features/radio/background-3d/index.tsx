import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Canvas} from "@react-three/fiber";
import {Blob} from "./ui/blob";
import {usePalette} from "color-thief-react";
import {useMusicStationStore} from "entities/radio/music-station";
import {colorToRgba, getBrightness, hexToColor} from "./lib/color-helpers";
import {useSocket} from "app/providers/socket/socket-context.tsx";
import {BackgroundGradient} from "features/radio/background-3d/ui/background-gradient/background-gradient.tsx";

const BLACK_COLOR = '#101115';

export const Background3D: React.FC = () => {
    const {isLoading} = useSocket();
    const currentStation = useMusicStationStore((state) => state.currentStation);
    const src = currentStation?.image;
    const {data} = usePalette(src, 6, 'hex', {quality: 1});
    const [showCanvas, setShowCanvas] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [canvasRendered, setCanvasRendered] = useState(false);

    // Store the previous color set
    const previousColorsRef = useRef({
        color1: hexToColor(BLACK_COLOR),
        color2: hexToColor(BLACK_COLOR),
        color3: hexToColor(BLACK_COLOR),
        color4: hexToColor(BLACK_COLOR),
        color5: hexToColor(BLACK_COLOR),
        color6: hexToColor(BLACK_COLOR),
    });

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
        };

        return previousColorsRef.current;
    }, [data]);

    useEffect(() => {
        if (canvasRef.current && !isLoading) {
            setShowCanvas(true);
            const timeoutId = setTimeout(() => setShowCanvas(false), 500);
            return () => clearTimeout(timeoutId);
        }
    }, [src, isLoading]);

    return (
        <>

            <div
                className={`w-screen h-screen fixed top-0 left-0 z-50 transition-opacity duration-300 ease-in-out ${
                    canvasRendered ? 'opacity-0 -z-10 pointer-events-none' : 'opacity-100'
                }`}
                style={{
                    backgroundColor: BLACK_COLOR,
                }}
            />
            <div className={'w-screen h-screen fixed top-0 left-0 -z-10'}>


                <div
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        transition: 'opacity .5s ease-in-out',
                        filter: 'blur(20px)',
                    }}
                >
                    <Canvas
                        linear
                        dpr={[1, 2]}
                        eventPrefix="client"
                        camera={{position: [0, 0, 4], fov: 40, near: 0.01, far: 1000}}
                    >
                        <fog attach="fog" args={['white', 50, 190]}/>
                        <pointLight distance={100} intensity={4} color="white"/>
                        <ambientLight intensity={Math.PI}/>
                        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow/>
                        <BackgroundGradient intensity={0.1} isPlaying={true} colors={colors}/>
                    </Canvas>
                </div>

                <div
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        opacity: showCanvas || isLoading ? .4 : .8,
                        transition: 'opacity .5s ease-in-out',
                        filter: 'blur(20px)',
                    }}
                >
                    <Canvas
                        linear
                        dpr={[1, 2]}
                        className={'animate-pulse'}
                        eventPrefix="client"
                        camera={{position: [0, 0, 4], fov: 40, near: 0.01, far: 1000}}
                        onCreated={() => {
                            console.log("Canvas отрисован");
                            setCanvasRendered(true);
                        }}
                    >
                        <fog attach="fog" args={['white', 50, 190]}/>
                        <pointLight distance={100} intensity={4} color="white"/>
                        <ambientLight intensity={Math.PI}/>
                        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow/>
                        <Blob colors={colors} isLoading={false}/>
                    </Canvas>
                </div>
                <div
                    className={'w-screen h-screen absolute top-0 left-0 z-[1] bg-black bg-opacity-10'}
                    style={{
                        backdropFilter: 'blur(40px)',
                    }}
                />
            </div>
        </>
    );
};

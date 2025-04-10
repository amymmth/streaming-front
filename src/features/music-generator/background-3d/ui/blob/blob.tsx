import {FC, Suspense, useEffect, useMemo, useRef} from "react";
import vertexShader from "../../lib/shaders/vertex-shader.glsl";
import fShader from "../../lib/shaders/fragment-shader.glsl";
import snoise from "../../lib/shaders/snoise.glsl";
import {MeshProps, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {IcosahedronGeometry, MathUtils} from "three";

const fragmentShader = snoise + fShader;

type Colors = {
    color1: THREE.Color,
    color2: THREE.Color,
    color3: THREE.Color,
    color4: THREE.Color,
    color5: THREE.Color,
    color6: THREE.Color,
    color7: THREE.Color,
    color8: THREE.Color,
    color9: THREE.Color,
}

type Props = MeshProps & {
    colors: Colors
    isLoading: boolean
    bassIntensity: number
    isPlaying: boolean
}
export const Blob:FC<Props> = ({colors,  isLoading,bassIntensity, isPlaying, ...props}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const colorsRef = useRef(colors);
    const bassIntensityRef = useRef(bassIntensity);
    const isPlayingRef = useRef(isPlaying);

    const uniforms = useMemo(() => ({
        u_time: {value: 0},
        u_intensity: { value: bassIntensityRef.current },
        u_color1: {value: colorsRef.current.color3 },
        u_color2: {value: colorsRef.current.color4},
        u_color3: {value: colorsRef.current.color5},
        u_color4: {value: colorsRef.current.color6},
        u_color5: {value: colorsRef.current.color7},
        u_color6: {value: colorsRef.current.color8},
    }), []);


    useFrame(({clock}) => {
        if (meshRef.current) {

            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.u_time.value =MathUtils.lerp(
                material.uniforms.u_time.value,
                clock.getElapsedTime() * 0.1+bassIntensityRef.current*0.1,
                .3
            );



            material.uniforms.u_intensity.value = MathUtils.lerp(
                material.uniforms.u_intensity.value,
                isLoading ? 0.01 : (bassIntensityRef.current > 0 ? (bassIntensityRef.current * 1.8) + 0.25 : 0.15),
                .3
            );
            material.uniforms.u_color1.value.lerp(colorsRef.current.color3, 0.1);
            material.uniforms.u_color2.value.lerp(colorsRef.current.color4, 0.1);
            material.uniforms.u_color3.value.lerp(colorsRef.current.color5, 0.1);
            material.uniforms.u_color4.value.lerp(colorsRef.current.color6, 0.1);
            material.uniforms.u_color5.value.lerp(colorsRef.current.color7, 0.1);
            material.uniforms.u_color6.value.lerp(colorsRef.current.color8, 0.1);

            const targetScale = bassIntensityRef.current > 0
                ? .5 - bassIntensityRef.current * 0.4
                : .5;
            const currentScale = meshRef.current.scale.x;

            const lerpedScale = MathUtils.lerp(currentScale, targetScale, 0.3);

            meshRef.current.scale.set(lerpedScale, lerpedScale, lerpedScale);
        }
    });


    useEffect(() => {
        colorsRef.current = colors;
    }, [colors]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        bassIntensityRef.current = isPlayingRef.current ? Math.max(0.1, bassIntensity) : 0.1;
    }, [bassIntensity]);

    const positionX = size.width < 768 ? 0 : ((size.width / 2) - 200) * 0.001;

    return (
    <Suspense fallback={null}>
        <group>
            <mesh
                {...props}
                ref={meshRef}
                scale={0.5}
                position={[positionX, .1, 0]}
                geometry={new IcosahedronGeometry(2, 20)}
            >
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent={true}
                />
            </mesh>
        </group>
    </Suspense>
    );
};

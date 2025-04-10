import {FC, memo, Suspense, useEffect, useMemo, useRef} from "react";
import {MeshProps, useFrame, useThree} from "@react-three/fiber";
import * as THREE from "three";
import {MathUtils} from "three";
import vertexShader from "./shaders/vertex-shader.glsl"; // Можно адаптировать или использовать стандартный
import gradientShader from "./shaders/gradient-shader.glsl"; // Новый шейдер для градиента

type Colors = {

    color1: THREE.Color,
    color2: THREE.Color,
    color3: THREE.Color,
    color4: THREE.Color,
    color5: THREE.Color,
    color6: THREE.Color,
}

type Props = MeshProps & {
    colors: Colors;
    intensity: number;
    isPlaying: boolean
}

export const BackgroundGradient: FC<Props> = memo( ({ colors, intensity,isPlaying }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const colorsRef = useRef(colors);
    const intensityRef = useRef(intensity);

    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_intensity: { value: intensityRef.current },
        u_color1: { value: colorsRef.current.color1 },
        u_color2: { value: colorsRef.current.color2 },
        u_color3: { value: colorsRef.current.color3 },
        u_color4: { value: colorsRef.current.color4 },
        u_color5: { value: colorsRef.current.color5 },
        u_color6: { value: colorsRef.current.color6 },
        u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    }), []);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;

            material.uniforms.u_time.value =MathUtils.lerp(
                material.uniforms.u_time.value,
                clock.getElapsedTime(),
                .3
            );

            material.uniforms.u_intensity.value =MathUtils.lerp(
                material.uniforms.u_intensity.value,
                intensityRef.current,
                .4
            );



            material.uniforms.u_color1.value.lerp(colorsRef.current.color1, 0.1);
            material.uniforms.u_color2.value.lerp(colorsRef.current.color2, 0.1);
            material.uniforms.u_color3.value.lerp(colorsRef.current.color3, 0.1);
            material.uniforms.u_color4.value.lerp(colorsRef.current.color4, 0.1);
            material.uniforms.u_color5.value.lerp(colorsRef.current.color5, 0.1);
            material.uniforms.u_color6.value.lerp(colorsRef.current.color6, 0.1);
        }
    });

    useEffect(() => {
        colorsRef.current = colors;
    }, [colors]);

    useEffect(() => {
        intensityRef.current = !isPlaying ? 0.0 : intensity;
    }, [intensity, isPlaying]);

    return (
        <Suspense fallback={null}>
            <mesh ref={meshRef} scale={1} geometry={new THREE.PlaneGeometry(size.width, size.height)}>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={gradientShader}
                    uniforms={uniforms}
                    transparent={true}
                />
            </mesh>
        </Suspense>
    );
});

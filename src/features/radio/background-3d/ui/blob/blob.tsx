import React, {FC, Suspense, useMemo, useRef} from "react";
import vertexShader from "../../lib/shaders/vertex-shader.glsl";
import fShader from "../../lib/shaders/fragment-shader.glsl";
import snoise from "../../lib/shaders/snoise.glsl";
import {MeshProps, useFrame} from "@react-three/fiber";
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
}

type Props = MeshProps & {
    colors: Colors
    isLoading: boolean
}
export const Blob:FC<Props> = React.memo(({colors, isLoading, ...props}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const uniforms = useMemo(() => ({
        u_time: {value: 0},
        u_intensity: {value: 0.3},
        u_color1: {value: colors.color1},
        u_color2: {value: colors.color2},
        u_color3: {value: colors.color3},
        u_color4: {value: colors.color4},
        u_color5: {value: colors.color5},
        u_color6: {value: colors.color6},
    }), []);


    useFrame(({clock}) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.u_time.value = clock.getElapsedTime() * 0.2;

            material.uniforms.u_color1.value = new THREE.Color(...colors.color1);
            material.uniforms.u_color2.value = new THREE.Color(...colors.color2);
            material.uniforms.u_color3.value = new THREE.Color(...colors.color3);
            material.uniforms.u_color4.value = new THREE.Color(...colors.color4);
            material.uniforms.u_color5.value = new THREE.Color(...colors.color5);
            material.uniforms.u_color6.value = new THREE.Color(...colors.color6);
        }
    });
    useFrame((state) => {
        const {clock} = state;
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();

            material.uniforms.u_color1.value = colors.color1;
            material.uniforms.u_color2.value = colors.color2;
            material.uniforms.u_color3.value = colors.color3;
            material.uniforms.u_color4.value = colors.color4;
            material.uniforms.u_color5.value = colors.color5;
            material.uniforms.u_color6.value = colors.color6;

            material.uniforms.u_intensity.value = MathUtils.lerp(
                material.uniforms.u_intensity.value,
                isLoading ? 0.00001 : .6,
                isLoading ? 0 : 0.001
            );
        }
    });


    return (
        <Suspense fallback={null}>
            <group>
                <mesh
                    {...props}
                    ref={meshRef}
                    scale={0.45}
                    position={[0, .4, 0]}
                    geometry={new IcosahedronGeometry(2, 50)}
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
});

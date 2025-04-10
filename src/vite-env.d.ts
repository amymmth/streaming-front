/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-glsl/ext" />


interface ImportMetaEnv {
    VITE_PROJECT_NAME: string;
    VITE_STREAM_URL: string;
    VITE_API_URL: string;
    VITE_MUSIC_GENERATION_API_URL: string;
    VITE_MUSIC_GENERATION_ENTRYPOINT: string;
    MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

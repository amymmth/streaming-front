import React, { useState } from 'react';
import styles from './music-mode-selector.module.css';
import NoLyrics from './assets/no-lyrics.svg?react';
import Lyrics from './assets/with-lyrics.svg?react';
import {MusicModeEnum} from "./music-mode.enum";


interface MusicModeSelectorProps {
    onChange?: (mode: MusicModeEnum) => void;
    activeMode?: MusicModeEnum;
}

export const MusicModeSelector: React.FC<MusicModeSelectorProps> = ({ onChange, activeMode = MusicModeEnum.instrumental }) => {

    const handleModeChange = (mode: MusicModeEnum) => {
        onChange?.(mode);
    };

    return (
        <div className={styles.container}>
            <button
                className={`${styles.button} ${activeMode === MusicModeEnum.withLyrics ? styles.active : ''}`}
                onClick={() => handleModeChange(MusicModeEnum.withLyrics)}
            >
                <Lyrics width={20} height={20}/>
                <span>Песня</span>
            </button>
            <button
                className={`${styles.button} ${activeMode === MusicModeEnum.instrumental ? styles.active : ''}`}
                onClick={() => handleModeChange(MusicModeEnum.instrumental)}
            >

                <NoLyrics width={20} height={20}/>
                <span>Музыка</span>
            </button>
        </div>
    );
};
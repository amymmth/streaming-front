import {cn} from "shared/lib/utils.ts";
import styles from "./style.module.css";
import MusicIcon from "../music-mode-selector/assets/no-lyrics.svg?react";



export const CreateSongFlyButton = () => {
    return (
        <div
            className={cn(styles.gradient,
                "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            )}>
            <MusicIcon width={30} height={30}/>
        </div>
    );
}
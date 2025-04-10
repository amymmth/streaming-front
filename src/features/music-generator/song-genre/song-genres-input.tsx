import {KeyboardWrapper} from "shared/ui/keyboard-wrapper.tsx";
import {SongGenres} from "./song-genres.tsx";
import {MusicModeEnum} from "features/music-generator/music-mode-selector";


export const SongGenresInput = ({className, activeMode}: { className?: string,
    activeMode?: MusicModeEnum; }) => {
    return <KeyboardWrapper className={className}><SongGenres activeMode={activeMode}/></KeyboardWrapper>;
};
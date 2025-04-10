import {KeyboardWrapper} from "shared/ui/keyboard-wrapper.tsx";
import {SongLyrics} from "./song-lyrics.tsx";

export const SongLyricsInput = ({className}: { className?: string }) => {

    return <KeyboardWrapper className={className}>
        <SongLyrics/>
    </KeyboardWrapper>;
};
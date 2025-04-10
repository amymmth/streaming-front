import {FC, useMemo} from 'react';
import {MusicModeEnum} from "features/music-generator/music-mode-selector";
import {useLyrics} from "entities/music/lyrics";
import {useMusicStyles} from "entities/music/music-styles";
import {Button} from "shared/ui/button.tsx";

type ResetButtonProps = { activeMode: MusicModeEnum }

export const ResetButton: FC<ResetButtonProps> = ({activeMode}) => {
    const {lyrics, setLyrics} = useLyrics()
    const {musicStyles, setMusicStyles} = useMusicStyles();

    const resetShowButton = useMemo(() => {
        if (activeMode === MusicModeEnum.withLyrics) {
            return lyrics.length > 0 || musicStyles.length > 0
        }
        if (activeMode === MusicModeEnum.instrumental) {
            return musicStyles.length > 0
        }
        return false
    }, [activeMode, lyrics, musicStyles])

    const handleReset = () => {
        if (activeMode === MusicModeEnum.withLyrics) {
            setLyrics('')
            setMusicStyles('')
        }
        if (activeMode === MusicModeEnum.instrumental) {
            setMusicStyles('')
        }
    }

    if (!resetShowButton) {
        return null
    }

    return (
        <Button
            onClick={handleReset}
            variant={'default'}
            size={'default'}
            className="w-auto mb-2 bg-white/5 opacity-70 !font-normal h-auto py-3"
        >
            Начать сначала
        </Button>
    );
}
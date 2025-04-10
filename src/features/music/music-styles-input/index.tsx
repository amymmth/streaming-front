import {Textarea} from "shared/ui/textarea";
import {Label} from "shared/ui/label";
import {Button} from "shared/ui/button.tsx";
import {ScrollArea} from "shared/ui/scroll-area.tsx";
import {useMusicStyles} from "entities/music/music-styles";
import React, {forwardRef, useEffect} from "react";
import {KeyboardWrapper} from "shared/ui/keyboard-wrapper.tsx";


const musicStylesList = [
    "Кантри-рэп",
    "Китайская традиционная музыка",
    "Фанк-рок",
    "Тропический хаус",
    "Брэйкс",
    "Фьюче-гараж",
    "Спейс-рок"
];

interface MusicStylesProps {
    onTextareaFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    inputValue?: string;
    onInputChange?: (value: string) => void;
}

const MusicStyles = forwardRef<HTMLTextAreaElement, MusicStylesProps>((props, ref) => {
        const {onTextareaFocus, inputValue, onInputChange} = props;

        const {musicStyles, setMusicStyles} = useMusicStyles()

        const addGenre = (genre: string) => {
            if (!musicStyles.includes(genre)) {
                if (onInputChange) {
                    onInputChange(musicStyles ? `${musicStyles}, ${genre}` : genre);
                }
            }
        };


        useEffect(() => {
            setMusicStyles(inputValue as string);
        }, [inputValue]);

        return (
            <div className="relative w-full space-y-3">
                <Label className="text-stone-500" htmlFor="musicStyles">Стиль музыки</Label>
                <div className="rounded-md bg-stone-800 text-white border-stone-700">
                    <Textarea
                        id="musicStyles"
                        name="musicStyles"
                        placeholder="Введите стиль музыки"
                        value={inputValue} // Привязка к значению input
                        onChange={(e) => onInputChange && onInputChange(e.target.value)} // Передача изменений
                        onFocus={onTextareaFocus} // Передаем обработчик фокуса
                        className="text-md border-stone-700 rounded-xl resize-none"
                        ref={ref}
                    />
                    <ScrollArea orientation={'horizontal'} className="w-full p-2 ">
                        <div className={'flex space-x-2 overflow-x-auto'}>
                            {musicStylesList
                                .filter((genre) => !musicStyles.includes(genre))
                                .map((genre) => (
                                    <Button
                                        key={genre}
                                        variant="outline"
                                        className="whitespace-nowrap"
                                        onClick={() => addGenre(genre)}
                                    >
                                        {genre}
                                    </Button>
                                ))}
                        </div>

                    </ScrollArea>
                </div>
            </div>
        );
    }
);

export const MusicStylesInput = ({className}: { className?: string }) => <KeyboardWrapper
    className={className}><MusicStyles/></KeyboardWrapper>;
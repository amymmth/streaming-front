import React, {forwardRef, useEffect, useState} from "react";
import {useLyrics} from "entities/music/lyrics";
import {Textarea} from "shared/ui/textarea.tsx";
import {Button} from "shared/ui/button.tsx";
import {Loader2} from "lucide-react";
import {SongTheme} from "./song-themes.model.ts";
import Magic from "./assets/magic.svg?react";
import {lyricThemes} from "./song-themes.constant";
import {SongThemeTags} from "./song-theme-tags/song-theme-tags.tsx";
import {poetryGeneratingVar, usePoetryGenerate} from "features/music-generator/song-lyrics/hooks/usePoetryGenerate.ts";
import {PoetryEntity} from "shared/api/types.ts";
import {useMediaQuery} from "shared/hooks/useMediaQuery.ts";
import {Toast} from "shared/ui/toast";
import {useReactiveVar} from "@apollo/client";

type LyricsProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    onTextareaFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    inputValue?: string;
    onInputChange?: (value: string) => void;
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    scrollAreaViewportRef?: React.Ref<HTMLDivElement>;
    isInsideKeyboard?: boolean
};

export const SongLyrics = forwardRef<HTMLTextAreaElement, LyricsProps>(
    ({isInsideKeyboard, onTextareaFocus, inputValue, onInputChange, textareaRef, scrollAreaViewportRef}, ref) => {
        const innerTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
        const innerScrollAreaViewportRef = React.useRef<HTMLDivElement | null>(null);
        const [toastErrorOpen, setToastErrorOpen] = useState(false);
        const [toastErrorMessage, setToastErrorMessage] = useState('');
        const isMobile = useMediaQuery("(max-width: 767px)");
        const {createPoetry, error} = usePoetryGenerate()
        const poetryGenerating = useReactiveVar(poetryGeneratingVar);


        const [activeTheme, setActiveTheme] = useState<SongTheme | null>(null);

        React.useImperativeHandle(ref, () => innerTextareaRef.current!);

        React.useImperativeHandle(textareaRef, () => innerTextareaRef.current!);
        React.useImperativeHandle(scrollAreaViewportRef, () => innerScrollAreaViewportRef.current!);

        const {setLyrics, lyrics} = useLyrics();


        const handleGenerateLyrics = (lyrics: string) => {
            createPoetry(lyrics).then((data) => {
                if (onInputChange && (data as PoetryEntity)?.resultText) {
                    onInputChange((data as PoetryEntity).resultText || '');
                }
            })
        };


        useEffect(() => {
            setLyrics(inputValue as string);
        }, [inputValue]);

        useEffect(() => {
            const matchingTheme = lyricThemes.find(
                (theme) => inputValue?.trim().toLowerCase() === theme.prompt.toLowerCase()
            );
            if (matchingTheme) {
                setActiveTheme(matchingTheme);
            } else {
                setActiveTheme(null);
            }
        }, [inputValue]);

        useEffect(() => {
            if (activeTheme) {
                if (onInputChange) {
                    onInputChange(activeTheme.prompt);
                }
            }
        }, [activeTheme]);

        useEffect(() => {
            if (lyrics.length === 0) {
                if (onInputChange) {
                    onInputChange('');
                }
            }
        }, [lyrics]);

        useEffect(() => {
            if (error) {
                setToastErrorOpen(true);
                setToastErrorMessage(error);
            }
        }, [error]);


        return (
            <>
                <h3 className="text-md font-medium tracking-tight">Придумайте текст песни</h3>

                {!isInsideKeyboard && <SongThemeTags
                    themes={lyricThemes}
                    onChange={(theme) => {
                        setActiveTheme(theme);
                        handleGenerateLyrics(theme.prompt)
                    }}
                    activeTheme={activeTheme}
                    disabled={poetryGenerating}
                />}

                <div
                    className="w-full bg-opacity-5 bg-white text-white rounded-lg backdrop:blur-md">

                    <Textarea
                        id="lyrics"
                        name="lyrics"
                        placeholder="Напишите свой текст песни или задайте тему, и нейропоэт сочинит за вас"
                        value={inputValue}
                        onChange={(e) => onInputChange && onInputChange(e.target.value)}
                        onFocus={onTextareaFocus}
                        textareaRef={innerTextareaRef}
                        scrollAreaViewportRef={innerScrollAreaViewportRef}
                        rows={isMobile ? 4 : 13}
                        disabled={poetryGenerating}
                    />

                    <div className={'px-3 pb-3 mt-2'}>
                        <Button
                            size={"default"}
                            variant={"ghost"}
                            onClick={() => handleGenerateLyrics(lyrics)}
                            disabled={poetryGenerating}
                            className={'bg-white/10 p-2 !h-auto w-[calc(100%-0.75rem)] md:w-auto min-w-0 max-w-[320px] overflow-hidden'}
                        >
                            <div
                                className="relative flex items-center justify-start gap-2 w-full ">

                                {poetryGenerating ? <Loader2 className="animate-spin"/> :
                                    <Magic width={24} height={24}/>}
                                {inputValue ?
                                    <span className="text-sm text-white opacity-50 whitespace-nowrap truncate">
                                        Сгенерировать текст: <strong>{inputValue || "..."}</strong>
                                    </span>
                                    :
                                    <span className="text-sm text-white opacity-50 whitespace-nowrap truncate mr-2">
                                        Сгенерировать текст
                                    </span>
                                }
                            </div>
                        </Button>
                    </div>
                </div>

                <Toast
                    open={toastErrorOpen}
                    onOpenChange={setToastErrorOpen}
                    title={toastErrorMessage || "Не удалось сгенерировать текст"}
                    description="Попробуйте ещё раз"
                    autoCloseDelay={7000}
                    swipeDirection="right"
                />

            </>
        );
    }
)
import {Button} from "shared/ui/button";
import {Textarea} from "shared/ui/textarea";
import {Label} from "shared/ui/label";
import {useLyrics} from "entities/music/lyrics";
import {Dices, Loader2} from "lucide-react";
import "react-simple-keyboard/build/css/index.css";
import React, {forwardRef, useEffect} from "react";
import {KeyboardWrapper} from "shared/ui/keyboard-wrapper.tsx";
import {useGenerateTextLazyQuery} from "shared/api/music-generation/combined.generated.tsx";


export type LyricsWidgetProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    onTextareaFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    inputValue?: string;
    onInputChange?: (value: string) => void;
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    scrollAreaViewportRef?: React.Ref<HTMLDivElement>;
};

export const Lyrics = forwardRef<HTMLTextAreaElement, LyricsWidgetProps>(
    ({onTextareaFocus, inputValue, onInputChange, textareaRef, scrollAreaViewportRef}, ref) => {
        const innerTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
        const innerScrollAreaViewportRef = React.useRef<HTMLDivElement | null>(null);

        React.useImperativeHandle(ref, () => innerTextareaRef.current!);

        React.useImperativeHandle(textareaRef, () => innerTextareaRef.current!);
        React.useImperativeHandle(scrollAreaViewportRef, () => innerScrollAreaViewportRef.current!);

        const {setLyrics} = useLyrics();

        // const [generateLyrics, {loading}] = usePoetryGenerateMutation()
        const [generateLyrics, {loading}] = useGenerateTextLazyQuery()

        const handleGenerateLyrics = () => {
            generateLyrics({
                variables: {
                    prompt: inputValue || 'Простая попсовая песня о любви в мажорном настроении, с запоминающимся припевом'
                }
            }).then(resp => {
                if (resp.data?.generateText) {
                    if (onInputChange) {
                        onInputChange(resp.data.generateText || '');
                    }
                }
            });
        };


        useEffect(() => {
            setLyrics(inputValue as string);
        }, [inputValue]);

        return (
            <>
                <div className="w-full flex flex-col flex-grow space-y-3">
                    <Label className={'text-stone-500'} htmlFor="lyrics">Текст песни</Label>
                    <div className={'rounded-md bg-input text-white flex flex-grow pb-10 relative'}>
                        <Textarea
                            id="lyrics"
                            name="lyrics"
                            placeholder="Введите текст вашей песни"
                            value={inputValue}
                            onChange={(e) => onInputChange && onInputChange(e.target.value)}
                            onFocus={onTextareaFocus}
                            className="w-full"
                            textareaRef={innerTextareaRef}
                            scrollAreaViewportRef={innerScrollAreaViewportRef}
                        />
                        <Button variant={'outline'} size={'icon'} onClick={handleGenerateLyrics} disabled={loading}
                                className="absolute bottom-4 left-2 p-3">
                            {loading ? <Loader2 className="animate-spin"/> : <Dices/>}
                        </Button>
                    </div>
                </div>
            </>
        );
    }
);

export const LyricsInput = ({className}: { className?: string }) => <KeyboardWrapper
    className={className}><Lyrics/></KeyboardWrapper>;
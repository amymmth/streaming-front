import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {Drawer, DrawerContent} from "shared/ui/drawer";
import {KeyboardReactInterface} from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import {DialogDescription, DialogHeader, DialogTitle} from "shared/ui/dialog.tsx";
import {KeyboardInput} from "react-simple-keyboard/build/interfaces";
import {cn} from "shared/lib/utils.ts";
import {Keyboard} from "./keyboard";
import {useMediaQuery} from "shared/hooks/useMediaQuery.ts";

interface KeyboardWrapperProps {
    children: ReactElement;
    className?: string
    onOpenChange?: (isOpen: boolean) => void
}

export const KeyboardWrapper = ({children, className, onOpenChange}: KeyboardWrapperProps) => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [input, setInput] = useState<KeyboardInput>({default: ""});
    const [initialised, setInitialised] = useState(false);


    const firstChildRef = useRef<HTMLTextAreaElement | null>(null);
    const secondChildRef = useRef<HTMLTextAreaElement | null>(null);
    const scrollAreaViewportRef = useRef<HTMLDivElement | null>(null);
    const keyboardRef = useRef<KeyboardReactInterface | null>(null);

    const showKeyboard = (initialValue: string) => {
        if (isMobile) return;
        setInput({default: initialValue});
        setIsKeyboardVisible(true);
        onOpenChange?.(true);
    };


    const handleInputChange = (input: string) => {
        setInput({default: input});
        setTimeout(() => {
            if (secondChildRef?.current && keyboardRef.current) {
                secondChildRef.current.setSelectionRange(keyboardRef.current.caretPosition, keyboardRef.current.caretPosition);
            }
        }, 0)
    };


    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        showKeyboard(e.target.value); // Показать клавиатуру при фокусе
    };

    useEffect(() => {
        const handleBlur = () => {
            if (!secondChildRef.current || !keyboardRef.current) {
                return;
            }
            secondChildRef.current.setSelectionRange(keyboardRef.current.caretPosition, keyboardRef.current.caretPosition);
            secondChildRef.current.focus();
        };


        const currentRef = secondChildRef.current;

        if (isKeyboardVisible && currentRef && keyboardRef.current) {
            currentRef.addEventListener("blur", handleBlur);
        } else if (currentRef && keyboardRef.current) {
            currentRef.removeEventListener("blur", handleBlur);
        }

        return () => {
            if (currentRef && keyboardRef.current) {
                currentRef.removeEventListener("blur", handleBlur);
            }
        };
    }, [isKeyboardVisible, secondChildRef.current, keyboardRef.current]);

    useEffect(() => {
        if (!isKeyboardVisible) {
            setInitialised(false);
        }
    }, [isKeyboardVisible]);


    return (
        <div className={cn('flex flex-col', className)}>
            {React.cloneElement(children, {
                ref: firstChildRef,
                onTextareaFocus: handleFocus,
                inputValue: input.default,
                onInputChange: (value: string) => {
                    setInput({default: value})
                }
            })}

            <Drawer
                open={isKeyboardVisible}
                onOpenChange={(open) => {
                    setIsKeyboardVisible(open);
                    onOpenChange?.(open);
                }}
                repositionInputs={true}

            >

                <DialogHeader className={'sr-only'}>
                    <DialogTitle className={'sr-only'}>Клавиатура</DialogTitle>
                    <DialogDescription className={'sr-only'}>Введите текст</DialogDescription>
                </DialogHeader>

                <DrawerContent className={'bg-opacity backdrop-blur-md '}>
                    <div className="mx-auto w-full max-w-screen-xl h-full flex flex-col">

                        <div className={cn('flex flex-col', className)}>
                            {React.cloneElement(children, {
                                ref: secondChildRef,
                                scrollAreaViewportRef: scrollAreaViewportRef,
                                inputValue: input.default,
                                autoFocus: true,
                                onInputChange: (value: string) => {
                                    setInput({default: value})
                                },
                                isInsideKeyboard: true
                            })}
                        </div>

                        <div className={'mt-4'}>

                            <Keyboard
                                keyboardRef={(r) => (keyboardRef.current = r)}
                                onChange={handleInputChange}
                                onRender={(instance) => {
                                    setTimeout(() => {
                                        if (instance && secondChildRef.current) {
                                            if (!initialised) {
                                                instance.setCaretPosition(secondChildRef.current.value.length);
                                                setInitialised(true);
                                            }
                                        }
                                    }, 100);

                                    instance.setInput(input.default);
                                }}
                                physicalKeyboardHighlight
                                onInit={() => {
                                    if (secondChildRef?.current) {
                                        secondChildRef.current.style.height = `${firstChildRef?.current?.getBoundingClientRect()?.height}px`;
                                        secondChildRef.current.focus();
                                        //установить курсор в конец
                                        secondChildRef.current.setSelectionRange(secondChildRef.current.value.length, secondChildRef.current.value.length);
                                        //скролл до конца
                                        if (scrollAreaViewportRef.current) {
                                            const scrollHeight = scrollAreaViewportRef.current.scrollHeight;
                                            scrollAreaViewportRef.current.scrollTo({top: scrollHeight});
                                        }
                                    }
                                }}
                                input={input}
                                onclose={() => {
                                    setIsKeyboardVisible(false)
                                    onOpenChange?.(false);
                                }}
                            />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

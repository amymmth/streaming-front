import * as React from "react";
import {ChangeEvent} from "react";
import {cn} from "shared/lib/utils";
import {ScrollBar} from "shared/ui/scroll-area.tsx";
import {Corner, ScrollArea, ScrollAreaViewport} from "@radix-ui/react-scroll-area";
import {Cross1Icon} from "@radix-ui/react-icons";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    scrollAreaViewportRef?: React.Ref<HTMLDivElement>;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({className, textareaRef, scrollAreaViewportRef, ...props}, ref) => {
        const innerTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
        const innerScrollAreaViewportRef = React.useRef<HTMLDivElement | null>(null);

        React.useImperativeHandle(ref, () => innerTextareaRef.current!);

        React.useImperativeHandle(textareaRef, () => innerTextareaRef.current!);
        React.useImperativeHandle(scrollAreaViewportRef, () => innerScrollAreaViewportRef.current!);
        const handleFocus = () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        };

        const handleBlur = () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        };
        return (
            <ScrollArea
                className={cn("relative overflow-hidden pb-4",
                    className)}
                type={'hover'}
            >
                {(innerTextareaRef.current && innerTextareaRef.current.value) && (
                    <button
                        type="button"
                        className={cn("absolute top-4 right-4 text-gray-300  focus:outline-none z-10",
                            innerTextareaRef.current.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
                        disabled={innerTextareaRef.current.disabled}
                        onClick={() => {
                            innerTextareaRef.current!.value = ""
                            props.onChange?.({target: innerTextareaRef.current!} as ChangeEvent<HTMLTextAreaElement>)
                        }}
                    >
                        <Cross1Icon className="h-5 w-5"/>
                    </button>
                )}
                <ScrollAreaViewport
                    className="h-full w-full"
                    ref={innerScrollAreaViewportRef}
                >
                  <textarea
                      className={cn(
                          "w-full bg-transparent placeholder:text-muted-foreground table",
                          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-within:ring-0 focus-within:ring-offset-0",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                          "h-full rounded-none  p-4"
                      )}
                      ref={innerTextareaRef}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      {...props}
                  />
                </ScrollAreaViewport>
                <ScrollBar orientation={"vertical"}/>
                <Corner/>
            </ScrollArea>
        );
    }
);

Textarea.displayName = "Textarea";

export {Textarea};

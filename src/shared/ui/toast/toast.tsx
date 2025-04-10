import React from "react";
import * as UiToast from "@radix-ui/react-toast";
import "./styles.css";
import {Cross1Icon} from "@radix-ui/react-icons";
import {cn} from "shared/lib/utils.ts";

type ToastProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description: string;
    actionLabel?: React.ReactNode;
    actionCallback?: () => void;
    autoCloseDelay?: number;
    fullscreen?: boolean;
    swipeDirection?: "up" | "down" | "left" | "right";
};

export const Toast: React.FC<ToastProps> = (props) => {
    const {
        open,
        onOpenChange,
        title,
        description,
        actionLabel = <Cross1Icon fontSize={16}/>,
        actionCallback = () => {
        },
        autoCloseDelay,
        fullscreen,
        swipeDirection="down"
    } = props;

    return (
        <UiToast.Provider swipeDirection={swipeDirection}>
            <UiToast.Root
                className=
                    {cn(
                        "ToastRoot",
                        swipeDirection && `swipe-${swipeDirection}`
                    )}
                open={open}
                onOpenChange={onOpenChange}
                duration={autoCloseDelay}
            >
                {title && <UiToast.Title className="ToastTitle">{title}</UiToast.Title>}
                {description && (
                    <UiToast.Description className="ToastDescription">
                        {description}
                    </UiToast.Description>
                )}
                {actionLabel && (
                    <UiToast.Action
                        className="ToastAction"
                        asChild
                        altText="Close"
                    >
                        <button className="Button small bg-black/20 rounded-full p-2 text-white"
                                onClick={actionCallback}>
                            {actionLabel}
                        </button>
                    </UiToast.Action>
                )}
            </UiToast.Root>
            <UiToast.Viewport className={
                cn("ToastViewport",
                    fullscreen && "full-screen",
                    swipeDirection && `swipe-${swipeDirection}`
                )}/>
        </UiToast.Provider>
    );
};


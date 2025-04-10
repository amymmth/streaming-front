import {FC, ReactNode} from 'react';
import clsx from "clsx";
import {css} from "@linaria/core";

type Props = {
    children: ReactNode
    className?: string
}

const cardCss = css`
    z-index: 2;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0.5em 1.5em;
    border-radius: 1.25rem;
    background-image: url("/src/shared/assets/noise.png");

    &:before {
        border-radius: 1.25rem;
        content: "";
        display: block;
        height: calc(100% + 2px);
        position: absolute;
        width: calc(100% + 2px);
        z-index: -1;
        -webkit-tap-highlight-color: transparent;
        left: -1px;
        top: -1px;
        user-select: none;
        opacity: .5;
    }
`


export const UiCard: FC<Props> = ({children, className}) => {
    return (
        <div
            className={clsx(
                'flex w-full items-center flex-col gap-4 p-4',
                'rounded-[2rem] shadow-lg',
                'backdrop-blur backdrop-filter',
                'border border-gray-100 border-opacity-10',
                cardCss,
                className
            )}
        >
            {children}
        </div>
    );
}

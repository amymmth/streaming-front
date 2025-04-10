import { css } from '@linaria/core';

export const sliderStyle = css`
    font-size: 1.5rem;
    width: 100%;
    color: rgb(0, 194, 255);
    --thumb-height: 16px;
    --thumb-width: 0.1px;
    --track-height: 16px;
    --track-color: rgb(36, 36, 36);
    --brightness-hover: 180%;
    --brightness-down: 80%;
    --clip-edges: 0.125em;
    position: relative;
    background: rgba(255, 255, 255, 0);
    overflow: hidden;

    &:active {
        cursor: grabbing;
    }

    &:disabled {
        filter: grayscale(1);
        opacity: 0.3;
        cursor: not-allowed;
    }

    /* === WebKit specific styles === */

    &,
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        transition: all ease 100ms;
        height: var(--thumb-height);
        border-radius: 0;
    }

    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
        position: relative;
    }

    &::-webkit-slider-thumb {
        --thumb-radius: 0;
        --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
        --clip-bottom: calc(var(--thumb-height) - var(--clip-top));
        --clip-further: calc(100% + 1px);
        --box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0 100vmax currentColor;

        width: var(--thumb-width, var(--thumb-height));
        background: linear-gradient(currentColor 0 0) scroll no-repeat left center / 50% calc(var(--track-height) + 1px);
        box-shadow: var(--box-fill);
        border-radius: 0;
        filter: brightness(100%);
        clip-path: polygon(
                100% -1px,
                var(--clip-edges) -1px,
                0 var(--clip-top),
                -100vmax var(--clip-top),
                -100vmax var(--clip-bottom),
                0 var(--clip-bottom),
                var(--clip-edges) 100%,
                var(--clip-further) var(--clip-further)
        );
    }

    &:hover::-webkit-slider-thumb {
        cursor: grab;
    }

    &:active::-webkit-slider-thumb {
        cursor: grabbing;
    }

    &::-webkit-slider-runnable-track {
        background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center / 100% calc(var(--track-height) + 1px);
    }

    &:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
    }

    /* === Firefox specific styles === */

    &,
    &::-moz-range-track,
    &::-moz-range-thumb {
        appearance: none;
        transition: all ease 100ms;
        height: var(--thumb-height);
    }

    &::-moz-range-track,
    &::-moz-range-thumb,
    &::-moz-range-progress {
        background: #fff0;
    }

    &::-moz-range-thumb {
        background: currentColor;
        border: 0;
        width: var(--thumb-width, var(--thumb-height));
        border-radius: var(--thumb-width, var(--thumb-height));
        cursor: grab;
    }

    &:active::-moz-range-thumb {
        cursor: grabbing;
    }

    &::-moz-range-track {
        width: 100%;
        background: var(--track-color);
    }

    &::-moz-range-progress {
        appearance: none;
        background: currentColor;
        transition-delay: 30ms;
    }

    &::-moz-range-track,
    &::-moz-range-progress {
        height: calc(var(--track-height) + 1px);
        border-radius: var(--track-height);
    }

    &::-moz-range-thumb,
    &::-moz-range-progress {
        filter: brightness(100%);
    }

    &:hover::-moz-range-thumb,
    &:hover::-moz-range-progress {
        filter: brightness(var(--brightness-hover));
    }

    &:active::-moz-range-thumb,
    &:active::-moz-range-progress {
        filter: brightness(var(--brightness-down));
    }

    &:disabled::-moz-range-thumb {
        cursor: not-allowed;
    }
`;
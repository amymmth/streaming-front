import { css } from '@linaria/core';

export const content = css`
  background: rgba(150, 150, 150, 0.1);
  backdrop-filter: blur(20px);
  position: relative;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  /* Базовый стиль для мобильных устройств */
  border-radius: 50%;
  width: 20rem;
  height: 20rem;
  margin-inline: auto;

  /* Для md и выше — карточка с соотношением сторон */
  @media (min-width: 768px) {
    border-radius: 0.5rem 0.5rem 0 0;
    width: 100%;
    flex: 1;
  }
`;



export const background = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

export const img = css`
    width: 100%;
    height: auto;
    object-fit: cover;
    pointer-events: none;
    position: absolute;
    top: 100%;
    transform: translateY(-50%);
    opacity: 0.8;
    mix-blend-mode: multiply;
    @media (max-width: 900px) {
        transform: translateY(-70%);
    }
    @media (max-width: 768px) {
        transform: translateY(-100%);
    }
`;

export const overlay = css`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  z-index: -1;
  pointer-events: none;
  opacity: 0.6;
`;

export const title = css`
    font-size: min(3rem, 5vw);
    font-weight: bold;
    color: white;
    text-align: center;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;



export const subtitle = css`
    font-size: 1rem;
    color: #d1d5db;
    text-align: center;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const footer = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.5rem;
  z-index: 10;
`;

export const slider = css`
    font-size: 1.5rem;
    width: 100%;
    color: rgb(159, 101, 209);
    --thumb-height: 20px;
    --thumb-width: 0.1px;
    --track-height: 20px;
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
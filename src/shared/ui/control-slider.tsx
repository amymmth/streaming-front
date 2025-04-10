import React from 'react';
import RcSlider, {SliderProps} from 'rc-slider';
import 'rc-slider/assets/index.css';
import {styled} from "@linaria/react";

const StyledSlider = styled(RcSlider)`
    margin: 0 1rem;
    width: 100%;

    .rc-slider-handle {
        background: rgba(199, 199, 199, 1);
        box-shadow: rgba(0, 0, 0, 0.1) 0 .1em .1em;
        width: 24px;
        height: 13px;
        border-radius: 1.25rem;
        border: none;
        opacity: 1;
        transition: background 0.3s ease;
        margin-top: -5px;

        &:hover {
            background: rgba(210, 210, 210, 1);
        }

        &.rc-slider-handle-dragging {
            background: rgba(224, 224, 224, 1);
            box-shadow: rgba(0, 0, 0, 0.1) 0 .1em .1em;
            border: none;
        }
    }

    .rc-slider-track {
        background-image: linear-gradient(to right, #e299eb 0%, #0bb0e6 50%, #534e99 100%);
        border-radius: 0;
        height: 9px;
        top: 2px;
    }

    .rc-slider-rail {
        border-radius: 1.25rem;
        height: 9px;
        top: 2px;

        &:before {
            content: "";
            display: block;
            height: 9px;
            position: absolute;
            width: calc(100% + 24px);
            left: -12px;
            z-index: -1;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            background: rgba(255, 255, 255, 0.3);
            box-shadow: rgba(255, 255, 255, 0.2) 1px 1px 0 inset, rgba(255, 255, 255, 0.2) -1px -1px 0 inset;
            border-radius: 1.25rem;
        }

        background: transparent;
    }

`;

export const Slider: React.FC<SliderProps> = (props) => {
    return (
        <>
            <StyledSlider
                {...props}
            />
        </>
    );
};

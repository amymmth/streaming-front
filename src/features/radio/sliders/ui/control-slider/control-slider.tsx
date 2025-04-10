import React from 'react';
import {Slider} from "shared/ui/control-slider";

interface ControlSliderProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
    description: string;
    min?: number;
    max?: number;
    startPoint?: number;
}

export const ControlSlider: React.FC<ControlSliderProps> = (props) => {
    const {
        value,
        onChange,
        label,
        description,
        min = -10,
        max = 10,
        startPoint = 0,
    } = props;

    return (
        <>
            <div className="flex items-center w-full justify-center gap-2 px-6 ">
                <Slider
                    min={min}
                    max={max}
                    defaultValue={startPoint}
                    startPoint={startPoint}
                    value={value}
                    onChange={(newValue) => onChange(newValue as number)}
                />
                <span className="text-right">{value > 0 ? `+` : ``}{value}</span>
            </div>
            <div
                className={'flex flex-col items-center gap-4 mt-4 px-4'}
            >
                <label className="text-xl text-[#bfbfbf] font-bold font-headerFont">{label}</label>
                <div className="text-[#bfbfbf] text-center max-w-sm grow text-sm">
                    {description}
                </div>
            </div>
        </>
    );
};

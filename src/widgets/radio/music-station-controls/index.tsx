import React from 'react';
import {TonalitySlider} from "features/radio/sliders/tonality-slider/tonality-slider.tsx";
import {BassSlider} from "features/radio/sliders/bass-slider/bass-slider.tsx";
import {BrightnessSlider} from "features/radio/sliders/brightness-slider/brightness-slider.tsx";
import {UiCard} from "shared/ui/ui-card";
import clsx from "clsx";

export const MusicStationControls: React.FC = () => {
    return (
        <UiCard className={clsx(
            'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ',
            'bg-gray-500 bg-opacity-20 !p-4',
        )}>
            <UiCard
                className={'h-full lg:w-full !shadow-none bg-opacity-30 bg-black gap-1 py-4'}>
                <BassSlider/>
            </UiCard>
            <UiCard
                className={'h-full lg:w-full !shadow-none bg-opacity-30 bg-black gap-1 py-4'}>
                <TonalitySlider/>
            </UiCard>
            <UiCard
                className={clsx(
                    'h-full !shadow-none bg-opacity-30 bg-black',
                    'md:col-span-2 lg:col-span-1',
                    'gap-1 py-4'
                )}>
                <BrightnessSlider/>
            </UiCard>
        </UiCard>
    );
};
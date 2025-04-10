import React from 'react';
import clsx from "clsx";
import ArrowLeft from './assets/arrow-left.svg?react';
import ArrowRight from './assets/arrow-right.svg?react';

interface StationSwitcherProps {
    direction: 'left' | 'right';
    onClick: () => void;
    className?: string;
    title?: string;
    disabled?: boolean;
}

export const StationSwitcher: React.FC<StationSwitcherProps> = ({direction, onClick, className, title, disabled}) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "transition-all duration-200 px-4 flex items-center justify-center",
                "group",
                disabled ? "text-gray-500 hover:text-gray-500" : "text-gray-400 hover:text-white",
                className
            )}
            disabled={disabled}
        >
            <div className={'flex flex-col items-center justify-center gap-4'}>

                <div className={clsx(
                    'rounded-full w-16 h-16 flex items-center justify-center bg-gray-400 bg-opacity-30 ',
                    !disabled ? 'group-hover:bg-opacity-40' : '',
                    disabled ? 'opacity-0' : 'opacity-1'
                )}>
                    {direction === 'left' ? (
                        <ArrowLeft className={'w-1/3 h-1/3'}/>
                    ) : (
                        <ArrowRight className={'w-1/3 h-1/3'}/>
                    )}
                </div>
                <div className={'!text-lg h-7 lg:block hidden'}>
                    {title}
                </div>
            </div>
        </button>
    );
};

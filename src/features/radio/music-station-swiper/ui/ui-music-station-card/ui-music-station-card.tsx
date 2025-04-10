import React from 'react';
import clsx from "clsx";
import {useMusicStationStore} from "entities/radio/music-station";
import Loader from './assets/loader.svg?react';
import {useSocket} from "app/providers/socket/socket-context.tsx";

type Props = {
    id?: number
    image?: string
    title?: string
    genre?: string
    description?: string
    classNames?: {
        root?: string
        image?: string
        label?: {
            root?: string
            title?: string
            genre?: string
            description?: string
        }
    }
}
export const MusicStationCard: React.FC<Props> = (props) => {
    const {isLoading} = useSocket();
    const currentStation = useMusicStationStore((state) => state.currentStation);

    const {id, image, title, genre, description, classNames} = props
    return (
        <>
            <img
                src={image}
                alt={title}
                className={clsx("w-full rounded-tl-xl rounded-tr-xl", "swiper-stations-image", classNames?.image)}
            />

            <div
                className={'absolute w-full h-full inset-0'}
            >
                {(isLoading && currentStation?.id === id) && (
                    <div
                        className={clsx(
                            "absolute top-32 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 text-center",
                        )}
                    >
                        <Loader
                            className={clsx("w-20", "animate-spin", "text-gray-50")}
                        />
                    </div>
                )}

            </div>

            <div
                className={clsx(
                    'absolute bottom-0 left-0 right-0 py-4 px-4 overflow-hidden ',
                    'swiper-stations-label',
                    classNames?.label?.root
                )}
            >
                <div className="card-background-blur" style={{backgroundImage: `url(${image})`}}>
                    <div className="overlay-gradient-noise bg-gray-800 opacity-50"
                         style={{backgroundImage: `url("/src/shared/assets/noise.png")`}}/>
                </div>

                <div className={clsx('text-md text-gray-200 ', classNames?.label?.genre)}>
                    <span
                        className="border inline border-solid border-gray-100 px-3 py-1 rounded-lg">{genre}</span>
                </div>
                <div
                    className={clsx("text-xl text-gray-100 mt-4 mb-3 font-bold font-headerFont", classNames?.label?.title)}>{title}</div>
                <div className={clsx("text-sm leading-6 text-gray-300", classNames?.label?.description)}>
                    {description}
                </div>
            </div>
        </>
    );
};

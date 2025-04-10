import React, {useCallback, useEffect, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './swiper.css';
import {MusicStationCard} from './ui/ui-music-station-card';
import {StationSwitcher} from './ui/ui-station-switcher-button';
import {EffectCoverflow} from 'swiper/modules';
import {useMusicSwitcher} from "./model/use-music-switcher.tsx";

export const MusicStationSwiper: React.FC = () => {
    const {onStationChange, stations} = useMusicSwitcher();
    const swiperRef = useRef<SwiperRef>(null);

    const prevSlide = useCallback(() => {
        swiperRef.current?.swiper.slidePrev();
    }, [swiperRef]);

    const nextSlide = useCallback(() => {
        swiperRef.current?.swiper.slideNext();
    }, [swiperRef]);

    useEffect(() => {
        const swiperInstance = swiperRef.current?.swiper;
        if (swiperInstance) {
            swiperInstance.update();
        }
    }, []);
    const [currentSlide, setCurrentSlide] = React.useState(1);


    return (
        <div className="w-screen flex items-stretch justify-between  max-w-full h-full relative">
            <StationSwitcher
                direction="left"
                onClick={prevSlide}
                className={'w-18 sm:w-full h-full sm:h-[initial] absolute sm:relative left-0 z-10'}
                title={
                    stations[currentSlide - 1]?.title || ''
                }
                disabled={currentSlide <= 0}
            />
            <div
                className={'max-w-screen-lg grow relative flex items-center justify-between lg:min-w-[auto] min-w-[calc(100%-160px)]'}>
                <Swiper
                    ref={swiperRef}
                    effect={'coverflow'}
                    className="swiper-stations"
                    initialSlide={1}
                    onSlideChange={(swiper) => {
                        setCurrentSlide(swiper.activeIndex)
                        onStationChange(stations[swiper.activeIndex].id)
                    }}
                    modules={[EffectCoverflow]}
                    slidesPerView={'auto'}
                    centeredSlides={true}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 200,
                        modifier: 5,
                        slideShadows: true,
                    }}
                    keyboard={{enabled: true}}
                >
                    {
                        stations.map((station, index) => (
                            <SwiperSlide key={index}>
                                {({isActive}) => (
                                    <MusicStationCard
                                        id={station.id}
                                        genre={station.genre}
                                        title={station.title}
                                        image={station.image}
                                        description={station.description}
                                        classNames={{root: isActive ? 'swiper-stations-slide-active' : ''}}
                                    />
                                )}
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

            <StationSwitcher
                direction="right"
                onClick={nextSlide}
                className={'w-18 sm:w-full h-full sm:h-[initial] absolute sm:relative right-0 z-10'}

                title={
                    stations[currentSlide + 1]?.title || ''
                }
                disabled={currentSlide >= stations.length - 1}
            />
        </div>
    );
};



import {FC, useRef, VideoHTMLAttributes} from 'react';
import LogoVideo from './assets/logo-video-2.mp4';
import LogoImage from './assets/logo-image-2-xs.png';
import LogoText from './assets/logo-with-circle-text.svg?react';
import {cn} from "shared/lib/utils.ts";

export const Logo: FC<{ className?: string, withoutCircleText?: boolean }> = ({className, withoutCircleText}) => {
    const ref = useRef<HTMLDivElement>(null);
    const logoVideoProps: VideoHTMLAttributes<HTMLVideoElement> & { pip: string } = {
        pip: 'false',
        loop: true,
        playsInline: true,
        muted: true,
        crossOrigin: 'anonymous',
        disablePictureInPicture: true,
        autoPlay: true,
    }


    return (
        <div
            ref={ref}
            className={cn("w-24 relative group cursor-pointer", className ?? '')}
        >

            <img
                src={LogoImage}
                alt="Logo"
                className={cn("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-[-1] w-1/2",
                    withoutCircleText && 'w-full'
                    )}
            />
            <video
                className={cn("z-[-1] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-1/2",
                    withoutCircleText && 'w-full'
                )}
                {...logoVideoProps}
            >
                <source src={LogoVideo} type="video/mp4"/>
                Ваш браузер не поддерживает видео тег.
            </video>
            {!withoutCircleText && <div
                className={' group-hover:scale-110 transition-transform duration-200 w-full group-hover:animate-pulse'}>
                <LogoText
                    className="group-hover:animate-spin group-hover:!delay-200 group-hover:!duration-[1000ms] w-full"
                    style={{
                        animationDuration: '30s'
                    }}
                />
            </div>}
        </div>
    );
};

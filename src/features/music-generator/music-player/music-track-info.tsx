import {FC, useEffect, useState} from "react";
import {usePlayingTrack} from "entities/music/music-player";
import {styles} from "./styles";
import {useMediaQuery} from "shared/hooks/useMediaQuery.ts";
import {cn} from "shared/lib/utils.ts";

export const MusicTrackInfo: FC = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [scale, setScale] = useState(1);

    const {playingTrack} = usePlayingTrack();


    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 400; // Максимальная прокрутка, при которой scale будет равен 0
            const newScale = Math.max(0, 1 - scrollY / maxScroll);
            setScale(newScale);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);


    if (!playingTrack) {
        return null;
    }
    const {title, coverUrl, genre} = playingTrack || {};

    return (
        <div
            className={styles.content}
            style={{
                transform: `scale(${scale})`,
                opacity: scale + 0.1,
            }}
        >
        <div className="flex flex-col items-center gap-2">
            <h2 className={styles.title}>{title}</h2>
            <h2 className={styles.subtitle}>{genre}</h2>
        </div>
        <div className={styles.background}>
            <img src={coverUrl || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='} alt="Track cover" className={styles.img}/>
        </div>
        <div className={styles.overlay}/>
    </div>)
};
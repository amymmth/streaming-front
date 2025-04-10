import React, {useEffect, useMemo, useRef, useState} from 'react';
import styles from './playlist.module.css';
import {Track, useTracks} from "entities/music/track";
import {ScrollArea} from 'shared/ui/scroll-area';
import {useTrackGeneration} from "features/music-generator/create-song-button/useTrackGeneration.ts";
import {cn, formatTime} from "shared/lib/utils.ts";
import {usePlayingTrack} from "entities/music/music-player";
import {DownloadIcon, Loader2, Play, Trash2} from "lucide-react";
import {styled} from "@linaria/react";
import {useInitializeTracks} from "entities/music/track/hooks/use-track.ts";
import {Button} from "shared/ui/button.tsx";
import {Share1Icon} from "@radix-ui/react-icons";
import Logo from 'shared/ui/symformer-logo/assets/logo-image.png';
import {Dialog, DialogContent, DialogDescription, DialogTitle} from 'shared/ui/dialog';
import {useDeleteSongMutation} from "shared/api/music-generation/combined.generated.tsx";
import QRCodeStyling from "qr-code-styling";
import {Toast} from "shared/ui/toast";

export const Playlist: React.FC = () => {
    const {loading} = useInitializeTracks();
    const {tracks} = useTracks();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const playingTrackRef = useRef<HTMLDivElement>(null); // Ref для проигрываемого трека


    // Скролл в конец при инициализации
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [tracks]);

    useEffect(() => {
        if (playingTrackRef.current && scrollAreaRef.current) {
            const trackElement = playingTrackRef.current;
            const scrollArea = scrollAreaRef.current;
            const {offsetTop, offsetHeight} = trackElement;

            // Если элемент не полностью виден, прокрутить
            if (offsetTop < scrollArea.scrollTop || offsetTop + offsetHeight > scrollArea.scrollTop + scrollArea.offsetHeight) {
                scrollArea.scrollTop = offsetTop - scrollArea.offsetHeight / 2 + offsetHeight / 2;
            }
        }
    }, [playingTrackRef.current]);
    const [toastMessage, setToastMessage] = useState('');

    return (
        <>
            <div className={cn(styles.container, 'md:!-mt-8') }>
                <h2 className={styles.title}>Плейлист</h2>
                <ScrollArea viewportRef={scrollAreaRef} className={'w-full flex-1 overflow-y-hidden'}>
                    {loading ? (
                        <div className={'flex justify-center items-center w-full h-full'}>
                            <Loader2 className={'animate-spin'}/>
                        </div>
                    ) : <div className={styles.trackList}>
                        {tracks.map((track) => (
                            <TrackItem
                                key={track.id}
                                track={track}
                                playingTrackRef={playingTrackRef}
                                onErrorMessage={setToastMessage}
                            />
                        ))}
                    </div>}
                </ScrollArea>
            </div>

            <Toast
                open={!!toastMessage}
                onOpenChange={(open) => {
                    if (!open) setToastMessage('');
                }}
                title={toastMessage}
                description={'Попробуйте еще раз'}
                swipeDirection="right"
                autoCloseDelay={7000}
            />
        </>
    );
};

const TrackItem = ({track, playingTrackRef, onErrorMessage}: {
    track: Track,
    playingTrackRef: React.RefObject<HTMLDivElement>,
    onErrorMessage: (message: string) => void
}) => {
    const {
        playingTrack,
        isPlaying,
        onPause,
        onPlay,
        setPlayingTrack,
    } = usePlayingTrack();
    const {removeTrack, tracks} = useTracks()
    const isSelected = playingTrack?.id === track.id;
    const [isModalOpen, setModalOpen] = useState(false);
    const [deleteSong] = useDeleteSongMutation();


    useTrackGeneration(
        track,
        ((error) => {
            onErrorMessage(error);
            handleDelete()
        })
    );

    const loading = track.status !== 'Finished';

    const handleDelete = () => {
        deleteSong({variables: {id: track.id}}).then(() => {
            removeTrack(track.id);
            onPause();

            const nextTrack = tracks.findIndex((t) => t.id === track.id) < tracks.length - 1 ? tracks[tracks.findIndex((t) => t.id === track.id) + 1] : null;
            const prevTrack = tracks.findIndex((t) => t.id === track.id) > 0 ? tracks[tracks.findIndex((t) => t.id === track.id) - 1] : null;

            if (nextTrack) {
                setPlayingTrack(nextTrack);
            } else if (prevTrack) {
                setPlayingTrack(prevTrack);
            }

        });
    };

    return (
        <>
            <div
                ref={isSelected ? playingTrackRef : undefined}
                className={cn(styles.track, isSelected ? "bg-stone-800 bg-opacity-40" : "bg-transparent")}
                onClick={() => {
                    if (!track.coverUrl) return;
                    if (loading) {
                        if (!isSelected) setPlayingTrack(track)
                        return;
                    }
                    if (isSelected) {
                        if (isPlaying) {
                            onPause();
                        } else {
                            onPlay();
                        }
                    } else {
                        setPlayingTrack(track);
                        onPlay();
                    }
                }}>
                <div className={styles.cover}>
                    <img
                        src={track.coverUrl || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}
                        alt=""
                        className="w-full h-full object-cover bg-white/20 border-0"
                    />
                    <Icon>
                        {loading ? (
                            <Loader2 className="animate-spin"/>
                        ) : isPlaying && isSelected ? (
                            <AnimationBars>
                                <Bar/>
                                <Bar/>
                                <Bar/>
                            </AnimationBars>
                        ) : !isPlaying && isSelected ? (
                            <Play/>
                        ) : null}
                    </Icon>

                </div>
                <div className={'flex items-center justify-between w-full'}>
                    <div
                        className={
                            cn(styles.info,
                                loading && "opacity-50 pointer-events-none",
                            )}
                    >
                        <div className={styles.trackTitle}>{track.title}</div>
                        <div className={styles.genre}>{track.genre}</div>
                        <div
                            className={cn(styles.genre, 'text-[12px] ')}>{track.duration ? formatTime(track.duration) : '--:--'}</div>
                    </div>
                    <div className={'flex gap-2 ml-2'}>
                        <div className={'md:hidden'}>
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                disabled={loading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = `${import.meta.env.VITE_MUSIC_GENERATION_API_URL}/song-file/${track.id}`;
                                    link.download = `${track.title}.mp3`;
                                    link.setAttribute('rel', 'noopener noreferrer');
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                            >
                                <DownloadIcon className="!w-4 !h-4"/>
                            </Button>
                        </div>
                        <div className={"hidden md:flex"}>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                disabled={loading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModalOpen(true); // Открываем модальное окно
                                }}
                            >
                                <Share1Icon className="!w-5 !h-5 opacity-60"/>
                            </Button>
                        </div>

                        {/* Модальное окно */}
                        {isModalOpen && (
                            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                                <DialogContent>
                                    <DialogTitle className={'sr-only'}>
                                        Поделитесь песней
                                    </DialogTitle>
                                    <DialogDescription className={'sr-only'}>
                                        Поделитесь песней через QR-код
                                    </DialogDescription>
                                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                        <h3 className="text-4xl font-normal text-center w-full mb-6 line-clamp-2">Поделитесь
                                            песней<span
                                                className="font-medium ml-1"> {track.title}</span>
                                        </h3>
                                        <div style={{
                                            height: "auto",
                                            margin: "0 auto",
                                            maxWidth: 512 / 1.5,
                                            width: "100%"
                                        }}
                                             className={'p-2 bg-white rounded-lg'}>
                                            <CustomCircleQRCode
                                                text={`${import.meta.env.VITE_MUSIC_GENERATION_API_URL}/song-file/${track.id}`}/>
                                        </div>
                                    </div>
                                </DialogContent>

                            </Dialog>
                        )}

                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            disabled={loading}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                        >
                            <Trash2 className="!w-5 !h-5 opacity-60"/>
                        </Button>
                    </div>


                </div>
            </div>

        </>
    );
};

const Icon = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
`;


const AnimationBars = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
    justify-content: center;
`;

const Bar = styled.span`
    width: 4px;
    height: 12px;
    background-color: white;
    animation: bounce 1s infinite ease-in-out;

    &:nth-child(1) {
        animation-delay: -0.2s;
    }

    &:nth-child(2) {
        animation-delay: -0.1s;
    }

    &:nth-child(3) {
        animation-delay: 0s;
    }

    @keyframes bounce {
        0%, 40%, 100% {
            transform: scaleY(1);
        }
        20% {
            transform: scaleY(1.8);
        }
    }
`;


type QRCodeProps = {
    text: string;
};

const CustomCircleQRCode: React.FC<QRCodeProps> = ({ text }) => {
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<QRCodeStyling | null>(null);
    const [qrCodeSize, setQrCodeSize] = useState(320);
    const [isQRCodeReady, setIsQRCodeReady] = useState(false);

    const getSvgPosition = (offset: number) => {
        const padding = -0.05;
        return offset - padding * offset;
    };

    const svgPosition = getSvgPosition(qrCodeSize);
    const scaleFactor = svgPosition / qrCodeSize;

    useEffect(() => {
        const updateQRCode = () => {
            if (qrCodeRef.current) {
                const newSize = qrCodeRef.current.offsetWidth;
                setQrCodeSize(newSize);

                if (!qrCodeInstance.current) {
                    qrCodeInstance.current = new QRCodeStyling({
                        width: newSize,
                        height: newSize,
                        data: text,
                        cornersSquareOptions: { color: "#ffffff" },
                        backgroundOptions: { color: '#ffffff' },
                        cornersDotOptions: { color: '#ffffff' },
                        dotsOptions: { color: '#000000', type: 'square' },
                        qrOptions: { typeNumber: 0, errorCorrectionLevel: "L" },
                        image: Logo,
                        imageOptions: {
                            margin: 1,
                            imageSize: 0.6,
                            hideBackgroundDots: true,
                        }
                    });
                    qrCodeInstance.current.append(qrCodeRef.current);
                } else {
                    qrCodeInstance.current.update({
                        width: newSize,
                        height: newSize,
                        data: text
                    });
                }
                if (qrCodeInstance.current?._svgDrawingPromise) {
                    qrCodeInstance.current._svgDrawingPromise.then(() => setIsQRCodeReady(true));
                }
            }
        };

        updateQRCode();

        const resizeObserver = new ResizeObserver(updateQRCode);
        if (qrCodeRef.current) {
            resizeObserver.observe(qrCodeRef.current);
        }

        return () => {
            if (qrCodeRef.current) {
                resizeObserver.unobserve(qrCodeRef.current);
            }
            setIsQRCodeReady(false);
        };
    }, [text]);

    return (
        <div className="relative w-full h-full"
             style={{ opacity: isQRCodeReady ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
        >
            <div ref={qrCodeRef} className="w-full" style={{height: `${qrCodeSize}px`}} />
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox={`0 0 ${qrCodeSize} ${qrCodeSize}`}
                className="absolute top-[5px] left-[5px] w-[calc(100%-10px)] h-[calc(100%-10px)] pointer-events-none"
            >
                {['top-left', 'top-right', 'bottom-left', ].map((corner) => (
                    <g
                        key={corner}
                        transform={`translate(${corner.includes('right') ? qrCodeSize - 10 : 10},${
                            corner.includes('bottom') ? qrCodeSize - 10 : 10
                        }) scale(${corner.includes('right') ? -scaleFactor : scaleFactor},${
                            corner.includes('bottom') ? -scaleFactor : scaleFactor
                        })`}
                    >
                        <path d="M15.7,0C7,0,0,7,0,15.7v39.5h55.2V0H15.7z M47.7,47.7H7.5v-30c0-5.7,4.6-10.3,10.3-10.3h30V47.7z" />
                        <path d="M39.6,39.6h-24V21.1c0-3,2.4-5.5,5.5-5.5h18.5V39.6z" />
                    </g>
                ))}
            </svg>
        </div>
    );
};

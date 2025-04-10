import {useTracks} from "entities/music/track";
import {useEffect, useState} from "react";
import {ScrollArea} from "shared/ui/scroll-area.tsx";
import {Collapsible, CollapsibleContent} from "shared/ui/collapsible.tsx";
import {Button} from "shared/ui/button.tsx";
import {usePlayingTrack} from "entities/music/music-player";
import {useSelectedTrack} from "entities/music/track/hooks/use-track.ts";


export const AboutTrack = () => {
    const {selectedTrack} = useSelectedTrack()
    const [isOpen, setIsOpen] = useState(false)
    const { playingTrack} = usePlayingTrack()

    useEffect(() => {
        if (selectedTrack) {
            setIsOpen(false)
        }

    }, [selectedTrack]);


    return (
        <ScrollArea className={'w-full min-h-full h-full'}>
            {selectedTrack &&
                <>
                    <img
                        src="/placeholder.jpeg"
                        alt={selectedTrack?.title}
                        className={'w-full h-64 object-cover  overflow-hidden mb-6'}
                    />
                    <div className={' px-4 '}>

                        <p className="font-semibold text-xl">{selectedTrack?.title} </p>
                        <p className="font-light text-xs"> {selectedTrack?.genre}</p>
                        {selectedTrack?.lyrics?.length > 100 ?
                            <Collapsible
                                open={isOpen}
                                onOpenChange={setIsOpen}
                                className={`mt-8 ${playingTrack ? 'pb-[140px]' : ''} space-y-1`}
                            >

                                <h4 className="font-light uppercase text-stone-400 text-xs">Текст песни</h4>

                                <p className="whitespace-pre-wrap text-stone-200 text-sm relative">
                            <span onClick={() => setIsOpen(!isOpen)}
                            >{selectedTrack?.lyrics?.substring(0, 100)}</span>{!isOpen ? '...' : ''}
                                    {!isOpen && <div
                                        className="absolute w-full h-2/4 bottom-0 left-0 bg-gradient-to-t from-background user-select-none pointer-events-none"
                                    />}

                                    <CollapsibleContent className="inline">
                                        <span onClick={() => setIsOpen(!isOpen)}>{selectedTrack?.lyrics?.substring(100)}</span>
                                    </CollapsibleContent>
                                </p>
                                {!isOpen && <Button onClick={() => setIsOpen(!isOpen)} variant="link" size="sm"
                                                    className="z-10 relative text-purple-500 px-0 underline-offset-0">
                                    Весь текст
                                </Button>}
                            </Collapsible> : (
                                <div className={`mt-8 ${playingTrack ? 'pb-[140px]' : ''}`}>
                                    <h4 className="font-light uppercase text-stone-400 text-xs">Текст песни</h4>
                                    <p className="whitespace-pre-wrap text-stone-200 text-sm">
                                        {selectedTrack?.lyrics}
                                    </p>
                                </div>

                            )
                        }
                    </div>
                </>}
        </ScrollArea>
    )
}
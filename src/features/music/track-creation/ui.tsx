import {useTrackCreation} from "./useTrackCreation.ts";
import {FC} from "react";
import {MusicIcon} from "lucide-react";
import {Button} from "shared/ui/button";
import {useLyrics} from "entities/music/lyrics";
import {styled} from "@linaria/react";
import {css} from "@linaria/core";

const buttonStyle = css`
    position: relative;
    display: flex;
    padding: 1.5rem !important;
    height: auto !important;
    font-size: 1.40625rem !important;
    border-radius: 99999rem !important;
    background: linear-gradient(135deg, #cd18cd, #00a6ff);
    color: white;
    text-align: center;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    overflow: hidden;
    z-index: 1;

    &:hover {
        box-shadow: inset 0 4px 200px rgba(103, 58, 183, 0.5);
    }
`;

const IconWrapper = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    .icon {
        width: 1.5rem;
        height: 1.5rem;
    }
`;


export const CreateTrackButton: FC = () => {
    const {createTrack} = useTrackCreation();
    const {lyrics} = useLyrics();

    return (
        <Button
            className={buttonStyle}
            variant={'secondary'}
            onClick={createTrack}
            disabled={lyrics.length === 0}
        >

            <IconWrapper>
                <MusicIcon className={'icon'}/>
                <div>Создать</div>
            </IconWrapper>
        </Button>
    );
};
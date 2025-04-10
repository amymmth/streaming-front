import React from 'react';
import {SongTheme} from "../song-themes.model";
import {TagList} from "shared/ui/tag-list";



export const SongThemeTags: React.FC<{
    themes: SongTheme[]
    onChange: (theme: SongTheme) => void
    activeTheme: SongTheme | null
    disabled?: boolean
}> = ({themes, onChange, activeTheme, disabled}) => {

    return (
        <TagList
            tags={themes.map((theme) => theme.label)}
            activeTag={activeTheme?.label ? [activeTheme.label] : null}
            onClick={(tag) => {
                onChange(themes.find((theme) => tag.includes(theme.label))!);
            }}
            disabled={disabled}
        />
    );
};


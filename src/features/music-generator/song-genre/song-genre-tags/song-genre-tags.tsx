import React from 'react';
import {TagList} from "shared/ui/tag-list";


export const SongGenreTags: React.FC<{
    genres: string[]
    activeGenres: string[] | null
    setActiveGenre: (genres: string[]) => void
}> = ({genres, activeGenres, setActiveGenre}) => {

    return (
        <TagList
            tags={genres}
            activeTag={activeGenres}
            onClick={setActiveGenre}
            multiple
        />
    );
};


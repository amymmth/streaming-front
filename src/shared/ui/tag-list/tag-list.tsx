import React, { useEffect, useRef, useState } from 'react';
import styles from './tag-list.module.css';
import { cn } from 'shared/lib/utils.ts';

type TagListProps = {
    tags: string[];
    activeTag: string[] | null;
    onClick: (tag: string[] ) => void;
    multiple?: boolean;
    disabled?: boolean
};

type TagProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean
};

const Tag: React.FC<TagProps> = ({ label, isActive, onClick, disabled }) => (
    <button
        className={cn(styles.tag, isActive && styles.active, disabled && 'opacity-50 cursor-not-allowed')}
        onClick={onClick}
        disabled={disabled}
    >
        {label}
    </button>
);

export const TagList: React.FC<TagListProps> = ({
                                                    tags,
                                                    activeTag,
                                                    onClick,
                                                    multiple = false,
                                                    disabled
                                                }) => {
    const [showFade, setShowFade] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                setShowFade(
                    containerRef.current.scrollWidth > containerRef.current.clientWidth
                );
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const handleTagClick = (tag: string) => {
        if (multiple) {
            const currentActive = activeTag || [];
            const isActive = currentActive.includes(tag);
            const updatedTags = isActive
                ? currentActive.filter((t) => t !== tag) // Удаляем тег
                : [...currentActive, tag]; // Добавляем тег
            onClick(updatedTags);
        } else {
            onClick([tag]); // Оборачиваем в массив для совместимости
        }
    };
    return (
        <div className="relative">
            <div ref={containerRef} className={cn(styles.container, showFade ? styles.fade : '')}>
                {tags.map((tag) => (
                    <Tag
                        key={tag}
                        label={tag}
                        isActive={Array.isArray(activeTag) && activeTag.includes(tag)}
                        onClick={() => !disabled &&handleTagClick(tag)}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    );
};


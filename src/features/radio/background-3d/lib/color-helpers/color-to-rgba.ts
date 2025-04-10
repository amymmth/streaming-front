import {Color} from "three";

export const colorToRgba = (color?: Color, alpha: number = 1): string => {
    if (!color) return 'rgba(0, 0, 0, alpha)';
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
};
import {Color} from "three";

export const colorToRgba = (color?: Color, alpha: number = 1): string => {
    if (!color) return 'rgba(0, 0, 0, alpha)';
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
};
export const colorToHslWithAlpha = (color?: Color, alpha: number = 1): string => {
    if (!color) return 'hsl(0, 0%, 0%)';
    const hsl = color.getHSL({ h: 0, s: 0, l: 0 });

    // Смешиваем с белым цветом (l = 100%) в зависимости от alpha
    const adjustedLightness = hsl.l * alpha; // Lerp между lightness и чёрным
    const hue = Math.round(hsl.h * 360); // Преобразуем доли в градусы
    const saturation = Math.round(hsl.s * 100); // Преобразуем доли в проценты
    const lightness = Math.round(adjustedLightness * 100); // Преобразуем в проценты

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
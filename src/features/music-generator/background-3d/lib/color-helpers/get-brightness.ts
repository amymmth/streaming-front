import {Color} from "three";

export const getBrightness = (color: Color) => (color.r + color.g + color.b) / 3;

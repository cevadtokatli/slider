import {SliderElement, SliderType} from "./slider";

export interface Options {
    el: string|HTMLElement;
    timing?: string;
    duration?: number;
    sliderType?: SliderType;
    touchMove?: boolean;
    list?: boolean;
    asList?: string|HTMLUListElement|HTMLOListElement;
    arrows?: boolean;
    asPrevArrow?: string|HTMLElement;
    asNextArrow?: string|HTMLElement;
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    imageSettings?: SliderElement[];
}
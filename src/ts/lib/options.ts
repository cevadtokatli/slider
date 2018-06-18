import {SliderType} from "./slider-type";
import {SliderElement} from "./slider-element";

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

export const defaultOptions:Options = {
    el: null,
    timing: 'ease',
    duration: 800,
    sliderType: SliderType.Carousel,
    touchMove: true,
    list: true,
    arrows: true,
    autoPlay: false,
    autoPlaySpeed: 5000,
    imageSettings: []
};
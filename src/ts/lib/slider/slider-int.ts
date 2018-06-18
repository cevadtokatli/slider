import {SliderElement} from "../slider-element";
import Emitter from "../../helper/emitter";

export interface Slider {
    init(sliderEl:SliderElement): void;
    animate(nextEl:SliderElement, prevEl:SliderElement, status:boolean, emitter:Emitter): Promise<void>;
}
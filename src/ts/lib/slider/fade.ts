import {Slider} from "./slider-int";
import {SliderElement} from "../slider-element";
import Emitter from "../../helper/emitter";
import Util from "../../helper/util";

export const Fade:Slider = {
    init(sliderEl:SliderElement): void {},
    animate(nextEl:SliderElement, prevEl:SliderElement, status:boolean, emitter:Emitter): Promise<void> {
        return new Promise(resolve => {
            let container:HTMLDivElement = emitter.get<HTMLDivElement>('_container'),
                timing:string = emitter.get<string>('_timing'),
                duration:number = emitter.get<number>('_duration');

            container.classList.add('ms-fade');
            prevEl.wrapperEl.classList.add('ms-fade-prev');
            nextEl.wrapperEl.setAttribute('style', [Util.setCSSPrefix(`animation-timing-function:${timing}`), Util.setCSSPrefix(`animation-duration:${duration}ms`)].join(''));
            nextEl.wrapperEl.classList.add('ms-fade-next');
            nextEl.wrapperEl.classList.add('ms-active');

            requestAnimationFrame(() => {
                nextEl.wrapperEl.classList.add('ms-fade-animation');

                Util.addMultiEventListenerOnce(nextEl.wrapperEl, Util.animationEndEvents, () => {
                    container.classList.remove('ms-fade');
                    prevEl.wrapperEl.classList.remove('ms-active');
                    prevEl.wrapperEl.classList.remove('ms-fade-prev');
                    nextEl.wrapperEl.removeAttribute('style');
                    nextEl.wrapperEl.classList.remove('ms-fade-next');
                    nextEl.wrapperEl.classList.remove('ms-fade-animation');
                    resolve();
                });
            });
        });
    }
}
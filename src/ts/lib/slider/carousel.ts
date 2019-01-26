import {Slider} from "./slider-int";
import {SliderElement} from "../slider-element";
import Emitter from "../../helper/emitter";
import Util from "../../helper/util";

export const Carousel:Slider = {
    init(sliderEl:SliderElement): void {},
    animate(nextEl:SliderElement, prevEl:SliderElement, status:boolean, emitter:Emitter): Promise<void> {
        return new Promise(resolve => {
            let container:HTMLDivElement = emitter.get<HTMLDivElement>('_container'),
                timing:string = emitter.get<string>('_timing'),
                duration:number = emitter.get<number>('_duration');

            container.setAttribute('style', [Util.setCSSPrefix(`animation-timing-function:${timing}`), Util.setCSSPrefix(`animation-duration:${duration}ms`)].join(''));
            container.classList.add('ms-carousel');
            if(!status) {
                container.classList.add('ms-carousel-reverse');
            }

            nextEl.wrapperEl.classList.add('ms-carousel-next');
            nextEl.wrapperEl.classList.add('ms-active');

            requestAnimationFrame(() => {
                container.classList.add('ms-carousel-animation');

                Util.addMultiEventListenerOnce(container, Util.animationEndEvents, () => {
                    container.removeAttribute('style');
                    container.classList.remove('ms-carousel');
                    if(!status) {
                        container.classList.remove('ms-carousel-reverse');
                    }
                    container.classList.remove('ms-carousel-animation');

                    prevEl.wrapperEl.classList.remove('ms-active');
                    nextEl.wrapperEl.classList.remove('ms-carousel-next');
                    resolve();
                });
            });
        });
    }
}
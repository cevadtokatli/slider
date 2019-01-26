import {Slider} from "./slider-int";
import {SliderElement} from "../slider-element";
import Emitter from "../../helper/emitter";
import Util from "../../helper/util";

export const Flow:Slider = {
    init(sliderEl:SliderElement): void {},
    animate(nextEl:SliderElement, prevEl:SliderElement, status:boolean, emitter:Emitter): Promise<void> {
        return new Promise(resolve => {
            let container:HTMLDivElement = emitter.get<HTMLDivElement>('_container'),
                timing:string = emitter.get<string>('_timing'),
                duration:number = emitter.get<number>('_duration');
            
            container.classList.add('ms-flow');
            if(!status) {
                container.classList.add('ms-flow-reverse');
            }

            prevEl.wrapperEl.classList.add('ms-flow-prev');
            nextEl.wrapperEl.setAttribute('style', [Util.setCSSPrefix(`animation-timing-function:${timing}`), Util.setCSSPrefix(`animation-duration:${duration}ms`)].join(''));
            nextEl.wrapperEl.classList.add('ms-active');
            nextEl.wrapperEl.classList.add('ms-flow-next');

            requestAnimationFrame(() => {
                nextEl.wrapperEl.classList.add('ms-flow-animation');

                Util.addMultiEventListenerOnce(nextEl.wrapperEl, Util.animationEndEvents, () => {
                    container.classList.remove('ms-flow');
                    if(!status) {
                        container.classList.remove('ms-flow-reverse');
                    }

                    prevEl.wrapperEl.classList.remove('ms-active');
                    prevEl.wrapperEl.classList.remove('ms-flow-prev');
                    nextEl.wrapperEl.classList.remove('ms-flow-next');
                    nextEl.wrapperEl.classList.remove('ms-flow-animation');
                    nextEl.wrapperEl.removeAttribute('style');
                    resolve();
                });
            });
        });
    }
}
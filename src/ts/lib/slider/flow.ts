import {Slider} from "./slider-int";
import {SliderElement} from "../slider-element";
import Emitter from "../../helper/emitter";
import Util from "../../helper/util";

export const Flow:Slider = {
    init(sliderEl:SliderElement): void {},
    animate(nextEl:SliderElement, prevEl:SliderElement, status:boolean, emitter:Emitter): Promise<void> {
        return new Promise(resolve => {
            let container:HTMLDivElement = emitter.get<HTMLDivElement>('_container');
            let timing:string = emitter.get<string>('_timing');
            let duration:number = emitter.get<number>('_duration');

            let style:string = nextEl.el.getAttribute('style') || '';
            nextEl.el.style.width = nextEl.wrapperEl.offsetWidth + 'px';

            requestAnimationFrame(() => {
                container.classList.add('ms-flow');
                if(!status) {
                    container.classList.add('ms-flow-reverse');
                }

                prevEl.wrapperEl.classList.add('ms-flow-prev');
                nextEl.wrapperEl.setAttribute('style', [Util.setCSSPrefix(`animation-timing-function:${timing}`), Util.setCSSPrefix(`animation-duration:${duration}ms`)].join(''));
                nextEl.wrapperEl.classList.add('ms-flow-next');
                nextEl.wrapperEl.classList.add('ms-active');

                requestAnimationFrame(() => {
                    nextEl.wrapperEl.classList.add('ms-flow-animation');

                    Util.addMultiEventListenerOnce(nextEl.wrapperEl, Util.animationEndEvents, () => {
                        container.classList.remove('ms-flow');
                        if(!status) {
                            container.classList.remove('ms-flow-reverse');
                        }

                        prevEl.wrapperEl.classList.remove('ms-active');
                        prevEl.wrapperEl.classList.remove('ms-flow-prev');
                        nextEl.wrapperEl.removeAttribute('style');
                        nextEl.wrapperEl.classList.remove('ms-flow-next');
                        nextEl.wrapperEl.classList.remove('ms-flow-animation');
                        nextEl.el.setAttribute('style', style);
                        resolve();
                    });
                });
            });
        });
    }
}
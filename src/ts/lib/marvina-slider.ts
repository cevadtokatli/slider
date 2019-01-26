import Util from "../helper/util";
import {SliderType} from "./slider-type";
import {TouchMove} from "./touch-move";
import {List} from "./list";
import {Arrows} from "./arrows";
import {SliderElement} from "./slider-element";
import {Callbacks, BeforeCallback, AfterCallback} from "./callbacks";
import Emitter from "../helper/emitter";
import {Options, defaultOptions} from "./options";
import * as Slider from "./slider/";
import {events} from "./events";

export class MarvinaSlider {
    private _el: HTMLElement;
    private _container: HTMLDivElement;
    private _timing: string;
    private _duration: number;
    private _sliderType: SliderType;
    private _touchMove: TouchMove;
    private _list: List;
    private _arrows: Arrows;
    private _autoPlay: boolean;
    private _autoPlaySpeed: number;
    private _autoPlayStatus: boolean = true;
    private _autoPlayContainer: HTMLDivElement;
    private _autoPlayInterval: NodeJS.Timer;
    private _elements: SliderElement[] = [];
    private _callbacks: Callbacks = {};
    private _index: number = 0;
    private _total: number;
    private _processing: boolean = false;
    private _emitter: Emitter = {
        emit: this.emit.bind(this),
        get: this.get.bind(this),
        set: this.set.bind(this)
    };

    constructor(o:Options=defaultOptions) {
        this.extractAttributes(o);

        if(!(this._el = Util.getElement(o.el))) {
            throw new Error('Element could not be found');
        }

        this._el.classList.add('ms');

        // elements & slider
        let msSliderEl:HTMLDivElement = document.createElement('div');
        msSliderEl.classList.add('ms-slider');
        msSliderEl.innerHTML = '<div class="ms-slider-element-container"></div>';
        let c:Node = this._el.childNodes[0];
        if(c) {
            this._el.insertBefore(msSliderEl, c);
        } else {
            this._el.appendChild(msSliderEl);
        }
        this._container = msSliderEl.querySelector('div');

        let imageSettingsObj:{[key: string]: SliderElement} = {};
        o.imageSettings.forEach((i:SliderElement) => {
            imageSettingsObj[i.id] = i;
        });

        let sliderNodeElements:NodeList = this._el.querySelectorAll('.ms-slider-element');
        for(let i:number=0; i<sliderNodeElements.length; i++) {
            let sliderHTMLElement:HTMLElement = <HTMLElement> sliderNodeElements[i];
            let id:string = sliderHTMLElement.getAttribute('ms-id');
            let sliderElement:SliderElement;

            setSliderElement: {
                if(id) {
                    sliderElement = imageSettingsObj[id];
                    if(sliderElement) {
                        break setSliderElement;
                    }
                }

                sliderElement = {};
            }

            sliderElement.el = sliderHTMLElement;
            let wrapperEl:HTMLDivElement = document.createElement('div');
            wrapperEl.classList.add('ms-slider-element-wrapper');
            sliderElement.wrapperEl = wrapperEl;
            this._elements.push(sliderElement);

            wrapperEl.appendChild(sliderHTMLElement);
            this._container.appendChild(wrapperEl);

            if(!sliderElement.sliderType) {
                sliderElement.sliderType = this._sliderType;
            }

            Slider[sliderElement.sliderType].init(sliderElement);
        }

        // index
        this._elements[this._index].wrapperEl.classList.add('ms-active');

        // total
        this._total = this._elements.length;

        // touchMove
        if(o.touchMove) {
            this._touchMove = new TouchMove(this._emitter);
        }

        // list / asList
        let asList:HTMLUListElement|HTMLOListElement = <HTMLUListElement|HTMLOListElement> Util.getElement(o.asList) || null;
        if(o.list || asList) {
            this._list = new List(this._emitter, o.list, asList);
        }

        // arrows / prevArrow / nextArrow
        if(o.arrows || o.asPrevArrow || o.asNextArrow) {
            this._arrows = new Arrows(this._emitter, o.arrows, {prevArrow:Util.getElement(o.asPrevArrow), nextArrow:Util.getElement(o.asNextArrow)});
        }

        // auto playing
        if(this._autoPlay) {
            this._autoPlayContainer = document.createElement('div');
            this._autoPlayContainer.className = 'ms-autoplay-container ms-active';
            this._autoPlayContainer.innerHTML = [
                '<svg class="ms-play" viewBox="0 0 48 48"> \t\t\t\t\t\t<path d="M16 10v28l22-14z"></path> \t\t\t\t\t</svg>',
                '<svg class="ms-stop" viewBox="0 0 512 512"> \t\t\t\t\t\t<rect height="320" width="60" x="153" y="96"></rect><rect height="320" width="60" x="299" y="96"></rect> \t\t\t\t\t</svg>',
            ].join('');
            this._autoPlayContainer.addEventListener(Util.events.mousedown, this.toggle.bind(this));
            this.setAutoPlayInterval(false);
            this._el.appendChild(this._autoPlayContainer);
        }
    }

    /**
     * Extracts attributes from default options.
     */
    private extractAttributes(o:Options): void {
        let i:string;
        for(i in defaultOptions) {
            if(typeof o[i] === 'undefined') {
               o[i] = defaultOptions[i];
            }
        }

        let properties:string[] = ['timing', 'duration', 'sliderType',  'autoPlay', 'autoPlaySpeed'];
        for(i in o) {
            if(properties.indexOf(i) > -1) {
                this['_'+i] = o[i];
            }
        }
    }

    /**
     * Adds a new element to the slider.
     */
    public add(el:string|HTMLElement, index:number, options:SliderElement={}): void {
        if((el = Util.getElement(el)) && index > -1 && index <= this._total) {
            let wrapperEl:HTMLDivElement = document.createElement('div');
            wrapperEl.classList.add('ms-slider-element-wrapper');
            el.classList.add('ms-slider-element');
            wrapperEl.appendChild(el);

            if(index < this._total) {
                this._container.insertBefore(wrapperEl, this._container.childNodes[index]);
            } else {
                this._container.appendChild(wrapperEl);
            }

            options.wrapperEl = wrapperEl;
            options.el = el;
            if(!options.sliderType) {
                options.sliderType = this._sliderType;
            }
            Slider[options.sliderType].init(options);
            this._elements.splice(index, 0, options);

            this._total += 1;
            if(this._index >= index) {
                this._index += 1;
            }

            if(this._list) {
                this._list.add();
                this._list.index = this._index;
            }
        }
    }

    /**
     * Adds a new element to the head of the slider.
     */
    public addFirst(el:string|HTMLElement, options:SliderElement={}): void {
        this.add(el, 0, options);
    }

    /**
     * Adds a new element to the end of the slider.
     */
    public addLast(el:string|HTMLElement, options:SliderElement={}): void {
        this.add(el, this._total, options);
    }

    /**
     * Removes the element at the specified index from the slider.
     */
    public remove(index:number): void {
        if(index > -1 && index < this._total && index != this._index && this._total > 2) {
            this._container.removeChild(this._container.childNodes[index]);
            this._elements.splice(index, 1);

            this._total -= 1;
            if(this._index > index) {
                this._index -= 1;
            }

            if(this._list) {
                this._list.remove();
                this._list.index = this._index;
            }
        }
    }

    /**
     * Removes the first element from the slider.
     */
    public removeFirst(): void {
        this.remove(0);
    }

    /**
     * Removes the last element from the slider.
     */
    public removeLast(): void {
        this.remove(this._total-1);
    }

    /**
     * Triggers the previous image. Returns false if the slider is in animation.
     */
    public prev(): Promise<boolean> {
        return new Promise(resolve => {
            if(!this._processing) {
                this.prevIndex()
                .then(resp => {
                    resolve(resp);
                });
            } else {
                resolve(false);
            }
        });
    }

    private prevIndex(touchMove:boolean=false): Promise<boolean> {
        return new Promise(resolve => {
            if(!this._processing || touchMove) {
                let nIndex:number = (this._index - 1 >= 0) ? this._index - 1 : this._total - 1;
                let prevEl:SliderElement = this._elements[this._index];
                let nextEl:SliderElement = this._elements[nIndex];
                this.setSliderAnimation(prevEl, nextEl, nIndex, false)
                .then(() => {
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Triggers the next image. Returns false if the slider is in animation.
     */
    public next(): Promise<boolean> {
        return new Promise(resolve => {
            if(!this._processing) {
                this.nextIndex()
                .then(resp => {
                    resolve(resp);
                });
            } else {
                resolve(false);
            }
        });
    }

    private nextIndex(touchMove:boolean=false, auto:boolean=false): Promise<boolean> {
        return new Promise(resolve => {
            if(!this._processing || touchMove) {
                let nIndex:number = (this._index + 1 < this._total) ? this._index + 1 : 0;
                let prevEl:SliderElement = this._elements[this._index];
                let nextEl:SliderElement = this._elements[nIndex];
                this.setSliderAnimation(prevEl, nextEl, nIndex, true, auto)
                .then(() => {
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Starts autoplay.
     */
    public play(): void {
        if(!this._autoPlayStatus) {
            this._autoPlayStatus = true;
            this._autoPlayContainer.classList.add('ms-active');
            this.setAutoPlayInterval();
            this._el.dispatchEvent(events.play);
        }
    }

    /**
     * Stops autoplay.
     */
    public stop(): void {
        if(this._autoPlayStatus) {
            this._autoPlayStatus = false;
            this._autoPlayContainer.classList.remove('ms-active');
            clearInterval(this._autoPlayInterval);
            this._el.dispatchEvent(events.stop);
        }
    }

    /**
     * Toggles autoplay.
     */
    public toggle(): void {
        if(this._autoPlayStatus) {
            this.stop();
        } else {
            this.play();
        }
    }

    /**
     * Destroys the slider.
     */
    public destroy(): void {
        if(this._touchMove) {
            this._touchMove.destroy();
        }

        if(this._list) {
            this._list.destroy();
        }

        if(this._arrows) {
            this._arrows.destroy();
        }

        if(this._autoPlay && this._autoPlayStatus) {
            clearInterval(this._autoPlayInterval);
        }

        this._el.innerHTML = '';
        this._el.classList.remove('ms');
        this._el.dispatchEvent(events.destroy);
    }

    /**
     * @param index: new index value
     * @param status: if the new index is greater than the current index, it's true and calls the next method.
     */
    private setSliderAnimation(prevEl:SliderElement, nextEl:SliderElement, index:number, status:boolean, auto:boolean=false): Promise<void> {
        return new Promise(async resolve => {
            this._processing = true;

            if(this._callbacks.before) {
                await this._callbacks.before(prevEl, nextEl);
            } if(prevEl.before) {
                await prevEl.before(prevEl, false);
            } if(nextEl.before) {
                await nextEl.before(nextEl, true);
            }

            this._index = index;
            if(this._list) {
                this._list.index = index;
            }
            await Slider[nextEl.sliderType].animate(nextEl, prevEl, status, this._emitter);

            if(this._callbacks.after) {
                await this._callbacks.after(nextEl, prevEl);
            } if(prevEl.after) {
                await prevEl.after(prevEl, false);
            } if(nextEl.after) {
                await nextEl.after(nextEl, true);
            }

            this._processing = false;
            this._el.dispatchEvent(events.change);

            if(this._autoPlay && this._autoPlayStatus && !auto) {
                clearInterval(this._autoPlayInterval);
                this.setAutoPlayInterval(false);
            }
            resolve();
        });
    }

    // es6 getter & setter
    get el(): HTMLElement {
        return this._el;
    }

    set beforeCallback(value: BeforeCallback) {
        this._callbacks.before = value;
    }

    set afterCallback(value: AfterCallback) {
        this._callbacks.after = value;
    }

    // getter & setter
    public getIndex(): number {
        return this._index;
    }

    public setIndex(index:number): Promise<boolean> {
        return new Promise(resolve => {
            if(!this._processing) {
                if(index > -1 && index < this._total && index != this._index) {
                    let prevEl:SliderElement = this._elements[this._index];
                    let nextEl:SliderElement = this._elements[index];
                    let status:boolean = (index > this._index) ? true : false;
                    this.setSliderAnimation(prevEl, nextEl, index, status)
                    .then(() => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }

    public getTotal(): number {
        return this._total;
    }

    public getCurrent(): SliderElement {
        return this._elements[this._index];
    }

    public getTiming(): string {
        return this._timing;
    }

    public setTiming(timing:string): void {
        this._timing = timing;
    }

    public getDuration(): number {
        return this._duration;
    }

    public setDuration(duration:number): void {
        this._duration = duration;
    }

    public getAutoPlaySpeed(): number {
        return this._autoPlaySpeed;
    }

    public setAutoPlaySpeed(speed:number): void {
        this._autoPlaySpeed = speed;

        if(this._autoPlay && this._autoPlayStatus) {
            clearInterval(this._autoPlayInterval);
            this.setAutoPlayInterval();
        }
    }

    private setAutoPlayInterval(duration:boolean=true): void {
        let speed:number = (!duration) ? this._autoPlaySpeed : (this._autoPlaySpeed + this._duration);
        this._autoPlayInterval = setInterval(() => { this.nextIndex(false,true); }, speed);
    }

    // emitter methods
    public emit<R>(method:string, args?:any[]): R {
        return this[method].apply(this, args);
    }

    public get<R>(property:string): R {
        return this[property];
    }

    public set<T>(property:string, value:T): void {
        this[property] = value;
    }
}
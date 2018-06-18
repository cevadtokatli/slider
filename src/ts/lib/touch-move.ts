import Emitter from "../helper/emitter";
import Util from "../helper/util";
import {events} from "./events";

export class TouchMove {
    private _el:HTMLElement;
    private _container:HTMLDivElement;
    private _startX: number;
    private _time: number;
    private _emitter:Emitter;

    constructor(emitter:Emitter) {
        this._emitter = emitter;
        this._el = this._emitter.get<HTMLElement>('_el');
        this._container = this._emitter.get<HTMLDivElement>('_container');

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);

        this._container.addEventListener(Util.events.mousedown, this.start, true);
    }

    /**
     * Starts touching.
     */
    private start(e:Event): void {
        let processing:boolean = this._emitter.get<boolean>('_processing');
        if(!processing) {
            this._emitter.set<boolean>('_processing', true);
            this._el.dispatchEvent(events.touchStart);
            this._startX = <number> (<any>e).clientX || (<any>e).pageX;
            this._time = new Date().getTime();
            window.addEventListener(Util.events.mouseup, this.end, true);
        }

        e.preventDefault();
    }

    /**
     * Ends touching.
     */
    private end(e:Event): void {
        this.destroy();
        this._el.dispatchEvent(events.touchEnd);

        let endX:number = <number> (<any>e).clientX || (<any>e).pageX;
        let x:number = endX - this._startX;
        let t:number = new Date().getTime() - this._time;
        if(Math.abs(x) >= 25 && t <= 250) {
            if(x <= 0) {
                this._emitter.emit('nextIndex', [true]);
            } else {
                this._emitter.emit('prevIndex', [true]);
            }
        } else {
            this._emitter.set<boolean>('_processing', false);
        }

        e.preventDefault();
    }

    /**
     * Removes the event listener.
     */
    public destroy(): void {
        window.removeEventListener(Util.events.mouseup, this.end, true);
    }
}
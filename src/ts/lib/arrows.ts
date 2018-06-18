import Emitter from "../helper/emitter";
import Util from "../helper/util";

export interface ArrowElements {
    prevArrow?: HTMLElement;
    nextArrow?: HTMLElement;
}

export class Arrows {
    private _arrowEls: ArrowElements;
    private _asArrows: ArrowElements = {};
    private _emitter: Emitter;

    constructor(emitter:Emitter, arrows:boolean, asArrows:ArrowElements) {
        this._emitter = emitter;

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);

        if(arrows) {
            let mainEl:HTMLElement = this._emitter.get('_el');

            let prevArrow:HTMLDivElement = document.createElement('div');
            prevArrow.className = 'ms-arrow ms-prev-arrow';
            prevArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792"><path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"/></svg>';
            mainEl.appendChild(prevArrow);
            prevArrow.addEventListener(Util.events.mousedown, this.prev, true);

            let nextArrow:HTMLDivElement = document.createElement('div');
            nextArrow.className = 'ms-arrow ms-next-arrow';
            nextArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792"><path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"/></svg>';
            mainEl.appendChild(nextArrow);
            nextArrow.addEventListener(Util.events.mousedown, this.next, true);

            this._arrowEls = {
                prevArrow,
                nextArrow
            };
        }

        if(asArrows.prevArrow) {
            asArrows.prevArrow.addEventListener(Util.events.mousedown, this.prev, true);
            this._asArrows.prevArrow = asArrows.prevArrow;
        }

        if(asArrows.nextArrow) {
            asArrows.nextArrow.addEventListener(Util.events.mousedown, this.next, true);
            this._asArrows.nextArrow = asArrows.nextArrow;
        }
    }

    /**
     * Triggers the previous image.
     */
    private prev(): void {
        this._emitter.emit('prev');
    }

    /**
     * Triggers the next image.
     */
    private next(): void {
        this._emitter.emit('next');
    }

    /**
     * Removes the event listeners.
     */
    public destroy(): void {
        if(this._asArrows.prevArrow) {
            this._asArrows.prevArrow.removeEventListener(Util.events.mousedown, this.prev, true);
        }

        if(this._asArrows.nextArrow) {
            this._asArrows.nextArrow.removeEventListener(Util.events.mousedown, this.next, true);
        }
    }
}
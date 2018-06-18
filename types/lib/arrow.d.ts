import {Emitter} from "../helper";

export interface ArrowElements {
    prevArrow?: HTMLElement;
    nextArrow?: HTMLElement;
}

export declare class Arrows {
    private _arrowEls: ArrowElements;
    private _asArrows: ArrowElements;
    private _emitter: Emitter;

    constructor(emitter:Emitter, arrows:boolean, asArrows:ArrowElements);
    private prev(): void;
    private next(): void;
    public destroy(): void;
}
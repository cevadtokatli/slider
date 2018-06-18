import {Emitter} from "../helper";

export declare class TouchMove {
    private _el:HTMLElement;
    private _container:HTMLDivElement;
    private _startX: number;
    private _time: number;
    private _emitter:Emitter;

    constructor(emitter:Emitter);
    private start(e:Event): void;
    private end(e:Event): void;
    public destroy(): void;
}
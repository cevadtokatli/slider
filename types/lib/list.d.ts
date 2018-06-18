import {Emitter} from "../helper";

export declare class List {
    private _listEl: HTMLUListElement;
    private _asList: HTMLUListElement|HTMLOListElement;
    private _index: number;
    private _emitter: Emitter;

    constructor(emitter:Emitter, list:boolean, asList:HTMLUListElement|HTMLOListElement);
    private setIndex(e:Event): void;
    private setActive(): void;
    public add(): void;
    public remove(): void;
    public destroy(): void;
}
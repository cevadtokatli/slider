import {SliderElement, SliderType} from "./slider";
import {TouchMove} from "./touch-move";
import {Emitter} from "../helper";
import {List} from "./list";
import {Arrows} from "./arrow";
import {AfterCallback, BeforeCallback, Callbacks} from "./callbacks";
import {Options} from "./options";

export declare class MarvinaSlider {
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
    private _autoPlayStatus: boolean;
    private _autoPlayContainer: HTMLDivElement;
    private _autoPlayInterval: NodeJS.Timer;
    private _elements: SliderElement[];
    private _callbacks: Callbacks;
    private _index: number;
    private _total: number;
    private _processing: boolean;
    private _emitter: Emitter;
    public el:HTMLElement;
    public beforeCallback:BeforeCallback;
    public afterCallback:AfterCallback;

    constructor(o?:Options);
    private extractAttributes(o:Options): void;
    public add(el:string|HTMLElement, index:number, options?:SliderElement): void;
    public addFirst(el:string|HTMLElement, options?:SliderElement): void;
    public addLast(el:string|HTMLElement, options?:SliderElement): void;
    public remove(index:number): void;
    public removeFirst(): void;
    public removeLast(): void;
    public prev(): Promise<boolean>;
    private prevIndex(touchMove?:boolean): Promise<boolean>;
    public next(): Promise<boolean>;
    private nextIndex(touchMove?:boolean, auto?:boolean): Promise<boolean>;
    public play(): void;
    public stop(): void;
    public toggle(): void;
    public destroy(): void;
    private setSliderAnimation(prevEl:SliderElement, nextEl:SliderElement, index:number, status:boolean, auto?:boolean): Promise<void>;

    public getIndex(): number;
    public setIndex(index:number): Promise<boolean>;
    public getTotal(): number;
    public getCurrent(): SliderElement;
    public getTiming(): string;
    public setTiming(timing:string): void;
    public getDuration(): number;
    public setDuration(duration:number): void;
    public getAutoPlaySpeed(): number;
    public setAutoPlaySpeed(speed:number): void;
    private setAutoPlayInterval(duration?:boolean): void;

    public emit<R>(method:string, args?:any[]): R;
    public get<R>(property:string): R;
    public set<T>(property:string, value:T): void;
}

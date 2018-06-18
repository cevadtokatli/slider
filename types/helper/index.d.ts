export interface Emitter {
    emit: <R>(method:string, args?:any[]) => R;
    get: <R>(property:string) => R;
    set: <T>(property:string, value:T) => void;
}

export declare class Util {
    public static requestAnimationFrame:Function;
    public static isMobile:boolean;
    public static animationEndEvents:string[];

    public static getElement(el:string|HTMLElement): HTMLElement;
    public static addMultiEventListener(el:HTMLElement, events:string[], callback:EventListener): void;
    public static removeMultiEventListener(el:HTMLElement, events:string[], callback:EventListener): void;
    public static addMultiEventListenerOnce(el:HTMLElement, events:string[], callback:(e:Event) => void): void;
    public static createEvent(name:string): Event;
    public static setCSSPrefix(css:string): string;
}
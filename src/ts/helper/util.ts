interface Events {
    mousedown: string;
    mouseup: string;
}

export default class Util {
    public static requestAnimationFrame:Function = typeof window !== 'undefined' 
                                                    ?
                                                        (<any>window).webkitRequestAnimationFrame ||
                                                        (<any>window).mozRequestAnimationFrame ||
                                                        (<any>window).oRequestAnimationFrame ||
                                                        (<any>window).msRequestAnimationFrame ||
                                                        window.requestAnimationFrame ||
                                                        ((callback:Function) => { window.setTimeout(callback, 1000 / 60)})
                                                    :
                                                        () => {};
    public static isMobile:boolean = typeof navigator !== 'undefined'
                                     ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                                     : false;
    public static events:Events = {
        mousedown: Util.isMobile ? 'touchstart' : 'mousedown',
        mouseup: Util.isMobile ? 'touchend' : 'mouseup'
    };
    public static animationEndEvents:string[] = ['webkitAnimationEnd', 'mozAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd', 'animationend'];

    /**
     * Returns the given element.
     */
    public static getElement(el:string|HTMLElement): HTMLElement {
        if(typeof el == 'string') {
            return <HTMLElement> document.querySelector(el);
        }

        return el;
    }

    /**
     * Attaches the events to the element.
     */
    public static addMultiEventListener(el:HTMLElement, events:string[], callback:EventListener): void {
        for(let i:number=0; i<events.length; i++) {
            el.addEventListener(events[i], callback, true);
        }
    }

    /**
     * Removes the events from the element.
     */
    public static removeMultiEventListener(el:HTMLElement, events:string[], callback:EventListener): void {
        for(let i:number=0; i<events.length; i++) {
            el.removeEventListener(events[i], callback, true);
        }
    }

    /**
     * Attaches the events to the element for once.
     */
    public static addMultiEventListenerOnce(el:HTMLElement, events:string[], callback:(e:Event) => void): void {
        let cb:EventListener = (e:Event) => {
            this.removeMultiEventListener(el, events, cb);
            callback(e);
        };

        this.addMultiEventListener(el, events, cb);
    }

    /**
     * Creates a new event and initalizes it.
     */
    public static createEvent(name:string): Event {
        let event:Event;
        if(typeof document !== 'undefined') {
            event = document.createEvent('HTMLEvents') || document.createEvent('event');
            event.initEvent(name, false, true);
        }
        return event;
    }

    public static setCSSPrefix(css:string): string {
        return `-webkit-${css}; -ms-${css}; ${css};`;
    }
}
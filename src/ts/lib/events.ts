import Util from "../helper/util";

export interface Events {
    change: Event;
    touchStart: Event;
    touchEnd: Event;
    play: Event;
    stop: Event;
    destroy: Event;
}

export const events:Events = {
    change: Util.createEvent('change'),
    touchStart: Util.createEvent('touchStart'),
    touchEnd: Util.createEvent('touchEnd'),
    play: Util.createEvent('play'),
    stop: Util.createEvent('stop'),
    destroy: Util.createEvent('destroy')
};
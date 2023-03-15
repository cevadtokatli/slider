import { EventAddOptions, EventCallback, EventElement, EventRemoveOptions } from './types'

export const isServer = typeof window === 'undefined'

const isMobile = !isServer && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator?.userAgent)

export const events = {
  mousedown: isMobile ? 'touchstart' : 'mousedown',
  mouseup: isMobile ? 'touchend' : 'mouseup',
}

export const animationEndEvents = ['webkitAnimationEnd', 'mozAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd', 'animationend']

export const requestAnimationFrame: ((callback:(() => void)) => void) = !isServer
  ? (window as any).mozRequestAnimationFrame
  || window.requestAnimationFrame
  || (window as any).webkitRequestAnimationFrame
  || (window as any).oRequestAnimationFrame
  || (window as any).msRequestAnimationFrame
  || ((callback: Function) => { window.setTimeout(callback, 1000 / 60) })
  : () => {}

/**
 * Attaches events to the given element.
 */
export const addEventListener = (el: EventElement, events: string[], callback: EventCallback, options: EventAddOptions = true) => {
  for (const i in events) {
    el.addEventListener(events[i], callback, options)
  }
}

/**
 * Attaches events to the given element for once.
 */
export const addEventListenerOnce = (el: EventElement, events: string[], callback: EventCallback, addOptions: EventAddOptions = true, removeOptions: EventRemoveOptions = true) => {
  const cb: EventListener = (e: Event) => {
    removeEventListener(el, events, cb, removeOptions)
    callback(e)
  }

  addEventListener(el, events, cb, addOptions)
}

/**
 * Creates a new event and initalizes it.
 */
export const createEvent = (name: string): Event => {
  let event: Event

  if (!isServer) {
    event = document.createEvent('HTMLEvents') ?? document.createEvent('event')
    event.initEvent(name, false, true)
  }
   
  return event
}

/**
 * If el is HTMLElement, returns it as is.
 * If el is string, find the element by searching the string in the query selector.
 */
export const getElement = (el: string | HTMLElement): HTMLElement => {
  if(typeof el === 'string') {
    return <HTMLElement> document.querySelector(el)
  }

  return el
}

/**
 * Removes events from the given element.
 */
export const removeEventListener = (el: EventElement, events: string[], callback: EventCallback, options: EventRemoveOptions = true) => {
  for (const i in events) {
    el.removeEventListener(events[i], callback, options)
  }
}

/**
 * Adds webkit and ms prefixes to the given css.
 */
export const setCSSPrefix = (css: string): string => {
  return `-webkit-${css}; -ms-${css}; ${css};`
}

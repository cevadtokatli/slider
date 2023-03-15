import { ArrowElements, Emitter } from './types'
import { events } from './util'

export default class Arrows {
  private _asArrows: ArrowElements = {}
  private _emitter: Emitter

  constructor(emitter: Emitter, arrows: boolean, asArrows: ArrowElements) {
    this._emitter = emitter

    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    
    if(arrows) {
      const mainEl = this._emitter.get<HTMLElement>('_el')

      const prevArrow  = document.createElement('div')
      prevArrow.className = 'ct-s-arrow ct-s-prev-arrow'
      prevArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792"><path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"/></svg>'
      mainEl.appendChild(prevArrow)
      prevArrow.addEventListener(events.mousedown, this.prev, true)

      let nextArrow:HTMLDivElement = document.createElement('div')
      nextArrow.className = 'ct-s-arrow ct-s-next-arrow'
      nextArrow.innerHTML = '<svg width="50" height="50" viewBox="0 0 1792 1792"><path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"/></svg>'
      mainEl.appendChild(nextArrow)
      nextArrow.addEventListener(events.mousedown, this.next, true)
    }

    if(asArrows.prevArrow) {
      asArrows.prevArrow.addEventListener(events.mousedown, this.prev, true)
      this._asArrows.prevArrow = asArrows.prevArrow
    }

    if(asArrows.nextArrow) {
      asArrows.nextArrow.addEventListener(events.mousedown, this.next, true)
      this._asArrows.nextArrow = asArrows.nextArrow
    }
  }

  /**
   * Triggers the next image.
   */
  private next() {
    this._emitter.emit('next')
  }

  /**
   * Triggers the previous image.
   */
  private prev() {
    this._emitter.emit('prev')
  }

  /**
   * Removes the event listeners.
   */
  public destroy() {
    this._asArrows.prevArrow?.removeEventListener(events.mousedown, this.prev, true)
    this._asArrows.nextArrow?.removeEventListener(events.mousedown, this.next, true)
  }
}

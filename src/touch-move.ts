import { events as sliderEvents } from './constants'
import { Emitter } from './types'
import { events } from './util'

export default class TouchMove {
  private _el: HTMLElement
  private _containerEl: HTMLDivElement
  private _startX: number
  private _time: number
  private _emitter: Emitter

  constructor(emitter: Emitter) {
    this._emitter = emitter
    this._el = this._emitter.get<HTMLElement>('_el')
    this._containerEl = this._emitter.get<HTMLDivElement>('_containerEl')

    this.start = this.start.bind(this)
    this.end = this.end.bind(this)

    this._containerEl.addEventListener(events.mousedown, this.start, true)
  }

  /**
   * Removes the event listener.
   */
  public destroy(): void {
    window.removeEventListener(events.mouseup, this.end, true)
  }

  /**
   * Called when mouseend or touchend fired.
   */
  private end(e:Event): void {
    this.destroy()
    this._el.dispatchEvent(sliderEvents.touchEnd)

    const endX = <number> (<any>e).clientX || (<any>e).pageX
    const x = endX - this._startX
    const t = new Date().getTime() - this._time
  
    if(Math.abs(x) >= 25 && t <= 250) {
      if(x <= 0) {
        this._emitter.emit('nextIndex', [true])
      } else {
        this._emitter.emit('prevIndex', [true])
      }
    } else {
      this._emitter.set<boolean>('_isProcessing', false)
    }

    e.preventDefault()
  }

  /**
   * Called when mousedown or touchstart fired.
   */
  private start(e: Event) {
    const processing:boolean = this._emitter.get<boolean>('_isProcessing')
        
    if(!processing) {
      this._emitter.set<boolean>('_isProcessing', true)
      this._el.dispatchEvent(sliderEvents.touchStart)
      this._startX = <number> (<any>e).clientX || (<any>e).pageX
      this._time = new Date().getTime()
    
      window.addEventListener(events.mouseup, this.end, true)
    }

    e.preventDefault()
  }
}

import Arrows from './arrows'
import { events as sliderEvents, defaultOptions, SliderType } from './constants'
import List from './list'
import * as SliderTypeMethods from './slider-type'
import TouchMove from './touch-move'
import { AfterCallback, BeforeCallback, Callbacks, Options, SliderElement } from './types'
import { events, getElement, isServer } from './util'

export default class Slider {
  private _el: HTMLElement
  private _containerEl: HTMLDivElement
  private _duration: number
  private _timing: string
  private _sliderType: SliderType
  private _init: boolean
  private _o: Options
  private _elements: SliderElement[] = []
  private _callbacks: Callbacks = {}
  private _index: number = 0
  private _total: number
  private _isProcessing: boolean = false
  private _list: List
  private _arrows: Arrows
  private _touchMove: TouchMove
  private _autoPlay: boolean
  private _autoPlaySpeed: number
  private _autoPlayStatus: boolean = true
  private _autoPlayContainer: HTMLDivElement
  private _autoPlayInterval: number

  private _emitter = {
    emit: this.emit.bind(this),
    get: this.get.bind(this),
    set: this.set.bind(this),
  }

  constructor (o: Options) {
    if (isServer) {
      return
    }

    if (!(this._el = getElement(o.el))) {
      throw new Error('Element could not be found')
    }

    this.extractOptions(o)

    if (this._init) {
      this.initDOM()
    }
  }

  /**
   * Extracts the options to the class properties.
   */
  private extractOptions(o: Options) {
    this._o = { ...o }

    for (let i in defaultOptions) {
      if (typeof this._o[i] === 'undefined') {
        this._o[i] = defaultOptions[i]
      }
    }

    const props = ['duration', 'init', 'sliderType', 'timing', 'autoPlay', 'autoPlaySpeed']

    for (let i in props) {
      this[`_${props[i]}`] = this._o[props[i]]
    }
  }

  // init and destroy

  /**
   * Inits the slider without creating the core DOM elements.
   */
  public init() {
    this._containerEl = this._el.querySelector('.ct-s-slider-element-container')
    this.initCore()
  }

  /**
   * Inits the core class props and settings.
   */
  private initCore() {
    // init class props
    this._elements[this._index].wrapperEl.classList.add('ct-s-active')
    this._total = this._elements.length
 
    // touchMove
    if(this._o.touchMove) {
      this._touchMove = new TouchMove(this._emitter)
    }

    // list & asList
    const asList = <HTMLUListElement | HTMLOListElement> getElement(this._o.asList)
    if (this._o.list || asList) {
      this._list = new List(this._emitter, this._o.list, asList)
    }

    // arrows & prevArrow & nextArrow
    if(this._o.arrows || this._o.asPrevArrow || this._o.asNextArrow) {
      this._arrows = new Arrows(this._emitter, this._o.arrows, { prevArrow: getElement(this._o.asPrevArrow), nextArrow: getElement(this._o.asNextArrow) })
    }

    // auto play
    if(this._autoPlay) {
      this._autoPlayContainer = document.createElement('div')
      this._autoPlayContainer.className = 'ct-s-autoplay-container ct-s-active'
      this._autoPlayContainer.innerHTML = [
        '<svg class="ct-s-play" viewBox="0 0 48 48"> \t\t\t\t\t\t<path d="M16 10v28l22-14z"></path> \t\t\t\t\t</svg>',
        '<svg class="ct-s-stop" viewBox="0 0 512 512"> \t\t\t\t\t\t<rect height="320" width="60" x="153" y="96"></rect><rect height="320" width="60" x="299" y="96"></rect> \t\t\t\t\t</svg>',
      ].join('')
      this._autoPlayContainer.addEventListener(events.mousedown, this.toggle.bind(this))
      this.setAutoPlayInterval(false)
      this._el.appendChild(this._autoPlayContainer)
    } 
  }

  /**
   * Inits the slider creating DOM elements.
   */
  private initDOM() {
    this._el.classList.add('ct-s')

    // elements & slider
    const sliderMainEl: HTMLDivElement = document.createElement('div')
    sliderMainEl.classList.add('ct-s-slider')
    sliderMainEl.innerHTML = '<div class="ct-s-slider-element-container"></div>'

    const firstChildNode = this._el.childNodes[0]

    if (firstChildNode) {
      this._el.insertBefore(sliderMainEl, firstChildNode)
    } else {
      this._el.appendChild(sliderMainEl)
    }

    this._containerEl = sliderMainEl.querySelector('div')

    const imageSettingsObj: { [key: string]: SliderElement } = {}

    this._o.imageSettings.forEach(i => {
      imageSettingsObj[i.id] = i
    })

    const sliderHTMLEls = this._el.querySelectorAll('.ct-s-slider-element')
    for (let i = 0; i < sliderHTMLEls.length; i++) {
      const sliderHTMLEl = <HTMLElement> sliderHTMLEls[i]
      const id = sliderHTMLEls[i].getAttribute('ct-s-id')
      let wrapperEl: HTMLDivElement
      let sliderEl: Partial<SliderElement>

      if (this._init) {
        wrapperEl = document.createElement('div')
        wrapperEl.classList.add('ct-s-slider-element-wrapper')
        wrapperEl.appendChild(sliderHTMLEl)
      } else {
        wrapperEl = <HTMLDivElement> sliderHTMLEl.parentNode
      }

      sliderEl = imageSettingsObj[id] ?? {}

      sliderEl.el = sliderHTMLEl
      sliderEl.wrapperEl = wrapperEl
      sliderEl.sliderType ??= this._sliderType

      this._elements.push(<SliderElement> sliderEl)
      this._containerEl.appendChild(wrapperEl)
      SliderTypeMethods[sliderEl.sliderType].init(<SliderElement> sliderEl)
    }

    this.initCore()
  }

  /**
   * Destroys the slider.
   * Removes all internal elements.
   * Removes all events from the external DOM elements.
   */
  public destroy() {
    this._touchMove?.destroy()
    this._list?.destroy()
    this._arrows?.destroy()

    if(this._autoPlay && this._autoPlayStatus) {
       clearInterval(this._autoPlayInterval)
    }

    this._el.innerHTML = ''
    this._el.classList.remove('ct')
    this._el.dispatchEvent(sliderEvents.destroy)
  }

  // add and remove
     
  /**
   * Adds a new element to the slider.
   */
  public add(el:string|HTMLElement, index:number, options: Partial<SliderElement> = {}) {
    if ((el = getElement(el)) && index > -1 && index <= this._total) {
      if (this._init) {
        const wrapperEl = document.createElement('div')
        wrapperEl.classList.add('ct-s-slider-element-wrapper')
        el.classList.add('ct-s-slider-element')
        wrapperEl.appendChild(el)
  
        if (index < this._total) {
          this._containerEl.insertBefore(wrapperEl, this._containerEl.childNodes[index])
        } else {
            this._containerEl.appendChild(wrapperEl)
        }
  
        options.wrapperEl = wrapperEl
        options.el = el
        if (!options.sliderType) {
          options.sliderType = this._sliderType
        }
      }

      Slider[options.sliderType].init(options)
      this._elements.splice(index, 0, <SliderElement> options)

      this._total += 1
      if(this._index >= index) {
        this._index += 1
      }

      if(this._list) {
        this._list.add()
        this._list.index = this._index
      }
    }
  }

  /**
   * Adds a new element to the head of the slider.
   */
  public addFirst(el:string|HTMLElement, options?: Partial<SliderElement>) {
    this.add(el, 0, options)
  }

  /**
   * Adds a new element to the end of the slider.
   */
  public addLast(el:string|HTMLElement, options: Partial<SliderElement>) {
    this.add(el, this._total, options)
  }

  /**
   * Removes the element at the specified index from the slider.
   */
  public remove(index:number): void {
    if(index > -1 && index < this._total && this._total > 2) {
      if(this._init) {
        this._containerEl.removeChild(this._containerEl.childNodes[index])
      }
    
      this._elements.splice(index, 1)

      this._total -= 1
      if(this._index >= index) {
        this._index -= 1
      }

      this._elements[this._index]?.wrapperEl.classList.add('ct-s-active')

      if(this._list) {
        this._list.remove()
        this._list.index = this._index
      }
    }
  }

  /**
   * Removes the first element from the slider.
   */
  public removeFirst() {
      this.remove(0)
  }

  /**
   * Removes the last element from the slider.
   */
  public removeLast() {
      this.remove(this._total - 1)
  }

  // logic

  /**
   * @param index new index value
   * @param status if the new index is greater than the current index, it becomes true, and class the next method, vice-versa it becomes false and call the prev method.
   */
  private setSliderAnimation(prevEl: SliderElement, nextEl: SliderElement, index: number, status: boolean, auto: boolean = false): Promise<void> {
    return new Promise(async resolve => {
      this._isProcessing = true

      await this._callbacks.before?.(prevEl, nextEl)
      await prevEl.before?.(prevEl, false)
      await nextEl.before?.(nextEl, true)

      this._index = index
      if (this._list) {
        this._list.index = index
      }

      await SliderTypeMethods[nextEl.sliderType].animate(nextEl, prevEl, status, this._emitter)

      await this._callbacks.after?.(nextEl, prevEl)
      await prevEl.after?.(prevEl, false)
      await nextEl.after?.(nextEl, true)

      if(this._autoPlay && this._autoPlayStatus && !auto) {
        clearInterval(this._autoPlayInterval)
        this.setAutoPlayInterval(false)
      }

      this._isProcessing = false
      this._el.dispatchEvent(sliderEvents.change)

      resolve()
    })
  }

  // next and prev

  /**
   * Triggers the next element.
   * Returns false if the slider is in progress.
   */
  public next(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if(!this._isProcessing) {
        this.nextIndex()
        .then(resp => resolve(resp))
      } else {
        resolve(false)
      }
    })
  }

  private nextIndex(touchMove:boolean=false, auto: boolean = false): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (!this._isProcessing || touchMove) {
        const nIndex = (this._index + 1 < this._total) ? this._index + 1 : 0
        const prevEl = this._elements[this._index]
        const nextEl = this._elements[nIndex]

        this.setSliderAnimation(prevEl, nextEl, nIndex, true, auto).then(() => resolve(true))
      } else {
          resolve(false)
      }
    })
  }

  /**
   * Triggers the previous element.
   * Resolves false if the slider animation is in progress.
   */
  public prev(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if(!this._isProcessing) {
        this.prevIndex().then(resp => resolve(resp))
      } else {
        resolve(false)
      }
    })
  }

  private prevIndex(touchMove: boolean = false): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if(!this._isProcessing || touchMove) {
        const nIndex = (this._index - 1 >= 0) ? this._index - 1 : this._total - 1
        const prevEl = this._elements[this._index]
        const nextEl = this._elements[nIndex]

        this.setSliderAnimation(prevEl, nextEl, nIndex, false)
        .then(() => resolve(true))
      } else {
        resolve(false)
      }
    })
  }

  // autoplay

  /**
   * Starts autoplay.
   */
  public play() {
    if(!this._autoPlayStatus) {
      this._autoPlayStatus = true
      this._autoPlayContainer.classList.add('ct-s-active')
      this.setAutoPlayInterval()
      this._el.dispatchEvent(sliderEvents.play)
    }
  }

  /**
   * Stops autoplay.
   */
  public stop() {
    if(this._autoPlayStatus) {
      this._autoPlayStatus = false
      this._autoPlayContainer.classList.remove('ct-s-active')
      clearInterval(this._autoPlayInterval)
      this._el.dispatchEvent(sliderEvents.stop)
    }
  }

  /**
   * Toggles autoplay.
   */
  public toggle() {
    if(this._autoPlayStatus) {
      this.stop()
    } else {
      this.play()
    }
  }

  // es6 getter & setter
  set afterCallback(afterCallback: AfterCallback) {
    this._callbacks.after = afterCallback
  }

  set beforeCallback(beforeCallback: BeforeCallback) {
    this._callbacks.before = beforeCallback
  }

  get el(): HTMLElement {
    return this._el
  }

  // getter & setter
  public getAutoPlaySpeed(): number {
    return this._autoPlaySpeed
  }

  public setAutoPlaySpeed(autoPlaySpeed: number) {
    this._autoPlaySpeed = autoPlaySpeed

    if(this._autoPlay && this._autoPlayStatus) {
      clearInterval(this._autoPlayInterval)
      this.setAutoPlayInterval()
    }
  }

  private setAutoPlayInterval(duration:boolean=true): void {
    const speed = !duration ? this._autoPlaySpeed : (this._autoPlaySpeed + this._duration)
    this._autoPlayInterval = setInterval(() => { this.nextIndex(false,true) }, speed)
  }

  public getCurrent(): SliderElement {
    return this._elements[this._index]
  }

  public getDuration(): number {
    return this._duration
  }

  public setDuration(duration: number) {
    this._duration = duration
  }

  public getElements(): SliderElement[] {
    return this._elements
  }

  public setElements(elements: SliderElement[]) {
    this._elements = elements
  }

  public getIndex(): number {
    return this._index
  }

  public setIndex(index: number): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (!this._isProcessing) {
        if (index > -1 && index < this._total && index !== this._index) {
          const prevEl = this._elements[this._index]
          const nextEl = this._elements[index]
          const status = index > this._index
          this.setSliderAnimation(prevEl, nextEl, index, status)
          .then(() => resolve(true))
        }
      } else {
        resolve(false)
      }
    })
  }

  public getTiming(): string {
    return this._timing
  }

  public setTiming(timing: string) {
    this._timing = timing
  }

  public getTotal(): number {
    return this._total
  }

  // emitter methods
  public emit<R>(method: string, args?: any[]): R {
    return this[method].apply(this, args)
  }

  public get<R>(property: string): R {
    return this[property]
  }

  public set<T>(property: string, value: T) {
    this[property] = value
  }
}

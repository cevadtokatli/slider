import { SliderType } from './constants'

export type AfterCallback = (current: SliderElement, prev: SliderElement) => Promise<void>

export interface ArrowElements {
  nextArrow?: HTMLElement
  prevArrow?: HTMLElement
}

export type BeforeCallback = (current: SliderElement, next: SliderElement) => Promise<void>

export interface Callbacks {
  after?: AfterCallback
  before?: BeforeCallback
}

export interface Emitter {
  emit: <R> (method: string, args?: any[]) => R
  get: <R> (property: string) => R
  set: <T> (property: string, value: T) => void
}

export interface Events {
  change: Event
  destroy: Event
  play: Event
  stop: Event
  touchEnd: Event
  touchStart: Event
}

export type EventAddOptions = boolean | AddEventListenerOptions

export type EventCallback = (e: Event) => void

export type EventElement = HTMLElement | Document | Window

export type EventRemoveOptions = boolean | EventListenerOptions

export interface Options {
  arrows?: boolean
  asList?: string | HTMLUListElement | HTMLOListElement
  asNextArrow?: string | HTMLElement
  asPrevArrow?: string | HTMLElement
  autoPlay?: boolean
  autoPlaySpeed?: number
  duration?: number
  el: string | HTMLElement
  imageSettings?: SliderElement[]
  init?: boolean
  list?: boolean
  sliderType?: SliderType
  timing?: string
  touchMove?: boolean
}

export interface SliderElement {
  after: (el: SliderElement, status: boolean) => void
  before: (el: SliderElement, status: boolean) => void
  el?: HTMLElement
  id: string
  sliderType: SliderType
  wrapperEl?: HTMLDivElement
}

export interface SliderTypeItem {
  animate(nextEl: SliderElement, prevEl: SliderElement, status: boolean, emitter: Emitter): Promise<void>
  init(sliderEl: SliderElement): void
}

import { Events, Options } from './types'
import { createEvent } from './util'

export enum SliderType {
  Carousel = 'Carousel',
  Flow = 'Flow',
  Fade = 'Fade',
}

export const events: Events = {
  change: createEvent('change'),
  destroy: createEvent('destroy'),
  play: createEvent('play'),
  stop: createEvent('stop'),
  touchEnd: createEvent('touchEnd'),
  touchStart: createEvent('touchStart'),
}

export const defaultOptions: Partial<Options> = {
  arrows: true,
  autoPlay: false,
  autoPlaySpeed: 5000,
  duration: 800,
  imageSettings: [],
  init: true,
  list: true,
  sliderType: SliderType.Carousel,
  timing: 'ease',
  touchMove: true,
}

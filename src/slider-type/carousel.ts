import { SliderTypeItem } from '../types'
import { addEventListenerOnce, animationEndEvents, requestAnimationFrame, setCSSPrefix } from '../util'

export const Carousel: SliderTypeItem = {
  animate(nextEl, prevEl, status, emitter) {
    return new Promise<void>(resolve => {
      const containerEl = emitter.get<HTMLDivElement>('_containerEl')
      const timing = emitter.get<string>('_timing')
      const duration = emitter.get<number>('_duration')

      containerEl.setAttribute('style', `
        ${setCSSPrefix(`animation-duration: ${duration}ms`)}
        ${setCSSPrefix(`animation-timing-function: ${timing}`)}
      `)
      containerEl.classList.add('ct-s-carousel')

      if (!status) {
        containerEl.classList.add('ct-s-carousel-reverse')
      }

      nextEl.wrapperEl.classList.add('ct-s-carousel-next')
      nextEl.wrapperEl.classList.add('ct-s-active')

      requestAnimationFrame(() => {
        containerEl.classList.add('ct-s-carousel-animation')

        addEventListenerOnce(containerEl, animationEndEvents, () => {
          containerEl.removeAttribute('style')
          containerEl.classList.remove('ct-s-carousel')
          if (!status) {
            containerEl.classList.remove('ct-s-carousel-reverse')
          }
          containerEl.classList.remove('ct-s-carousel-animation')

          prevEl.wrapperEl.classList.remove('ct-s-active')
          nextEl.wrapperEl.classList.remove('ct-s-carousel-next')

          resolve()
        })
      })
    })
  },

  init(sliderEl) {},
}

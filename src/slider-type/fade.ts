import { SliderTypeItem } from '../types'
import { addEventListenerOnce, animationEndEvents, requestAnimationFrame, setCSSPrefix } from '../util'

export const Fade: SliderTypeItem = {
  animate(nextEl, prevEl, status, emitter) {
    return new Promise<void>(resolve => {
      const containerEl = emitter.get<HTMLDivElement>('_containerEl')
      const timing = emitter.get<string>('_timing')
      const duration = emitter.get<number>('_duration')

      containerEl.classList.add('ct-s-fade')
      prevEl.wrapperEl.classList.add('ct-s-fade-prev')
      nextEl.wrapperEl.setAttribute('style', `
        ${setCSSPrefix(`animation-duration: ${duration}ms`)}
        ${setCSSPrefix(`animation-timing-function: ${timing}`)}
      `)
      nextEl.wrapperEl.classList.add('ct-s-fade-next')
      nextEl.wrapperEl.classList.add('ct-s-active')

      requestAnimationFrame(() => {
        nextEl.wrapperEl.classList.add('ct-s-fade-animation')

        addEventListenerOnce(containerEl, animationEndEvents, () => {
          containerEl.classList.remove('ct-s-fade')
          prevEl.wrapperEl.classList.remove('ct-s-active')
          prevEl.wrapperEl.classList.remove('ct-s-fade-prev')
          nextEl.wrapperEl.removeAttribute('style')
          nextEl.wrapperEl.classList.remove('ct-s-fade-next')
          nextEl.wrapperEl.classList.remove('ct-s-fade-animation')
          resolve()
        })
      })
    })
  },

  init(sliderEl) {},

}

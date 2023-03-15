import { SliderTypeItem } from '../types'
import { addEventListenerOnce, animationEndEvents, requestAnimationFrame, setCSSPrefix } from '../util'

export const Flow: SliderTypeItem = {
  animate(nextEl, prevEl, status, emitter) {
    return new Promise<void>(resolve => {
      const containerEl = emitter.get<HTMLDivElement>('_containerEl')
      const timing = emitter.get<string>('_timing')
      const duration = emitter.get<number>('_duration')

      containerEl.classList.add('ct-s-flow')
      if (!status) {
        containerEl.classList.add('ct-s-flow-reverse')
      }

      prevEl.wrapperEl.classList.add('ct-s-flow-prev')
      nextEl.wrapperEl.setAttribute('style',`
        ${setCSSPrefix(`animation-duration: ${duration}ms`)}
        ${setCSSPrefix(`animation-timing-function: ${timing}`)}
      `)
      nextEl.wrapperEl.classList.add('ct-s-active')
      nextEl.wrapperEl.classList.add('ct-s-flow-next')

      requestAnimationFrame(() => {
        nextEl.wrapperEl.classList.add('ct-s-flow-animation')

        addEventListenerOnce(nextEl.wrapperEl, animationEndEvents, () => {
          containerEl.classList.remove('ct-s-flow')
          if(!status) {
            containerEl.classList.remove('ct-s-flow-reverse')
          }

          prevEl.wrapperEl.classList.remove('ct-s-active')
          prevEl.wrapperEl.classList.remove('ct-s-flow-prev')
          nextEl.wrapperEl.classList.remove('ct-s-flow-next')
          nextEl.wrapperEl.classList.remove('ct-s-flow-animation')
          nextEl.wrapperEl.removeAttribute('style')
          resolve()
        })
      })
    })
  },

  init(sliderEl) {},

}

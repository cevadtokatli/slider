import { Emitter } from './types'
import { events } from './util'

export default class List {
  private _listEl: HTMLUListElement
  private _asList: HTMLUListElement | HTMLOListElement
  private _index: number
  private _emitter: Emitter

  constructor(emitter: Emitter, list: boolean, asList: HTMLUListElement | HTMLOListElement) {
    this._emitter = emitter

    this.setIndex = this.setIndex.bind(this)

    if (list) {
      this._listEl = document.createElement('ul')

      const mainEl = this._emitter.get<HTMLElement>('_el')
      mainEl.appendChild(this._listEl)
      this._listEl.addEventListener(events.mousedown, this.setIndex, true)

      const total = this._emitter.get<number>('_total')
      for (let i = 0; i < total; i++) {
        this.add()
      }
    }

    if (asList) {
      asList.addEventListener(events.mousedown, this.setIndex, true)
      this._asList = asList
    }

    this.index = this._emitter.get('_index')
  }

  get index(): number {
    return this._index
  }

  set index(index: number) {
    this._index = index
    this.setActive()
  }

  /**
   * Adds a new element to the list.	
   */
  public add() {
    this._listEl?.appendChild(document.createElement('li'))
  }

  /**
   * Removes the event listeners.
   */
  public destroy() {
    this._asList?.removeEventListener(events.mousedown, this.setIndex, true)
  }

  /**
   * Removes an element from the list.
   * Since the list works based on index, always removes the last element.
   */
  public remove() {
    this._listEl?.removeChild(this._listEl?.lastChild)
  }

  /**
   * Sets active class by index.
   */
  private setActive() {
    if (this._listEl) {
      const activeEl = <HTMLLIElement> this._listEl.querySelector('.ct-s-active')
      activeEl?.classList.remove('ct-s-active')

      const el = <HTMLLIElement> this._listEl.querySelectorAll('li')[this.index]
      el?.classList.add('ct-s-active')
    }

    if (this._asList) {
      const activeEl = <HTMLLIElement> this._asList.querySelector('.ct-s-active')
      activeEl?.classList.remove('ct-s-active')

      const el = <HTMLLIElement> this._asList.querySelectorAll('li')[this.index]
      el?.classList.add('ct-s-active')
    }
  }

  /**
   * Sets the new index by the element clicked on the list.
   */
  private setIndex(e: Event) {
    let target = <HTMLElement> e.target

    while (
      target !== this._listEl
      && target !== this._asList
      && target.parentNode !== this._listEl
      && target.parentNode !== this._asList
    ) {
      target = <HTMLElement> target.parentNode
    }

    if (
      target.parentNode === this._listEl
      || target.parentNode === this._asList
    ) {
      const index = Array.prototype.slice.call((<HTMLElement> target.parentNode).children).indexOf(target)
      this._emitter.emit('setIndex', [index])
    }
  }
}

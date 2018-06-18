import Emitter from "../helper/emitter";
import Util from "../helper/util";

export class List {
    private _listEl: HTMLUListElement;
    private _asList: HTMLUListElement|HTMLOListElement;
    private _index: number;
    private _emitter: Emitter;

    constructor(emitter:Emitter, list:boolean, asList:HTMLUListElement|HTMLOListElement) {
        this._emitter = emitter;

        this.setIndex = this.setIndex.bind(this);

        if(list) {
            this._listEl = document.createElement('ul');
            let mainEl:HTMLElement = this._emitter.get('_el');
            mainEl.appendChild(this._listEl);
            this._listEl.addEventListener(Util.events.mousedown, this.setIndex, true);

            let total:number = this._emitter.get('_total');
            for(let i:number=0; i<total; i++) {
                this.add();
            }
        }

        if(asList) {
            asList.addEventListener(Util.events.mousedown, this.setIndex, true);
            this._asList = asList;
        }

        this.index = this._emitter.get('_index');
    }

    get index():number {
        return this._index;
    }

    set index(value:number) {
        this._index = value;
        this.setActive();
    }

    /**
     * Sets the new index by checking elements clicked on the list.
     */
    private setIndex(e:Event): void {
        let target:HTMLElement = <HTMLElement> e.target;

        while(target != this._listEl && target != this._asList && target.parentNode != this._listEl && target.parentNode != this._asList) {
            target = <HTMLElement> target.parentNode;
        }

        if(target.parentNode == this._listEl || target.parentNode == this._asList) {
            let index:number = Array.prototype.slice.call((<HTMLElement> target.parentNode).children).indexOf(target);
            this._emitter.emit('setIndex', [index]);
        }
    }

    /**
     * Sets active class by index.
     */
    private setActive(): void {
        if(this._listEl) {
            let activeEl:HTMLLIElement = <HTMLLIElement> this._listEl.querySelector('.ms-active');
            if(activeEl) {
                activeEl.classList.remove('ms-active');
            }

            let el:HTMLLIElement = <HTMLLIElement> this._listEl.querySelectorAll('li')[this.index];
            if(el) {
                el.classList.add('ms-active');
            }
        }

        if(this._asList) {
            let activeEl:HTMLLIElement = <HTMLLIElement> this._asList.querySelector('.ms-active');
            if(activeEl) {
                activeEl.classList.remove('ms-active');
            }

            let el:HTMLLIElement = <HTMLLIElement> Array.prototype.slice.call(this._asList.children)[this.index];
            if(el) {
                el.classList.add('ms-active');
            }
        }
    }

    /**
     * Adds a new element to the list.	
     */
    public add(): void {
        if(this._listEl) {
            var li:HTMLLIElement = document.createElement('li');
            this._listEl.appendChild(li);
        }
    }

    /**
     * Removes an element from the list.
     */
    public remove(): void {
        if(this._listEl) {
            this._listEl.removeChild(this._listEl.lastChild);
        }
    }

    /**
     * Removes the event listener.
     */
    public destroy(): void {
        if(this._asList) {
            this._asList.removeEventListener(Util.events.mousedown, this.setIndex, true);
        }
    }
}
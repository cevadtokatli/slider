# Slider

Image Slider library for web and mobile browsers.

## Intallation

It is available as a package on NPM for use with a module bundler.

```sh
# NPM
$ npm install --save @cevad-tokatli/slider

# Yarn
$ yarn add @cevad-tokatli/slider
```

## Usage
You can simply import the module and create a new object with the `Slider` class.

```ts
import Slider from '@cevad-tokatli/slider'
import '@cevad-tokatli/slider/style.css'

const slider = new Slider({
  el: '#slider',
})
```

## Configuration
### Id

You can customize each element by assinging an id.

```html
<div id="slider">
    <div class="ct-s-slider-element" ct-s-id="img1">Image-1</div>
    <div class="ct-s-slider-element" ct-s-id="img2">Image-2</div>
    <div class="ct-s-slider-element" ct-s-id="img3">Image-3</div>
</div>
```

```ts
import Slider, { SliderType } from '@cevad-tokatli/slider'

const slider = new Slider({
  el: '#slider',
  imagesSettings: [
    { id:'img1', sliderType: SliderType.Carousel },
    { id:'img2', sliderType: SliderType.Flow },
    { id:'img3', sliderType: SliderType.Fade },
  ]
})
```

### Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
el | string \| HTMLElement* | null | Container element.
timing | string | "ease" | Specifies the speed curve of an animation. Takes all the values CSS3 can take. *(like ease, linear, cubic-bezier, step)*
duration | number | 800 | Defines how long an animation should take to complete one cycle. *(as milliseconds)*
sliderType | [SliderType](#slider-type) | Carousel | Specifies the animation type. It can be customized for each image element with the `imagesSettings` property.
touchMove | boolean | true | Enables slide transitive with touch.
list | boolean | true | Displays a list at the bottom of the slider.
[asList](#as-list) | string \| HTMLUListElement \| HTMLOListElement* | null | Declares the given list as the slider list.
arrows | boolean | true | Displays right and left arrows to change the index.
asPrevArrow | string \| HTMLElement* | null | Declares the given element as the prev arrow.
asNextArrow | string \| HTMLElement* | null | Declares the given element as the next arrow.
autoPlay | boolean | false | Enables auto play of slides.
autoPlaySpeed | number | 5000 | Sets auto play interval. *(as milliseconds)*
imagesSettings | [SliderElement[]](#slider-element) | [] | Customizes each element.

<span style="font-size:.9rem;">*: You can give an HTML element or a CSS selector (like `#carousel`, `.container > div:first-child`)</span>

#### Slider Type
Specifies the slider animation type.

```ts
import Slider, { SliderType } from '@cevad-tokatli/slider'
```

#### As List
You can convert an HTML list element to a slider list that shows the current index and works as a pager.
* It can be a `ul` or `ol` element.
* It can be placed anywhere in the `body`.
* List is updated when the index is changed.
* Assigns `ct-s-active` class to list element that holds the current index.

```html
<div id="slider">
    <div class="ct-s-slider-element" ct-s-id="img1">Image-1</div>
    <div class="ct-s-slider-element" ct-s-id="img2">Image-2</div>
    <div class="ct-s-slider-element" ct-s-id="img3">Image-3</div>
</div>
<ul id="list">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

```ts
const slider = new Slider({
  el: '#slider',
  list: false,
  asList: '#list',
})
```

### Callbacks
#### Before
**before(current: SliderElement, next: SliderElement): Promise\<boolean>** \
It is invoked before animation runs. It returns a promise so that animation waits for this mehtod to complete.  

**after(current: SliderElement, prev: SliderElement): Promise\<boolean>** \
It is invoked after animation runs. It returns a promise so before the method completes running, another animation cannot run.

[Each slider element also has an before and after method for themselves.](#slider-element)

### Events
Event | Description
----- | -----------
touchStart | Fires when touching starts.
touchEnd | Fires when touching ends.
change | Fires when index changes.
play | Fires when autoplay starts.
stop | Fires when autoplay stops.
destroy | Fires when the slider is destroyed.

```ts
import Slider from '@cevat-tokatli/slider'

const slider = new Slider({
  el: '#slider',
})

slider.el.addEventListener('touchStart', () => {
  console.log('touching starts')
})

slider.el.addEventListener('touchEnd', () => {
  console.log('touching ends')
})
```

### Methods
Method | Params | Return | Description
------ | ------ | ------ | -----------
add | el: string \| HTMLElement* <br /> index: number <br /> options: [SliderElement](#slider-element) | void | Adds a new element to the slider.
addFirst | el: string \| HTMLElement* <br /> options: [SliderElement](#slider-element) | void | Adds a new element to the head of the slider.
addLast | el: string \| HTMLElement* <br />  options: [SliderElement](#slider-element) | void | Adds a new element to the end of the slider.
remove | index: number | void | Removes the element at the specified index from the slider.
removeFirst | | void | Removes the first element from the slider.
removeLast | | void | Removes the last element from the slider.
prev | | Promise\<boolean> | Triggers the previous image. Returns `false` if the slider is in animation.
next | | Promise\<boolean> | Triggers the next image. Returns `false` if the slider is in animation.
play | | void | Starts autoplay.
stop | | void | Stops autoplay.
toggle | | void | Toggles autoplay.
destroy | | void | Destroys the slider.
getIndex | | number | Returns index.
setIndex | index: number | Promise\<boolean> | Sets index and animates the slider. Returns `false` if the slider is in animation.
getTotal | | number | Returns total number of images.
getCurrent | | [SliderElement](#slider-element) | Returns the current element.
getTiming | | string | Returns timing value.
setTiming | timing: string | void | Sets timing value.
getDuration | | number | Returns duration.
setDuration | duration: number | void | Sets duration.
getAutoPlaySpeed | | number | Returns auto play speed.
setAutoPlaySpeed | speed: number | void | Sets auto play speed.

<span style="font-size:.9rem;">*: You can give an HTML element or a CSS selector (like `#carousel`, `.container > div:first-child`)</span>

### Slider Element
It is an object that holds one slider element.

#### Options
**id {String}** \
Specifies the id of an image.

**sliderType {SliderType}** \
Specifies the slider type of an image.

**before(el: SliderElement, active:boolean): Promise\<void>** \
It is invoked before animation runs. It returns a promise so animation waits for this method to complete. It is only invoked when it is the current or the next element. If it is the next element, active is true.

**after(el: SliderElement, active:boolean): Promise\<void>** \
It is invoked after animation runs. It returns a promise so before the method completes, another animation cannot run.  It is only invoked when it is the current or the previous element. If it is the current element, active is true.

## License
Slider is provided under the [MIT License](https://opensource.org/licenses/MIT).

## Related Projects
* [Slider React](https://github.com/cevadtokatli/slider-react)

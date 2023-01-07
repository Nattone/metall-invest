import Glide from '@glidejs/glide'

console.log('hello! js worsk fine!')

export const initGlide = (selector, options) => {
  document.querySelectorAll(selector)?.forEach((element) => {
    const glide = new Glide(element, {
      perView: element.dataset.count || 1,
      type: 'carousel',
      ...options,
    })
    glide?.mount()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initGlide('.primary__slider', {
    autoplay: 5000,
  })
})

document.addEventListener('DOMContentLoaded', () => {
  initGlide('.partners__carousel', {
    perView: 4,
    startAt: 1,
    gap: 0,
    // focusAt: 4 // ?
    // peek: {
    //     before: 0,
    //     after: 0
    // }
  })
})

import Glide from '@glidejs/glide'

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

  initGlide('.similar__carousel', {
    perView: 4,
    startAt: 1,
    gap: 0,
    // focusAt: 4 // ?
    // peek: {
    //     before: 0,
    //     after: 0
    // }
  })

  // initScrollbar('[data-simplebar]')
})

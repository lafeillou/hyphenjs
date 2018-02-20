import codeMap from './char-code'
import Observer from './observer'
import { attr, style, extend, warn } from './utils'

// prepare all text data
const initState = h => {
  const options = h.options
  const dom = document.querySelectorAll(options.el)
  console.log(dom)
}

function initMixin(Hyphen) {
  Hyphen.prototype._init = function (options) {
    const h = this
    this.options = extend({
      name: 'hyphen',
      codeMap
    }, options)

    initState(h)
  }
}

function methodMixin(Hyphen) {
  // set a wisper to deliver message
  Hyphen.prototype.wisper = new Observer()
}


function renderMixin(Hyphen) {

}

export {
  initMixin,
  methodMixin,
  renderMixin
}

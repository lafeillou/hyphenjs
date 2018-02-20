/**
 * hyphen.js
 * develop by 1kg
 * use it to make the text align neatly.
 */
import { initMixin, methodMixin, renderMixin } from './mixin'
import { warn } from './utils'

function Hyphen(options = {}) {
  if (!(this instanceof Hyphen)) {
    warn('Hyphen is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Hyphen)
methodMixin(Hyphen)
renderMixin(Hyphen)

Hyphen.version = '__VERSION__'

exports = module.exports = Hyphen

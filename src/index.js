/**
 * hyphen.js
 * develop by 1kg
 * use it to make the text align neatly.
 */
import initMixin from './mixin'
import { warn } from './utils'

function Hyphen(options = {}) {
  if (!(this instanceof Hyphen)) {
    warn('Hyphen is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Hyphen)

exports = module.exports = Hyphen

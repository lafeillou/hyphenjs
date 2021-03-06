/**
 * Event emitter
 */

function Observer() {
  this._listeners = {}
}

Observer.prototype = {
  constructor: Observer,
  subscribe(name, fn) {
    let listeners = this._listeners
    let handlers = listeners[name] || (listeners[name] = [])
    handlers.push(fn)
  },
  unsubscribe(name, fn) {
    let listeners = this._listeners[name]
    if (listeners) listeners.splice(listeners.indexOf(fn), 1)
  },
  next(name, ...args) {
    let listeners = this._listeners[name]
    if (listeners) {
      listeners.forEach(h => h.apply(this, args))
    }
  }
}

export default Observer

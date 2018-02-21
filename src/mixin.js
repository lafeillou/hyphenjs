import Observer from './observer'
import { callBeforeRender, callInRender, callAfterRender } from './render'
import { attr, style, extend, makePureArray, warn } from './utils'

const LIFE_CYCLE = [
  'beforeRender', 
  'render', 
  'afterRender'
]

const noop = function() {}

// prepare all text data
const initNodeData = h => {
  const options = h.options
  const nodeList = document.querySelectorAll(options.el)
  const nodes = Array.from(nodeList)
  // store each node data
  const hNodes = []

  nodes.forEach(parseNode)
  h.nodes = hNodes
  // parse single node to get box's width, font-size
  // and each char's width
  function parseNode(node) {
    const text = node.innerText
    const nodeWidth = parseFloat(style(node, 'width')).toFixed(options.fixed)
    const nodeFontSize = style(node, 'font-size')
    const nodeFontFamily = style(node, 'font-family')
    const nodeFontWeight = style(node, 'font-weight')
    const chars = makePureArray(text.split(''))
    
    // insert a span which has a char to body
    // and get char's real render's width
    const spans = Object.create(null)
    const div = document.createElement('div')
    style(div, 'font-size', nodeFontSize)
    style(div, 'font-family', nodeFontFamily)
    style(div, 'font-weight', nodeFontWeight)
    // style(div, 'transform', 'scale(0)')
    chars.forEach(char => {
      const span = document.createElement('span')
      const code = char.charCodeAt()
      span.innerText = char
      spans[code] = { span, char, code }
      // auto inherit parent node's font-size and font-family
      div.appendChild(span)
    })
    document.body.appendChild(div)
    for(const k in spans) {
      const v = spans[k]
      v.width = (v.span.getBoundingClientRect()['width']).toFixed(options.fixed)
    }
    document.body.removeChild(div)

    hNodes.push({
      node,
      nodeWidth,
      spans
    })
  }
}

function initLifecycle(h) {
  LIFE_CYCLE.forEach(name => {
    const hook = h.options[name] || noop
    h.wisper.subscribe(name, hook)
  })
}

function initRenderEvent(h) {  
  callBeforeRender(h)
  // call hook: beforeRender
  h.wisper.next.call(h, 'beforeRender')
  // main render function
  callInRender(h)
  // when render function done
  callAfterRender(h)
  // call hook: afterRender
  h.wisper.next.call(h, 'afterRender')
}

function initWisper(h) {
  // set a wisper to deliver message
  const wisper = new Observer()
  h.wisper = wisper
  // set _listeners reference to Hyphen instance
  h = extend(h, h.wisper)
}

function initMixin(Hyphen) {
  Hyphen.prototype._init = function (options) {
    const h = this
    // expose real self
    h._self = this
    this.options = extend({
      name: 'hyphen',
      el: 'p',
      neat: false,
      fixed: 3
    }, options)
    
    initWisper(h)
    initLifecycle(h)
    initNodeData(h)
    initRenderEvent(h)
  }
}

export default initMixin

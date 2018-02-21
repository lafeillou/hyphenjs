import { style, attr, warn } from './utils'

const excludeHyphenChar = '`1234567890-=[]\;\',./~!@#$%^&*()_+{}|:"<>?'

// make text single line to break manually
export function callBeforeRender(h) {
  const hNodes = h.nodes
  hNodes.forEach(node => {
    style(node.node, 'white-space', 'nowrap')
  })
}

export function callInRender(h) {
  const hNodes = h.nodes

  hNodes.forEach(node => {
    const rendered = attr(node.node, `data-${h.options.name}`)
    // prevent repeatly render
    if(typeof rendered === 'string' && rendered === 'rendered') {
      warn(`This node ${node.node.nodeName} has rendered by Hyphen`)
    } else {
      const lines = breakTextToLines(node)
      const spaces = calcLetterSpacing(node, lines)
      // render each line to a block div
      renderLines(node, lines, spaces)
      // render a node
      h.wisper.next.call(h, 'render')
    }
  })

  // According to the width of the box's width, break text to lines 
  function breakTextToLines(node) {
    const chars = node.node.innerText.split('')
    const nodeWidth = parseFloat(node.nodeWidth)
    const spans = node.spans
    const lines = [[]]
    for (let i = 0, num = 0, move = 0, accWidth = 0, len = chars.length; i < len; i++) {
      const code = chars[i].charCodeAt()
      const charWidth = parseFloat(spans[code].width)
      const hasNextChar = !!chars[i + 1]
      const nextCharWidth = hasNextChar ? parseFloat(spans[chars[i + 1].charCodeAt()].width) : 0

      lines[num].push(chars[i])

      if (accWidth < nodeWidth) {
        accWidth += charWidth
      } else {
        if(move <= h.options.move && moveNextChar(node, i)) {
          move++
          continue
        } else {
          move = 0
        }
        const dash = hypher(node, i)
        if(dash.length > 0) {
          lines[num].push(dash)
        }
        accWidth = 0
        lines[++num] = []
      }
    }
    return lines
  }

  // calculate letter-spacing
  function calcLetterSpacing(node, lines) {
    const nodeWidth = node.nodeWidth
    const spans = node.spans
    const spaces = []
    lines.forEach(line => {
      const lineSize = line.length
      const charWidthArray = line.map(char => parseFloat(spans[char.charCodeAt()].width))
      const lineWidth = charWidthArray.length > 0 ? charWidthArray.reduce((a, c) => a + c) : 0
      spaces.push(
        (nodeWidth - lineWidth) / lineSize
      )
    })
    return spaces;
  }

  // render each line to a div
  function renderLines(node, lines, spaces) {
    const lineNodes = []
    const parent = node.node
    parent.innerHTML = ''

    lines.forEach((line, index) => {
      const isLastLine = index === lines.length - 1
      lineNodes.push(createDiv(line.join(''), spaces[index], isLastLine))
    })

    lineNodes.forEach(node => {
      parent.appendChild(node)
    })

    function createDiv(text, space, isLastLine) {
      const div = document.createElement('div')
      // make sure each div to display block
      style(div, 'display', 'block')
     
      if(isLastLine === false) {
        style(div, 'letter-spacing', `${space}px`)
      }
      
      div.innerText = text
      return div
    }
  }

  // auto hyphenation, this is a complicate part
  // I will make it simple
  function hypher(node, bIndex) {
    const text = node.node.innerText
    const boarderChar = text[bIndex]
    const boarderNextChar = text[bIndex + 1] ? text[bIndex + 1] : ''
    if(
      excludeHyphenChar.indexOf(boarderChar) > -1
      || excludeHyphenChar.indexOf(boarderNextChar) > -1
      || boarderChar.charCodeAt() === 32
      || boarderNextChar.charCodeAt() === 32
    ) {
      return ''
    } else {
      return '-'
    }
  }

  // decide whether should move to next char or not
  function moveNextChar(node, bIndex) {
    const wordRe = /[a-zA-Z]/
    const text = node.node.innerText
    const leftMin = h.options.leftMin
    const rightMin = h.options.rightMin
    let move = false

    function walkLeft(index) {
      if(!wordRe.test(text[index])) {
        move = true
      }
    }

    function walkRight(index) {
      if(!wordRe.test(text[index])) {
        move = true
      }
    }

    let l = 0, r = 0
    while(l++ <= leftMin) {
      walkLeft(bIndex - l)
    }

    while(r++ <= rightMin) {
      walkRight(bIndex + r)
    }

    return move
  }
}

export function callAfterRender(h) {
  const hNodes = h.nodes
  // mark hyphenate
  hNodes.forEach(node => {
    attr(node.node, `data-${h.options.name}`, 'rendered')
  })
}

import { style } from './utils'

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
    const lines = breakTextToLines(node)
    const spaces = calcLetterSpacing(node, lines)
    renderLines(node, lines, spaces)
    // render a node
    h.wisper.next.call(h, 'render')
  })

  // According to the width of the box's width, break text to lines 
  function breakTextToLines(node) {
    const chars = node.node.innerText.split('')
    const nodeWidth = parseFloat(node.nodeWidth)
    const spans = node.spans
    const lines = [[]]
    for (let i = 0, num = 0, accWidth = 0, len = chars.length; i < len; i++) {
      const code = chars[i].charCodeAt()
      const charWidth = parseFloat(spans[code].width)
      const nextCharWidth = chars[i + 1] ?
        parseFloat(spans[chars[i + 1].charCodeAt()].width) : 0

      lines[num].push(chars[i])
      if (accWidth + nextCharWidth < nodeWidth) {
        accWidth += charWidth
      } else {
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
      const lineWidth = charWidthArray.reduce((a, c) => a + c)
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
}

export function callAfterRender(h) {

}

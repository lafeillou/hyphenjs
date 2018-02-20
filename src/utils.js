/**
 * Common utils
 */

export function extend(from, to) {
  for (let prop in to) from[prop] = to[prop]
  return from
}

export function attr(node, name, value) {
  if (value === undefined) {
    return node.getAttribute(name)
  } else {
    return node.setAttribute(name, value)
  }
}

export function style(node, name, value) {
  if (value === undefined) {
    return node.style[name] || window.getComputedStyle(node)[name]
  } else {
    return node.style[name] = value
  }
}

// remove duplicate primitive value in array
export function makePureArray(arr) {
  const newArr = []
  const len = arr.length
  let i = 0
  while(i < len) {
    const v = arr[i++]
    if(newArr.indexOf(v) < 0) {
      newArr.push(v)
    }
  }
  return newArr
}

export function warn(...args) {
  console.warn(`[Hyphen warn:] ${args}`)
}

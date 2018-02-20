/**
 * A common utils
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
    return node.style[name]
  } else {
    return node.style[name] = value
  }
}

export function warn(...args) {
  console.warn(`[Hyphen warn:] ${args}`)
}

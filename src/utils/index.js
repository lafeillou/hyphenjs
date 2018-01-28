import parser from './parser'

function extend(from, to) {
    for (let prop in to) from[prop] = to[prop]
    return from
}

function attr(node, name, value) {
    if (value === undefined) {
        return node.getAttribute(name)
    } else {
        return node.setAttribute(name, value)
    }
}

function style(node, name, value) {
    if(value === undefined) {
        return node.style[name]
    } else {
        return node.style[name] = value
    }
}

export {
    extend,
    attr,
    style,
    parser
}

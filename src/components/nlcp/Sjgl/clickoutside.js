let nodes = []
let num = 0
let ctx = Symbol('ctx')
let startEl
const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()
on(document, 'mousedown', e => {
  startEl = e
})
on(document, 'mouseup', e => {
  nodes.forEach(el => {
    el[ctx].documentHandle(startEl, e)
  })
})

function cerateDocumentHandle(el, binding, vnode) {
  return function(mousedown = {}, mouseup = {}) {
    if (
      el.contains(mousedown.target) ||
      el.contains(mouseup.target) ||
      el === mouseup.target
    ) {
      return false
    }

    if (binding.expression && vnode.context[binding.expression]) {
      vnode.context[binding.expression]()
    } else {
      el[ctx].fn()
    }
  }
}
export default {
  bind(el, binding, vnode) {
    el[ctx] = {
      id: num++,
      documentHandle: cerateDocumentHandle(el, binding, vnode),
      fn: binding.value
    }
    nodes.push(el)
  },
  update(el, binding, vnode) {
    el[ctx].documentHandle = cerateDocumentHandle(el, binding, vnode)
    el[ctx].fn = binding.value
  },
  unbind(el) {
    let len = nodes.length

    for (let i = 0; i < len; i++) {
      if (nodes[i][ctx].id === el[ctx].id) {
        nodes.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}

import { isObject, isUndef, isDef, isPrimitive } from "./utils"
import modules from "./modules"

class VNode {
  constructor(tag, data, children, text, elm, context, componentOptions) {
    this.tag = tag
    this.data = data || {}
    this.elm = elm
    this.text = text
    this.children = children
    this.context = context
    this.componentOptions = componentOptions
  }
}


function createComponentInstanceForVnode (
  vnode,
  parent,
) {
  const options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  }
  return new vnode.componentOptions.Ctor(options)
}

const componentVNodeHooks = {
  init(vnode) {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance,
    )
    child.$mount()
  }
}
const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks(data = {}) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const toMerge = componentVNodeHooks[key]
    hooks[key] = toMerge
  }
}
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}
export function createComponentVNode(
  Ctor,
  data,
  context,
  children,
) {
  const baseCtor = context.$options._base
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
  const name = Ctor.options.name
  data = data || {}
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }
  installComponentHooks(data)
  const listeners = data.on
  const propsData = Object.assign({}, data.attrs, data.props)
  const vnode = new VNode(
    `vue-component-${name}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, context, listeners, children },
  )
  return vnode
}
function createComponent(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
) {
  const i = vnode.data
  if (i && i.hook && i.hook.init) {
    i.hook.init(vnode)
  }

  if (isDef(vnode.componentInstance)) {
    vnode.elm = vnode.componentInstance.$el
    insert(parentElm, vnode.elm, refElm)
    return true
  }
}
function emptyNodeAt (elm) {
  return new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm)
}
function createChildren(vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i=0;i<children.length;i++) {
      createElm(children[i], insertedVnodeQueue, vnode.elm, null)
    }
  } else if (isPrimitive(vnode.text)) {
    const textNode = document.createTextNode(vnode.text)
    vnode.elm.appendChild(textNode)
  }
}
function insert(parent, elm, refElm) {
  if (isDef(parent)) {
    if (isDef(refElm)) {
      if (refElm.parentNode === parent) {
        parent.insertBefore(elm, refElm)
      }
    } else {
      parent.appendChild(elm)
    }
  }
}

const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
let cbs = [];
(function initPatch() {
for (let i = 0; i < hooks.length; ++i) {
  cbs[hooks[i]] = []
  for (let j = 0; j < modules.length; ++j) {
    if (isDef(modules[j][hooks[i]])) {
      cbs[hooks[i]].push(modules[j][hooks[i]])
    }
  }
}
})()
export const emptyNode = new VNode('', {}, [])
function invokeCreateHooks(vnode) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
}

function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
) {
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  const { children, tag } = vnode
  if (isDef(tag)) {
    vnode.elm = document.createElement(tag)
    createChildren(vnode, children, insertedVnodeQueue)
    invokeCreateHooks(vnode, insertedVnodeQueue)
    insert(parentElm, vnode.elm, refElm)
  } else if (vnode.isComment) {
    vnode.elm = document.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = document.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data)
      )
    )
  )
}

export function patch (oldVnode, vnode) {
  if (isUndef(vnode)) {
    return
  }
  let insertedVnodeQueue = [];
  if (isUndef(oldVnode)) {
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch vnode
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
      }
      const oldElm = oldVnode.elm
      const parentElm = oldElm.parentNode
      // create new node
      createElm(vnode, [], parentElm, oldElm.nextSibling)
    }
  }
  return vnode.elm
}
export default VNode

export let activeInstance;
export function setActiveInstance(vm) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}
export function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}
export function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)
export function renderList (val, render) {
  let ret, i, l, keys, key
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length)
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i)
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = []
      const iterator = val[Symbol.iterator]()
      let result = iterator.next()
      while (!result.done) {
        ret.push(render(result.value, ret.length))
        result = iterator.next()
      }
    } else {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
    }
  }
  if (!isDef(ret)) {
    ret = []
  }
  ret._isVList = true
  return ret
}

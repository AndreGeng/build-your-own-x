import { isObject, isUndef, isDef, isPrimitive } from "./utils"
import modules from "./modules"

let emptyObject = Object.freeze({})

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

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    // update props
  if (propsData && vm.$options.props) {
    var props = vm._props;
    var propKeys = Object.keys(props)
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = propsData[key];
    }
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
}

const componentVNodeHooks = {
  init(vnode) {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance,
    )
    child.$mount()
  },
  prepatch(oldVnode, vnode) {
    let options = vnode.componentOptions;
    let child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },
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
function createChildren(vnode, children) {
  if (Array.isArray(children)) {
    for (let i=0;i<children.length;i++) {
      createElm(children[i], vnode.elm, null)
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
  parentElm,
  refElm,
) {
  if (createComponent(vnode, parentElm, refElm)) {
    return
  }
  const { children, tag } = vnode
  if (isDef(tag)) {
    vnode.elm = document.createElement(tag)
    createChildren(vnode, children)
    invokeCreateHooks(vnode)
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

function isPatchable (vnode) {
  while (vnode.componentInstance) {
    vnode = vnode.componentInstance._vnode
  }
  return isDef(vnode.tag)
}
function patchVnode(oldVnode, vnode) {
  if (oldVnode === vnode) {
    return
  }
  const elm = vnode.elm = oldVnode.elm
  const oldCh = oldVnode.children
  const ch = vnode.children
  const data = vnode.data
  let i
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode);
  }
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      // updatechildren
      updateChildren(elm, oldCh, ch)
    } else if (isDef(ch)) {
      // addvnodes
      console.log("addnode needed")
    } else if (isDef(oldCh)) {
      // removevnodes
      console.log("removenode needed")
    } else if(isDef(oldVnode.text)) {
      elm.textContent = ""
    }
  } else if (oldVnode.text !== vnode.text) {
    elm.textContent = vnode.text
  }
}

function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[oldStartIdx]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[newStartIdx]
  let newEndVnode = newCh[newEndVnode]
  let idxInOld
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if(sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } 
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartVnode]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartVnode]
    } else {
      idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) {
        // new node
        createElm(newStartVnode, parentElm, oldStartVnode.elm)
      } else {
        const vnodeToMove = oldCh[idxInOld]
        patchVnode(vnodeToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    for (;newStartIdx <= newEndIdx; newStartIdx++) {
      createElm(newCh[newStartIdx], parentElm, isUndef(newCh[newStartIdx + 1]) ? null: newCh[newStartIdx + 1].elm)
    }
  } else if (newStartIdx > newEndIdx) {
    for (;oldStartIdx <= oldEndIdx; oldStartIdx++) {
      const oldVnode = oldCh[oldStartIdx]
      if (oldVnode && oldVnode.elm) {
        parentElm.removeChild(oldVnode.elm)
      }
    }
  }
}
function findIdxInOld (node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}

export function patch (oldVnode, vnode) {
  if (isUndef(vnode)) {
    return
  }
  if (isUndef(oldVnode)) {
    createElm(vnode)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch vnode
      patchVnode(oldVnode, vnode)
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode)
      }
      const oldElm = oldVnode.elm
      const parentElm = oldElm.parentNode
      // create new node
      createElm(vnode, parentElm, oldElm.nextSibling)
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

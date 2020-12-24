import { activeInstance, updateChildComponent } from "../lifecycle"
import { isObject, isDef, } from "../utils"
import VNode from "./vnode"

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
    );
  },
}
const hooksToMerge = Object.keys(componentVNodeHooks)

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
  data.attrs = {}
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

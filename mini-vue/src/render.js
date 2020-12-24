import { isPrimitive, toString } from "./utils"
import VNode, { createTextVNode } from "./vdom/vnode"
import { patch } from "./vdom/patch"
import { createComponentVNode, } from "./vdom/create-component"
import { renderList } from "./render-helpers/render-list"

export function initRender(vm) {
  const $createElement = function (context, tag, data, children) {
    if (Array.isArray(data) || isPrimitive(data)) {
      children = data
      data = undefined
    }
    let vnode
    if (context.$options.components && context.$options.components[tag]) {
      tag = context.$options.components[tag];
    }
    if (typeof tag === "string") {
      vnode = new VNode(tag, data, children, undefined, undefined, vm.$options._base)
    } else {
      vnode = createComponentVNode(tag, data, context, children)
    }
    return vnode
  }
  vm.__patch__ = patch
  vm.$createElement = (...args) => $createElement(vm, ...args)
}
function installRenderHelpers(Vue) {
  const target = Vue.prototype
  target._s = toString
  target._v = createTextVNode
  target._l = renderList
}
export function renderMixin(Vue) {
  installRenderHelpers(Vue)
  Vue.prototype._render = function _render() {
    const vm = this
    const { render } = this.$options
    let vnode
    try {
      vnode = render.call(vm, vm.$createElement)
    } catch(e) {
      console.log("_render Error:", e)
    }
    return vnode
  }
}

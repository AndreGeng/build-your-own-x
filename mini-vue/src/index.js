import observe from "./observer"
import Watcher from "./watcher"
import VNode, { createComponentVNode, patch, setActiveInstance, createTextVNode, renderList } from "./vnode"
import { toString, isPrimitive, } from "./utils"
import Dep from "./dep"
import { eventsMixin, initEvent } from "./events"
import { defineReactive } from "./observer"

class Vue {
  constructor(options) {
    this.$options = Object.assign({}, this.constructor.options, options)
    this._init()
  }
  _render() {
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
  _update(vnode) {
    const vm = this
    const restoreActiveInstance = setActiveInstance(vm)
    const prevVnode = vm._vnode
    vm._vnode = vnode
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
  }
  $mount(el) {
    const vm = this
    vm.$el = el && document.querySelector(el)
    const updateComponent = () => {
      vm._update(vm._render())
    }
    new Watcher(vm, updateComponent)
    return vm
  }
}

function initMixin(Vue) {
  Vue.prototype._init = function() {
    const vm = this
    vm._self = vm
    if (vm.$options._isComponent) {
      if (vm.$options.props) {
        vm.$options.props.propsData = vm.$options._parentVnode.componentOptions.propsData
      }
      vm.$options._parentListeners = vm.$options._parentVnode.componentOptions.listeners
    }
    initEvent(vm)
    if (vm.$options.props) {
      initProps(vm, vm.$options.props)
    }
    initMethods(vm, vm.$options.methods)
    if (vm.$options.data) {
      initData(vm)
    }
    if (vm.$options.computed) initComputed(vm, vm.$options.computed)
    initRender(vm)
  }

  function initData(vm) {
    vm._data = typeof vm.$options.data === "function" ? vm.$options.data() : vm.$options.data
    const keys = Object.keys(vm._data)
    keys.forEach((key) => {
      proxy(vm, '_data', key)
    })
    observe(vm._data, true)
  }
  function initProps(vm, props) {
    vm._props = props.propsData || {}
    const keys = Object.keys(vm._props)
    keys.forEach((key) => {
      defineReactive(vm._props, key, props.propsData[key])
      proxy(vm, '_props', key)
    })
  }
  function initComputed(vm, computed) {
    const noop = () => {}
    const watchers = vm._computedWatchers = Object.create(null)
    for (const key in computed) {
      watchers[key] = new Watcher(
        vm,
        computed[key] || noop,
        { lazy: true },
      )
      Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          const watcher = this._computedWatchers && this._computedWatchers[key]
          if (watcher) {
            if (watcher.dirty) {
              watcher.evaluate()
            }
            if (Dep.target) {
              watcher.depend()
            }
            return watcher.value
          }
          return undefined;
        },
        set: noop
      })
    }
  }
  function initRender(vm) {
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
        vnode = new VNode(tag, data, children, undefined, undefined, Vue)
      } else {
        vnode = createComponentVNode(tag, data, context, children)
      }
      return vnode
    }
    vm.__patch__ = patch
    vm.$createElement = (...args) => $createElement(vm, ...args)
    const options = vm.$options;
    const parentVnode = vm.$vnode = options._parentVnode;
    const parentData = parentVnode && parentVnode.data;
  }
  function initMethods(vm, methods) {
    const noop = () => {}
    for (const key in methods) {
      vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm)
    }
  }
  // 把this.key的访问代理到this._data.key
  function proxy(vm, sourceKey, key) {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        return vm[sourceKey][key]
      },
      set: (val) => {
        vm[sourceKey][key] = val
      }
    })
  }
}
function initExtend(Vue) {
  Vue.extend = function(extendOptions) {
    const Super = this
    class Sub extends Vue {}
    Sub.options = Object.assign({}, Super.options, extendOptions)
    return Sub
  }
}
function renderMixin(Vue) {
  const target = Vue.prototype
  target._s = toString
  target._v = createTextVNode
  target._l = renderList
}


function initGlobalAPI(Vue) {
  Vue.options = Object.create(null)
  Vue.options._base = Vue
}

initMixin(Vue)
initExtend(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)
eventsMixin(Vue)

export default Vue


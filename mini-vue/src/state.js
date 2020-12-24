import observe from "./observer"
import { defineReactive } from "./observer"
import Watcher from "./observer/watcher"
import Dep from "./observer/dep"

// 把this.key的访问代理到this[sourceKey].key
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
export function initData(vm) {
  vm._data = typeof vm.$options.data === "function" ? vm.$options.data() : vm.$options.data
  const keys = Object.keys(vm._data)
  keys.forEach((key) => {
    proxy(vm, '_data', key)
  })
  observe(vm._data, true)
}
export function initProps(vm, props) {
  vm._props = props.propsData || {}
  const keys = Object.keys(vm._props)
  keys.forEach((key) => {
    defineReactive(vm._props, key, props.propsData[key])
    proxy(vm, '_props', key)
  })
}
export function initComputed(vm, computed) {
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
export function initMethods(vm, methods) {
  const noop = () => {}
  for (const key in methods) {
    vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm)
  }
}

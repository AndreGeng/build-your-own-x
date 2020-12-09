import { toArray } from "./utils"
import { updateListeners, } from "./modules/events"

export function eventsMixin(Vue) {
  Vue.prototype.$on = function (event, fn) {
    const vm = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
    }
    return vm
  }
  Vue.prototype.$emit = function (event) {
    const vm = this
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {
        args ? cbs[i].apply(vm, args) : cbs[i].call(vm)
      }
    }
    return vm
  }
}
let target;

function add (event, fn) {
  target.$on(event, fn)
}

function remove (event, fn) {
  target.$off(event, fn)
}
export function updateComponentListeners (
  vm,
  listeners,
  oldListeners,
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}

export function initEvent(vm) {
  vm._events = Object.create(null)
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}
function createOnceHandler (event, fn) {
  const _target = target
  return function onceHandler () {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}

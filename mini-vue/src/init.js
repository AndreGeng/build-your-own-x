import { initEvent } from "./events"
import { initRender } from "./render"
import { initProps, initMethods, initData, initComputed } from "./state"

function initInternalComponent (vm) {
  if (vm.$options._isComponent) {
    if (vm.$options.props) {
      vm.$options.props.propsData = vm.$options._parentVnode.componentOptions.propsData
    }
    vm.$options._parentListeners = vm.$options._parentVnode.componentOptions.listeners
  }
}
export function initMixin(Vue) {
  Vue.prototype._init = function() {
    const vm = this
    vm._self = vm
    initInternalComponent(vm)
    initEvent(vm)
    initRender(vm)
    if (vm.$options.props) {
      initProps(vm, vm.$options.props)
    }
    initMethods(vm, vm.$options.methods)
    if (vm.$options.data) {
      initData(vm)
    }
    if (vm.$options.computed) initComputed(vm, vm.$options.computed)
  }
}

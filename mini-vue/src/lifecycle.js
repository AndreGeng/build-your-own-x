export function lifecycleMixin(Vue) {
  Vue.prototype._update = function _update(vnode) {
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
}

export function updateChildComponent(vm, propsData) {
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

export let activeInstance;
export function setActiveInstance(vm) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}

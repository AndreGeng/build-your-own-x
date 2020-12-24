function initExtend(Vue) {
  Vue.extend = function(extendOptions) {
    const Super = this
    class Sub extends Vue {}
    Sub.options = Object.assign({}, Super.options, extendOptions)
    return Sub
  }
}
export function initGlobalAPI(Vue) {
  Vue.options = Object.create(null)
  Vue.options._base = Vue
  initExtend(Vue)
}

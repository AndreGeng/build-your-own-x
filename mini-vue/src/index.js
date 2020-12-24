import { eventsMixin, } from "./events"
import { initMixin } from "./init"
import Watcher from "./observer/watcher"
import { initGlobalAPI } from "./global-api"
import { renderMixin } from "./render"
import { lifecycleMixin } from "./lifecycle"

class Vue {
  constructor(options) {
    this.$options = Object.assign({}, this.constructor.options, options)
    this._init()
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

initMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)

export default Vue


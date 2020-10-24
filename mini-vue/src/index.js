import observe from "./observer"

class Vue {
  constructor(options) {
    this.$options = options
    this._init()
  }
  _init() {
    if (this.$options.data) {
      this._initData()
    }
  }
  // 把this.key的访问代理到this._data.key
  _proxy(vm, sourceKey, key) {
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
  _initData() {
    const keys = Object.keys(this.$options.data)
    keys.forEach((key) => {
      this._proxy(this, '_data', key)
    })
    observe(this.$options.data, true)
  }
  mount(el) {
    const vm = this
    const updateComponent = () => {
      vm._update(vm._render())
    }
    new Watcher()
  }
}



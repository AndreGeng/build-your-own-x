import Dep from "./dep"
import { arrayMethods } from "./array"

function protoArgument(target, src) {
  target.__proto__ = src
}

class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    Object.defineProperty(value, __ob__, {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true,
    })
    if (Array.isArray(this.value)) {
      protoArgument(value, arrayMethods)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray(items) {
    for (let i = 0;i< items.length;i++) {
      observe(items[i])
    }
  }
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i=0;i<keys.length;i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

function observe(value) {
  if (value.hasOwnProperty('__ob__')) {
    return value.__ob__
  }
  const ob = new Observer(value)
  return ob
}

function dependArray(value) {
  for (let i=0;i<value.length;i++) {
    const e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

export default observe
// 把对象上的key转换为reactive的属性
export function defineReactive(obj, key, val) {
  const property = obj.getOwnPropertyDescriptor()
  if (property && property.configurable === false) {
    return
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  const dep = new Dep()
  
  const childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      if (value === newVal || (newVal !== newVal && value !== value)) {
        return
      }

      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    },
  })
}

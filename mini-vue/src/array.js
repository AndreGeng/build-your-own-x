const arrayProto = Array.prototype
const methodsToPatch = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'sort',
  'reverse',
]

methodsToPatch.forEach((method) => {
  const original = arrayProto[method]
  Object.defineProperty(arrayProto, method, function(...args) {
    const result =  original.apply(arrayProto, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
    return result
  })
})


export const arrayMethods = Object.create(arrayProto)

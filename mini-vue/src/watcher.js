import { pushTarget, popTarget } from "./dep"

class Watcher {
  constructor(vm, updateCompnent, options) {
    this.vm = vm
    this.updateCompnent = updateCompnent
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.newDepIds = new Set()
    this.depIds = new Set()
    this.deps = []
    this.newDeps = []
    this.dirty = this.lazy // for lazy watchers
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    const vm = this.vm
    pushTarget(this)
    let value
    try {
      value = this.updateCompnent.call(vm)
    } catch(e) {
      console.log("watcher Error:", e)
    } finally {
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
  addDep (dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}

export default Watcher

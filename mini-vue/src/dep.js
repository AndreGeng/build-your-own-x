import { remove } from "./utils"

let uid = 0
class Dep {
  static target;
  constructor() {
    this.id = ++uid;
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  removeSub (sub) {
    remove(this.subs, sub)
  }
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
const targetStack = []
export function pushTarget(watcher) {
  targetStack.push(watcher)
  Dep.target = watcher
}
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

export default Dep

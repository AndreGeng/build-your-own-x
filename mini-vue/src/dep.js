class Dep {
  static target;
  constructor() {
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

export default Dep

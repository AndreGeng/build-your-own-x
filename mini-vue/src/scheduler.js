let waiting = false
let flushing = false
let has = {}
let index = 0
const queue = []

function nextTick(cb) {
  return Promise.resolve().then(cb)
}

function resetSchedulerState() {
  index = queue.length = 0
  has = {}
  waiting = flushing = false
}

function flushSchedulerQueue() {
  flushing = true
  queue.sort((a, b) => a.id - b.id)
  for (index =0;index < queue.length;index++) {
    const watcher = queue[index]
    const id = watcher.id
    has[id] = null
    watcher.run()
  }
  resetSchedulerState()
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}



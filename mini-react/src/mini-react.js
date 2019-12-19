import { TYPE, EFFECT_TAG } from "./constant";

let wipRoot = null;
let currentRoot = null;
let nextUnitWork = null;
let effectList = [];
let wipFiber = null;
let hooksIdx = 0;

const flattenArray = (arr) => {
  if (!arr && arr.length <= 0) {
    return [];
  }
  return arr.reduce((acc, item) => {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      acc = [...acc, ...flattenArray(item)];
    } else {
      acc.push(item);
    } 
    return acc;
  }, []);
}

const createElement = (type, config, ...children) => {
  const props = Object.assign({}, config, {
    children: flattenArray(children).map(child => {
      if (typeof child === "string" || typeof child === "number") {
        return {
          type: TYPE.TEXT_ELEMENT,
          props: {
            nodeValue: child,
            children: [],
          }
        }
      }
      return child;
    }),
  });
  return {
    type,
    props,
  }
}

const workLoop = (idleDeadline) => {
  while (nextUnitWork && (idleDeadline.timeRemaining() > 1 || idleDeadline.didTimeout)) {
    nextUnitWork = performUnitWork(nextUnitWork);
  }
  if (nextUnitWork) {
    window.requestIdleCallback(workLoop);
  } else if (wipRoot) {
    window.commitRoot && window.commitRoot(effectList);
    effectList = [];
  }
}

const getKeys = (obj) => {
  return Object.keys(obj).filter((key) => key !== "children");
}

const reconcileChildren = (wipFiber) => {
  const elements = wipFiber.props.children;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length || oldFiber) {
    if (index < elements.length) {
      const element = elements[index];
      const newFiber = {
        type: element.type,
        props: element.props || {},
        return: wipFiber,
        alternate: oldFiber,
        dom: null,
        hooks: [],
      };
      // 新增节点
      if (!oldFiber) {
        newFiber.effectTag = EFFECT_TAG.NEW;
        effectList.push(newFiber);
      }else if (oldFiber.type !== newFiber.type) {
        newFiber.alternate = null;
        oldFiber.effectTag = EFFECT_TAG.DELETE;
        effectList.push(oldFiber);
      } else if (oldFiber.type === newFiber.type) {
        newFiber.dom = oldFiber.dom;
        newFiber.publicInstance = oldFiber.publicInstance;
        const changeNeeded = Array.from(new Set([...getKeys(newFiber.props), ...getKeys(oldFiber.props)]))
          .some(key => newFiber.props[key] !== oldFiber.props[key])
        if (changeNeeded) {
          newFiber.effectTag = EFFECT_TAG.UPDATE;
          effectList.push(newFiber);
        }
      }
      if (!wipFiber.child) {
        wipFiber.child = newFiber;
      }
      if (prevSibling) {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
      index++;
    } else {
      // 需删除节点
      oldFiber.effectTag = EFFECT_TAG.DELETE;
      effectList.push(oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling || null;
    }
  }
}
/**
 * 1. 创建dom节点
 * 2. 返回nextUnitWork
 * @return {Fiber}
 */
const performUnitWork = (fiber) => {
  if (typeof fiber.type === "function") {
    if (typeof fiber.type.prototype.render === "function") {
      if (!fiber.alternate) {
        const publicInstance = new fiber.type(fiber.props);
        fiber.publicInstance = publicInstance;
        publicInstance.__internalFiber = fiber;
        fiber.props.children = [publicInstance.render()];
      } else {
        fiber.props.children = [fiber.alternate.publicInstance.render()];
      }
    } else {
      wipFiber = fiber;
      hooksIdx = 0;
      fiber.props.children = [fiber.type(fiber.props)]
    }
    reconcileChildren(fiber);
  } else {
    reconcileChildren(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  let parent = fiber.return;
  while (!parent.sibling && parent.return) {
    parent = parent.return;
  }
  if (parent.sibling) {
    return parent.sibling;
  }
  return null;
}

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }
  setState(v) {
    let partialState = v;
    if (typeof v === "function") {
      partialState = v(this.state);
    }
    this.state = Object.assign({}, this.state, partialState);
    wipRoot = {
      dom: currentRoot.dom,
      alternate: currentRoot,
      props: currentRoot.props,
    }
    nextUnitWork = wipRoot;
    window.requestIdleCallback(workLoop);
  }
  render() {
    return null;
  }
}

export const useState = (initV) => {
  const oldHook = wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hooksIdx];
  const hook = {
    state: oldHook ? oldHook.state : initV,
    queue: [],
  };
  wipFiber.hooks.push(hook);
  hooksIdx++;
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  });
  const setState = (newV) => {
    hook.queue.push(newV);
    wipRoot = {
      dom: currentRoot.dom,
      alternate: currentRoot,
      props: currentRoot.props,
    }
    nextUnitWork = wipRoot;
    window.requestIdleCallback(workLoop);
  }
  return [hook.state, setState];
}

export const useCallback = (cb, deps) => {
  const oldHook = wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hooksIdx];
  const depsNotChange = (oldDeps, newDeps) => {
    if (oldDeps.length !== newDeps.length) {
      return false;
    }
    let i = 0;
    while (i < newDeps.length) {
      if (newDeps[i] !== oldDeps[i]) {
        return false;
      }
      i++;
    }
    return true;
  }
  const hook = {
    state: oldHook && depsNotChange(oldHook.deps, deps) ? oldHook.state : cb,
    deps,
  };
  wipFiber.hooks.push(hook);
  hooksIdx++;
  return hook.state;
}

export default {
  createElement,
  Component,
  workLoop,
  get nextUnitWork() {
    return nextUnitWork;
  },
  set nextUnitWork(value) {
    nextUnitWork = value;
  },
  get currentRoot() {
    return currentRoot;
  },
  set currentRoot(value) {
    currentRoot = value;
  },
  get wipRoot() {
    return wipRoot;
  },
  set wipRoot(value) {
    wipRoot = value;
  },
}

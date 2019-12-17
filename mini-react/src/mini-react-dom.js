import MiniReact from "./mini-react";
import { TYPE, EFFECT_TAG } from "./constant";

const isListener = name => name.startsWith("on");
const isAttribute = name => !isListener(name) && name !== "children";

/**
* @param {MiniReactElement} element
* @param {HTMLElement} container 
*/
const render = (element, container) => {
  // hostroot
  MiniReact.wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: MiniReact.currentRoot,
  }
  window.requestIdleCallback(MiniReact.workLoop);
}
/**
 * 更新dom节点
 * @param {HTMLElement} dom
 * @param {object} preProps 旧的props
 * @param {object} props 新的props
 */
const updateDomProperties = (dom, preProps, props) => {
  // 删除所有旧的属性
  preProps = preProps || [];
  props = props || [];
  Object.keys(preProps)
    .filter(isAttribute)
    .forEach((name) => {
      if (preProps[name] === props[name]) {
        return;
      }
      dom[name] = null;
    });
  Object.keys(preProps)
    .filter(isListener)
    .forEach(name => {
      if (preProps[name] === props[name]) {
        return;
      }
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, preProps[name]);
    });

  // 添加所有新的属性
  Object.keys(props)
    .filter(isAttribute)
    .forEach((name) => {
      if (preProps[name] === props[name]) {
        return;
      }
      dom[name] = props[name];
    });
  // 添加event listener
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      if (preProps[name] === props[name]) {
        return;
      }
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name]);
    });
}

/**
 * 把fiber转换为dom节点
 * @param {Fiber} fiber
 * @return {HTMLElement}
 */
const createDOM = (fiber) => {
  if (!fiber) {
    throw new Error("fiber not exist!");
  }
  const { type, props } = fiber;
  let node;
  // 文本元素
  if (fiber.type === TYPE.TEXT_ELEMENT) {
    node = document.createTextNode("");
  } else {
    node = document.createElement(type);
  }
  updateDomProperties(node, [], props);
  return node;
}


/**
 * 把workingInProgress tree渲染进dom
 */
const commitRoot = (deletionList) => {
  commitWork(MiniReact.wipRoot.child);
  if (deletionList) {
    deletionList.forEach(fiber => {
      fiber.dom.parentNode.removeChild(fiber.dom);
    });
  }
  MiniReact.currentRoot = MiniReact.wipRoot;
  MiniReact.wipRoot = null;
}
window.commitRoot = commitRoot;

/**
 * 把workingInProgress fiber tree渲染进dom
 */
const commitWork = (fiber) => {
  if (!fiber) {
    return;
  }
  let parent = fiber.return;
  if (!parent.dom) {
    parent = parent.return;
  }
  const parentDom = parent.dom;
  if (typeof fiber.type === "string" && !fiber.dom) {
    fiber.dom = createDOM(fiber);
  }
  if (fiber.effectTag === EFFECT_TAG.NEW && fiber.dom !== null) {
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === EFFECT_TAG.UPDATE && fiber.dom !== null) {
    updateDomProperties(fiber.alternate.dom, fiber.alternate.props, fiber.props);
  }
  delete fiber.effectTag;
  delete fiber.alternate;
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export default {
  render,
}

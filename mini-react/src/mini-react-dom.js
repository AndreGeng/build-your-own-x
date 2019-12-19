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
  window.requestIdleCallback(MiniReact.workLoop(MiniReact.wipRoot));
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
const commitRoot = (effectList) => {
  effectList.forEach(fiber => {
    switch(fiber.effectTag) {
      case EFFECT_TAG.NEW: {
        if (typeof fiber.type === "string" && !fiber.dom) {
          fiber.dom = createDOM(fiber);
        }
        let parent = fiber.return;
        if (!parent.dom) {
          parent = parent.return;
        }
        const parentDom = parent.dom;
        if (fiber.dom) {
          parentDom.appendChild(fiber.dom);
        }
        break;
      }
      case EFFECT_TAG.DELETE:
        fiber.dom.parentNode.removeChild(fiber.dom);
        break;
      case EFFECT_TAG.UPDATE:
        if (fiber.dom) {
          updateDomProperties(fiber.dom, fiber.alternate.props, fiber.props);
        }
        break;
    }
  })
  MiniReact.currentRoot = MiniReact.wipRoot;
  MiniReact.currentRoot.alternate = null;
}
window.commitRoot = commitRoot;

export default {
  render,
}

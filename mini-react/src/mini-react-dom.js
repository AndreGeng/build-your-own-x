const isListener = name => name.startsWith("on");
const isAttribute = name => !isListener(name) && name !== "children";
/**
* @typedef {Object} Instance
* @property {MiniReactElement} element
* @property {HTMLElement} dom
* @property {Instance[]} childInstances
* instance是MiniReactElement渲染到dom后的一种表示
*/
let rootInstance = null;
/**
* @param {MiniReactElement} element
* @param {HTMLElement} container 
*/
const render = (element, container) => {
		const preRootInstance = rootInstance;
		rootInstance = reconcile(container, preRootInstance, element);
}

/**
 * 递归调用reconcile生成childInstances 
 * @param {Instance} preInstance
 * @param {MiniReactElement} element
 * @return {Instance[]}
 */
const reconcileChildren = (preInstance, newInstance) => {
  const element = newInstance.element;
  const count = Math.max((preInstance && preInstance.childInstances.length) || 0, (element.props && element.props.children.length) || 0);
  const newChildrenInstances = [];
  for (let i = 0; i < count; i++) {
    const preChildInstance = (preInstance && preInstance.childInstances[i]) || null;
    const child = element.props && element.props.children[i];
    const childInstance = reconcile(newInstance.dom, preChildInstance, child);
    newChildrenInstances.push(childInstance);
  }
  return newChildrenInstances;
}
/**
 * 对比新老instance，完成dom树的更新
 * @param {HTMLElement} container
 * @param {Instance} preInstance
 * @param {MiniReactElement} element
 * @return {Instance} newInstance
 */
const reconcile = (container, preInstance, element) => {
  // 旧的节点需要删除
  if (!element) {
    container.removeChild(preInstance.dom);
    return null;
  }
  if (!preInstance) {
		// 新增节点
		const newInstance = instatiate(element);
    container.appendChild(newInstance.dom);
    return newInstance;
  } 
  if (preInstance.element.type !== element.type) {
    // 类型不一致，替换节点
    const newInstance = instatiate(element);
    container.replaceChild(preInstance.dom, newInstance.dom);
    return newInstance;
  } 
  const newInstance = {
    element,
  };
  if (preInstance.element.type === element.type) {
    // 类型一致，复用节点
    newInstance.dom = preInstance.dom;
    updateDomProperties(preInstance.dom, preInstance.element.props, element.props);
  } 
	// 递归生成childrenInstance
  newInstance.childInstances = reconcileChildren(preInstance, newInstance);
  return newInstance;
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
* 返回instance对象
* @param {MiniReactElement} element
* @return {Instance}
*/
const instatiate = (element) => {
  if (!element) {
    throw new Error("element not exist!");
  }
  const instance = {
    element,
  };
  // 文本元素
  if (!element.type) {
    const textNode = document.createTextNode(element);
    instance.dom = textNode;
    instance.childInstances = [];
    return instance;
  }
  const props = element.props || {};
  let children = props.children;
  if (!children) {
    children = [];
  } else if (typeof children === "string") {
    children = [children];
  }
  const node = document.createElement(element.type);
  updateDomProperties(node, [], props);
  instance.dom = node;
  const childInstances = children.map(instatiate);
  const childDoms = childInstances.map(instance => instance.dom);
  childDoms.forEach(dom => node.appendChild(dom));
  instance.childInstances = childInstances;
  return instance;
}

export default {
  render,
}

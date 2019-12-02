const isListener = name => name.startsWith("on");
const isAttribute = name => !isListener(name) && name !== "children";
const render = (component, container) => {
  if (!component) {
    throw new Error("component not exist!");
  }
  if (!container) {
    throw new Error("container not exist!");
  }
  // 文本元素
  if (!component.type) {
    const textNode = document.createTextNode(component);
    container.appendChild(textNode);
    return;
  }
  const props = component.props || {};
  let children = props.children;
  if (!children) {
    children = [];
  } else if (typeof children === "string") {
    children = [children];
  }
  const node = document.createElement(component.type);
  // 添加properties
  Object.keys(props)
    .filter(isAttribute)
    .forEach((name) => {
      node[name] = props[name];
    });
  // 添加event listener
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      node.addEventListener(eventType, props[name]);
    });
  // 递归遍历children
  if (children && children.length > 0) {
    children.forEach((child) => {
      render(child, node);
    });
  }
  container.appendChild(node);
}

export default {
  render,
}

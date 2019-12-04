import { reconcile } from "./mini-react-dom";

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
const createElement = (type, config, ...args) => {
  const props = Object.assign({}, config, {
    children: flattenArray(args),
  });
  return {
    type,
    props,
  }
}

const updateInstance = (instance, element) => {
  reconcile(instance.dom.parentNode, instance, element);
}
class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }
  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance, this.__internalInstance.element);
  }
  render() {
    return null;
  }
}

export default {
  createElement,
  Component,
}

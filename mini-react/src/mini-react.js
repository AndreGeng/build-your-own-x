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

export default {
  createElement,
}

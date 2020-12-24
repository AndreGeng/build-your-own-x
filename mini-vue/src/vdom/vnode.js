class VNode {
  constructor(tag, data, children, text, elm, context, componentOptions) {
    this.tag = tag
    this.data = data || {}
    this.elm = elm
    this.text = text
    this.children = children
    this.context = context
    this.componentOptions = componentOptions
  }
}

export default VNode

export function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

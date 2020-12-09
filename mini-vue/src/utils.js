export function isObject(v) {
    return v !== null && typeof v === "object"
}
export function isUndef(v) {
  return v === undefined || v === null
}
export function isDef(v) {
  return v !== undefined && v !== null
}
const _toString = Object.prototype.toString
export function toString(val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "symbol" ||
    typeof value === "boolean"
  )
}

export function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
export const isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,' +
  'truespeed,typemustmatch,visible'
)
export const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck')
export const isFalsyAttrValue = (val) => {
  return val == null || val === false
}
export function makeMap (
  str,
  expectsLowerCase,
) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
export function genClassForVnode (vnode) {
  let data = vnode.data
  return renderClass(data.staticClass, data.class)
}
function renderClass (
  staticClass,
  dynamicClass,
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, dynamicClass)
  }
  return ''
}
function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}
export function isTrue (v) {
  return v === true
}
export function toArray (list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

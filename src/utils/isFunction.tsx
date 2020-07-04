const {toString} = Object.prototype

const isFunction = (value: unknown): value is (...args: any[]) => any =>
  toString.call(value) === '[object Function]'

export default isFunction

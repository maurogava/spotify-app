export type Obj = Record<string, string | number> | null

export const shallowEqual = (obj1?: Obj, obj2?: Obj) => {
  if (Object.is(obj1, obj2)) {
    return true
  }

  if (typeof obj1 !== 'object' || !obj1 || typeof obj2 !== 'object' || !obj2) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  const obj2HasOwnProp = Object.prototype.hasOwnProperty.bind(obj2)

  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i]

    if (!obj2HasOwnProp(key)) {
      return false
    }

    const valueA = obj1[key]
    const valueB = obj2[key]

    if (!Object.is(valueA, valueB)) {
      return false
    }
  }

  return true
}

export function callIfDefined (fnc, ...props) {
  return fnc && fnc(...props)
}

export function createAreShallowEqual (excludedKeys = []) {
  return function areShallowEqual (a, b) {
    const aKeys = Object.keys(a)
    return aKeys.length === Object.keys(b).length && aKeys.reduce((res, key) => res && (
      excludedKeys.includes(key) ||
      a[key] === b[key]
    ), true)
  }
}
export const areShallowEqual = createAreShallowEqual()

export function createDidChange (compareFnc, initialValue) {
  let lastValue = initialValue

  return function (value) {
    if (!compareFnc(lastValue, value)) {
      lastValue = value

      return true
    }

    return false
  }
}

import { useRef } from 'react'
import { shallowEqual, Obj } from 'utils/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useShallowCompareMemo = (value?: any) => {
  const ref = useRef<Obj>()

  if (!shallowEqual(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export default useShallowCompareMemo

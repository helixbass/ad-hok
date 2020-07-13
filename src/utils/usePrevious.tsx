import {useRef, useEffect} from 'react'

const usePrevious = <TValue,>(value: TValue): TValue | undefined => {
  const ref = useRef<TValue>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default usePrevious

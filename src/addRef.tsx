import {useRef, MutableRefObject} from 'react'

import isFunction from 'utils/isFunction'
import useMemoized from 'utils/useMemoized'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from 'helperTypes'

type AddRefType = <TRefName extends string, TRefValue, TProps>(
  refName: TRefName,
  initialValue?: ValueOrFunctionOfProps<TRefValue, TProps>,
) => CurriedPropsAdder<
  TProps,
  {
    [refName in TRefName]: MutableRefObject<TRefValue>
  }
>

const addRef: AddRefType = <TRefName extends string, TRefValue, TProps>(
  name: TRefName,
  initialValue:
    | TRefValue
    | ((props: TProps) => TRefValue) = (undefined as unknown) as TRefValue,
) => (props: TProps) => {
  const computedInitialValue = useMemoized(
    () => (isFunction(initialValue) ? initialValue(props) : initialValue),
    [],
  )
  const ref = useRef(computedInitialValue)
  type TRefName = typeof name
  type TRefValue = typeof computedInitialValue
  type TProps = typeof props
  return {
    ...props,
    [name]: ref,
  } as TProps &
    {
      [refName in TRefName]: MutableRefObject<TRefValue>
    }
}

export default addRef

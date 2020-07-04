import isFunction from 'utils/isFunction'
import useComputedFromDependencies from 'utils/useComputedFromDependencies'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from 'helperTypes'

export type AddPropsType = <
  TProps extends {},
  AdditionalProps extends {[key: string]: any}
>(
  createProps: ValueOrFunctionOfProps<AdditionalProps, TProps>,
  dependencies?: string[],
) => CurriedPropsAdder<TProps, AdditionalProps>

const addProps: AddPropsType = (updater, dependencies) => (props) => {
  const getAddedProps = () => (isFunction(updater) ? updater(props) : updater)

  const addedProps = useComputedFromDependencies({
    compute: getAddedProps,
    dependencies,
    props,
  })

  return {
    ...props,
    ...addedProps,
  }
}

export default addProps

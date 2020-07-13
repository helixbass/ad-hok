import isFunction from './utils/isFunction'
import useComputedFromDependencies from './utils/useComputedFromDependencies'
import {
  ValueOrFunctionOfProps,
  CurriedPropsAdder,
  DependenciesArgument,
} from './helperTypes'

type AddPropsType = <
  TProps extends {},
  TAdditionalProps extends {[key: string]: any}
>(
  createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>,
  dependencies?: DependenciesArgument<TProps>,
) => CurriedPropsAdder<TProps, TAdditionalProps>

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

import isFunction from './utils/isFunction'
import addProps from './addProps'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from './helperTypes'

type AddDefaultPropsType = <
  TProps extends {},
  TAdditionalProps extends Partial<TProps>
>(
  createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>,
  dependencies?: string[],
) => CurriedPropsAdder<TProps, TAdditionalProps>

const addDefaultProps: AddDefaultPropsType = (createDefaults) =>
  addProps((props) => {
    const defaults = isFunction(createDefaults)
      ? createDefaults(props)
      : createDefaults

    const newProps = {} as typeof defaults

    for (const key in defaults) {
      if ((props as any)[key] == null) {
        newProps[key] = defaults[key]
      }
    }

    return newProps
  })

export default addDefaultProps

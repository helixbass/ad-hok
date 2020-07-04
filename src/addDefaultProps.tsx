import isFunction from 'utils/isFunction'
import addProps, {AddPropsType} from './addProps'

const addDefaultProps: AddPropsType = (createDefaults) =>
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

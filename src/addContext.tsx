import {useContext, Context} from 'react'

import {CurriedPropsAdder} from 'helperTypes'

type AddContextType = <TContextName extends string, TContext, TProps>(
  context: Context<TContext>,
  contextName: TContextName,
) => CurriedPropsAdder<
  TProps,
  {
    [contextName in TContextName]: TContext
  }
>

const addContext: AddContextType = (context, name) => (props) => {
  const value = useContext(context)
  type TProps = typeof props
  type TContextName = typeof name
  type TContext = typeof context extends Context<infer TContextValue>
    ? TContextValue
    : never
  return {
    ...props,
    [name]: value,
  } as TProps &
    {
      [contextName in TContextName]: TContext
    }
}

export default addContext

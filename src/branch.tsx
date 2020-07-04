import React, {ComponentType, FC} from 'react'

import flowMax from './flowMax'
import {markerPropertyName} from './branch-avoid-circular-dependency'
import {UnchangedProps, CurriedPropsAdder} from 'helperTypes'

type BranchOneBranchType = <TProps>(
  test: (props: TProps) => boolean,
  left: (props: TProps) => any,
) => UnchangedProps<TProps>

type BranchTwoBranchType = <RightProps, TProps>(
  test: (props: TProps) => boolean,
  left: (props: TProps) => any,
  right: (props: TProps) => RightProps,
) => CurriedPropsAdder<TProps, RightProps>

export type BranchType = BranchOneBranchType & BranchTwoBranchType

const branch = ((
  test: (props: any) => boolean,
  consequent: (props: any) => any,
  alternate: (props: any) => unknown = (props) => props,
) => {
  const ret = (Component: ComponentType) => {
    let ConsequentAsComponent: FC<any> | null = null
    const createConsequent = () => {
      const Consequent: FC<any> = flowMax(consequent, Component)
      Consequent.displayName = `branch(${
        Consequent.displayName == null || Consequent.displayName === 'ret'
          ? Component.displayName ?? ''
          : Consequent.displayName
      })`
      return Consequent
    }
    let AlternateAsComponent: FC<any> | null = null
    const createAlternate = () => {
      const Alternate: FC<any> = flowMax(alternate, Component)
      Alternate.displayName = `branch(${
        Alternate.displayName == null || Alternate.displayName === 'ret'
          ? Component.displayName ?? ''
          : Alternate.displayName
      })`
      return Alternate
    }
    return (props: any) => {
      if (test(props)) {
        if (!ConsequentAsComponent) {
          ConsequentAsComponent = createConsequent()
        }
        const Consequent = ConsequentAsComponent!
        return <Consequent {...props} />
      } else {
        if (!AlternateAsComponent) {
          AlternateAsComponent = createAlternate()
        }
        const Alternate = AlternateAsComponent!
        return <Alternate {...props} />
      }
    }
  }
  ;(ret as any)[markerPropertyName] = true
  return ret
}) as BranchType

export default branch

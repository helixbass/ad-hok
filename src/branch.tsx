import React, {FC, ReactElement} from 'react'

import flowMax from './flowMax'
import {markerPropertyName} from './branch-avoid-circular-dependency'
import {CurriedUnchangedProps, CurriedPropsAdder} from './helperTypes'

export const branch = <TProps extends {}, TAdditionalProps extends {}>(
  test: (props: TProps) => boolean,
  consequent: (props: TProps) => TProps & TAdditionalProps,
  alternate: (props: TProps) => TProps & TAdditionalProps = (props) =>
    props as TProps & TAdditionalProps,
): ((Component: FC<TProps>) => (props: TProps) => ReactElement | null) => {
  const ret = (Component: FC<TProps>) => {
    let ConsequentAsComponent: FC<TProps> | null = null
    const createConsequent = () => {
      const Consequent: FC<TProps> = flowMax(consequent, Component)
      Consequent.displayName = `branch(${
        Consequent.displayName == null || Consequent.displayName === 'ret'
          ? Component.displayName ?? ''
          : Consequent.displayName
      })`
      return Consequent
    }
    let AlternateAsComponent: FC<TProps> | null = null
    const createAlternate = () => {
      const Alternate: FC<any> = flowMax(alternate, Component)
      Alternate.displayName = `branch(${
        Alternate.displayName == null || Alternate.displayName === 'ret'
          ? Component.displayName ?? ''
          : Alternate.displayName
      })`
      return Alternate
    }
    return (props: TProps) => {
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
}

type BranchOneBranchType = <TProps extends {}>(
  test: (props: TProps) => boolean,
  left: (props: TProps) => any,
) => CurriedUnchangedProps<TProps>

type BranchTwoBranchType = <TRightProps extends {}, TProps extends {}>(
  test: (props: TProps) => boolean,
  left: (props: TProps) => any,
  right: (props: TProps) => TRightProps,
) => CurriedPropsAdder<TProps, TRightProps>

export type BranchType = BranchOneBranchType & BranchTwoBranchType

const branchPublishedType = branch as BranchType
export default branchPublishedType

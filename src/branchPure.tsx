import {BranchType} from './branch'

const branchPure: BranchType = <TProps,>(
  test: (props: TProps) => boolean,
  consequent: (props: TProps) => any,
  alternate: (props: TProps) => unknown = (props) => props,
) => (props: TProps) => (test(props) ? consequent(props) : alternate(props))

export default branchPure

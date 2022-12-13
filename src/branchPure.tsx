import {BranchType} from './branch'

const branchPure = <TProps extends {}>(
  test: (props: TProps) => boolean,
  consequent: (props: TProps) => any,
  alternate: (props: TProps) => unknown = (props) => props,
) => (props: TProps) => (test(props) ? consequent(props) : alternate(props))

const branchPurePublishedType = branchPure as BranchType
export default branchPurePublishedType

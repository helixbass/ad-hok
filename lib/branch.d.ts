import React, { FC, ReactElement } from 'react';
import { CurriedUnchangedProps, CurriedPropsAdder } from './helperTypes';
export declare const branch: <TProps extends {}, TAdditionalProps extends {}>(test: (props: TProps) => boolean, consequent: (props: TProps) => TProps & TAdditionalProps, alternate?: (props: TProps) => TProps & TAdditionalProps) => (Component: React.FC<TProps>) => (props: TProps) => ReactElement | null;
type BranchOneBranchType = <TProps extends {}>(test: (props: TProps) => boolean, left: (props: TProps) => any) => CurriedUnchangedProps<TProps>;
type BranchTwoBranchType = <TRightProps extends {}, TProps extends {}>(test: (props: TProps) => boolean, left: (props: TProps) => any, right: (props: TProps) => TRightProps) => CurriedPropsAdder<TProps, TRightProps>;
export type BranchType = BranchOneBranchType & BranchTwoBranchType;
declare const branchPublishedType: BranchType;
export default branchPublishedType;

import React, { FC, ReactElement } from 'react';
import { UnchangedProps, CurriedPropsAdder } from 'helperTypes';
export declare const branch: <TProps, TAdditionalProps>(test: (props: TProps) => boolean, consequent: (props: TProps) => TProps & TAdditionalProps, alternate?: (props: TProps) => TProps & TAdditionalProps) => (Component: React.FC<TProps>) => (props: TProps) => ReactElement | null;
declare type BranchOneBranchType = <TProps>(test: (props: TProps) => boolean, left: (props: TProps) => any) => UnchangedProps<TProps>;
declare type BranchTwoBranchType = <RightProps, TProps>(test: (props: TProps) => boolean, left: (props: TProps) => any, right: (props: TProps) => RightProps) => CurriedPropsAdder<TProps, RightProps>;
export declare type BranchType = BranchOneBranchType & BranchTwoBranchType;
declare const branchPublishedType: BranchType;
export default branchPublishedType;

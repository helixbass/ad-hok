declare const useComputedFromDependencies: <TValue, TProps extends {}>({ compute, dependencies, additionalResolvedDependencies, props, }: {
    compute: () => TValue;
    dependencies?: string[] | ((prevProps: TProps, props: TProps) => boolean) | undefined;
    additionalResolvedDependencies?: unknown[] | undefined;
    props: TProps;
}) => TValue;
export default useComputedFromDependencies;

declare const useMemoized: <TValue>(compute: () => TValue, dependencies: unknown[]) => TValue;
export default useMemoized;

import { useEffect, useRef } from 'react';

/**
 * React hook that mirrors a debounced callback. It ensures the latest
 * callback is invoked only after the provided delay has elapsed.
 */
export const useDebouncedEffect = (
    callback: () => void,
    delay: number,
    deps: React.DependencyList,
) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handler = setTimeout(() => {
            callbackRef.current();
        }, delay);

        return () => {
            clearTimeout(handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, delay]);
};

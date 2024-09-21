import { isBrowser } from "@tallman5/core-js";
import { useEffect, useRef, useState } from "react"

export const masonryQueries = [
    '(min-width: 1650px)', '(min-width: 1375px)', '(min-width: 1100px)', '(min-width: 825px)', '(min-width: 550px)'
]

export function useMasonryColumns() {
    return useMedia(masonryQueries, [6, 5, 4, 3, 2], 1)
}

export function useMedia<T>(queries: string[], values: T[], defaultValue: T) {
    if (!isBrowser) return defaultValue

    const mediaQueryLists = queries.map((q) => window?.matchMedia(q));

    const getValue = () => {
        const index = mediaQueryLists.findIndex((mql) => mql.matches);
        return values?.[index] || defaultValue;
    };

    const [value, setValue] = useState<T>(getValue);

    useEffect(
        () => {
            const handler = () => setValue(getValue);
            mediaQueryLists.forEach((mql) => mql.addEventListener("change", handler));
            return () => mediaQueryLists.forEach((mql) => mql.removeEventListener("change", handler));
        }, []);

    return value;
}

export function usePrevious<T>(value: T) {
    const ref = useRef<T>()
    useEffect(() => void (ref.current = value), [value])
    return ref.current
}

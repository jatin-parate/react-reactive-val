import {
  type ReactNode,
  type ReactElement,
  useSyncExternalStore,
  memo,
  useMemo,
} from "react";
import { jsx } from "react/jsx-runtime";

export default function useReactiveValue<T extends ReactNode>(initialValue: T) {
  return useMemo(() => reallyReactiveVal(initialValue), [initialValue]);
}

export const reallyReactiveVal = <T extends ReactNode>(initialValue: T) => {
  let value: T = initialValue;
  const onUpdates = new Set<() => void>();

  const Component = memo(function Component() {
    const currVal = useSyncExternalStore(
      (listener) => {
        onUpdates.add(listener);
        return () => onUpdates.delete(listener);
      },
      () => value
    );

    return currVal;
  });

  type Updater = T | ((currVal: T) => T);

  function fn<U extends Updater | unknown | undefined>(updater?: U) {
    if (typeof updater === "undefined") {
      return jsx(Component, {});
    }

    // Type narrowing correctly applies here: updater is not undefined
    value = typeof updater === "function" ? updater(value) : updater;

    onUpdates.forEach((item) => {
      item();
    });

    return undefined;
  }

  return fn as <U extends Updater | unknown | undefined>(
    updater?: U
  ) => U extends Updater ? undefined : ReactElement;
};

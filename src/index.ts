import {
  type ReactNode,
  type ReactElement,
  useSyncExternalStore,
  memo,
  useMemo,
  createContext,
  useContext,
  Component as ReactComponent,
  PropsWithChildren,
} from 'react';
import { jsx } from 'react/jsx-runtime';

export default function useReactiveValue<T extends ReactNode>(initialValue: T) {
  return useMemo(() => reallyReactiveVal(initialValue), [initialValue]);
}

type UpdaterType<T> = T | ((currVal: T) => T);
type FnType<T> = <U extends UpdaterType<T> | unknown | undefined>(
  updater?: U
) => U extends UpdaterType<T> ? undefined : ReactElement;

const Context = createContext<FnType<ReactElement> | null>(null);

export const useReactiveValueContext = () => {
  return useContext(Context);
};

export const reallyReactiveVal = <T extends ReactNode>(initialValue: T) => {
  let value: T = initialValue;
  const onUpdates = new Set<() => void>();

  const Component = memo(function Component() {
    const currVal = useSyncExternalStore(
      listener => {
        onUpdates.add(listener);
        return () => onUpdates.delete(listener);
      },
      () => value
    );

    return currVal;
  });

  type Updater = UpdaterType<T>;

  function reactiveValue<U extends Updater | unknown | undefined>(updater?: U) {
    if (typeof updater === 'undefined') {
      return jsx(Component, {});
    }

    // Type narrowing correctly applies here: updater is not undefined
    value = typeof updater === 'function' ? updater(value) : updater;

    onUpdates.forEach(item => {
      item();
    });

    return undefined;
  }

  const ContextProvider = memo(function ContextProvider({
    // eslint-disable-next-line react/prop-types
    children,
  }: PropsWithChildren) {
    return jsx(Context.Provider, { value: reactiveValue, children });
  }) as unknown as ReactComponent;

  return [reactiveValue as FnType<T>, ContextProvider];
};

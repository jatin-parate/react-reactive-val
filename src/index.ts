import {
  type ReactNode,
  type ReactElement,
  useSyncExternalStore,
  memo,
  useMemo,
  createContext,
  useContext,
  PropsWithChildren,
  type JSX,
  useEffect,
} from 'react';
import { jsx } from 'react/jsx-runtime';

export default function useReactiveValue<T extends ReactNode>(initialValue: T) {
  return useMemo(() => reallyReactiveVal(initialValue), [initialValue]);
}

type UpdaterType<T> = T | ((currVal: T) => T);
type EffectCallback<T> = (value: T) => void | (() => void);
type FnType<T> = {
  <U extends UpdaterType<T> | unknown | undefined>(
    updater?: U
  ): U extends UpdaterType<T> ? undefined : ReactElement;
  effect: (callback: EffectCallback<T>) => () => void;
};

export const Context = createContext<FnType<ReactElement> | null>(null);

export const useReactiveValueContext = () => {
  return useContext(Context);
};

export const reallyReactiveVal = <T extends ReactNode>(initialValue: T) => {
  let value: T = initialValue;
  const onUpdates = new Set<() => void>();
  const effects = new Set<EffectCallback<T>>();
  const cleanups = new Map<EffectCallback<T>, (() => void) | void>();

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
    const oldValue = value;
    value = typeof updater === 'function' ? updater(value) : updater;

    // Run effects only if value has changed
    if (oldValue !== value) {
      // Clean up previous effects
      effects.forEach(effect => {
        const cleanup = cleanups.get(effect);
        if (cleanup) cleanup();
      });

      // Run effects with new value
      effects.forEach(effect => {
        const cleanup = effect(value);
        cleanups.set(effect, cleanup);
      });
    }

    onUpdates.forEach(item => {
      item();
    });

    return undefined;
  }

  // Add effect method to reactive value
  const enhancedReactiveValue = Object.assign(reactiveValue, {
    effect: (callback: EffectCallback<T>) => {
      effects.add(callback);
      const cleanup = callback(value);
      cleanups.set(callback, cleanup);

      // Return cleanup function
      return () => {
        effects.delete(callback);
        const cleanup = cleanups.get(callback);
        if (cleanup) cleanup();
        cleanups.delete(callback);
      };
    },
  });

  const ContextProvider = memo(function ContextProvider({
    // eslint-disable-next-line react/prop-types
    children,
  }: PropsWithChildren) {
    return jsx(Context.Provider, { value: enhancedReactiveValue, children });
  }) as unknown as (props: PropsWithChildren) => JSX.Element;

  return [enhancedReactiveValue as FnType<T>, ContextProvider] as const;
};

// Add a React hook for easier effect management
export const useReactiveEffect = <T extends ReactNode>(
  reactiveValue: FnType<T>,
  callback: EffectCallback<T>
) => {
  useEffect(() => {
    return reactiveValue.effect(callback);
  }, [reactiveValue, callback]);
};

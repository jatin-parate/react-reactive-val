# React Reactive Val

A lightweight, type-safe reactive value management library for React applications. This library provides a simple way to manage reactive values in React components with minimal boilerplate and includes powerful Context integration for efficient state sharing.

## Features

- 🎯 **Type-safe**: Built with TypeScript for excellent type inference
- 🪶 **Lightweight**: Tiny footprint with zero dependencies
- ⚡ **Fast**: Built on React's `useSyncExternalStore` for optimal performance
- 🔄 **Reactive**: Values update automatically across components
- 📦 **Tree-shakeable**: Only import what you need
- 🌳 **Multiple formats**: Supports ESM, CommonJS, and UMD
- 🌟 **Context Support**: Share reactive values efficiently through React Context
- 🎭 **Side Effects**: Register callbacks to run when values change

## Installation

```bash
npm install react-reactive-val
# or
yarn add react-reactive-val
# or
pnpm add react-reactive-val
```

## Usage

### Basic Example

```tsx
import useReactiveValue from 'react-reactive-val';

function Counter() {
  const count = useReactiveValue(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => count(prev => prev + 1)}>Increment</button>
    </div>
  );
}
```

### Side Effects (New in v2.1.0)

You can register side effects to run whenever a reactive value changes:

```tsx
import { reallyReactiveVal, useReactiveEffect } from 'react-reactive-val';
import { useCallback } from 'react';

// Create a shared reactive value
const [count, CountProvider] = reallyReactiveVal(0);

// Register an effect directly
const cleanup = count.effect(value => {
  console.log(`Count changed to: ${value}`);
  // Optional cleanup function
  return () => console.log('Cleaning up previous effect');
});

// Later, you can clean up the effect
cleanup();

// Or use the hook in components for automatic cleanup
function CounterWithEffect() {
  // Using useCallback to memoize the effect callback
  const effectCallback = useCallback((value: number) => {
    console.log(`Count in component is: ${value}`);
    return () => console.log('Component effect cleanup');
  }, []); // Empty deps array since we don't use any external values

  useReactiveEffect(count, effectCallback);

  // You can also inline it if you prefer
  useReactiveEffect(
    count,
    useCallback(value => {
      console.log(`Count changed to: ${value}`);
    }, [])
  );

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => count(prev => prev + 1)}>Increment</button>
    </div>
  );
}
```

### Sharing State Between Components

#### Using Direct Reference

```tsx
import { reallyReactiveVal } from 'react-reactive-val';

// Create a shared reactive value
const [sharedCount, CountProvider, useSharedCount] = reallyReactiveVal(0);

function CounterDisplay() {
  return <div>Count: {sharedCount()}</div>;
}

function CounterButtons() {
  return (
    <div>
      <button onClick={() => sharedCount(prev => prev + 1)}>Increment</button>
      <button onClick={() => sharedCount(prev => prev - 1)}>Decrement</button>
    </div>
  );
}
```

#### Using Context

```tsx
import { reallyReactiveVal } from 'react-reactive-val';

// Create a reactive value with context
const [countValue, CountProvider, useCountContext] = reallyReactiveVal(0);

function App() {
  return (
    <CountProvider>
      <CounterDisplay />
      <CounterButtons />
    </CountProvider>
  );
}

function CounterDisplay() {
  const count = useCountContext();
  return <div>Count: {count()}</div>;
}

function CounterButtons() {
  const count = useCountContext();
  return (
    <div>
      <button onClick={() => count(prev => prev + 1)}>Increment</button>
      <button onClick={() => count(prev => prev - 1)}>Decrement</button>
    </div>
  );
}
```

## API Reference

### `useReactiveValue<T>(initialValue: T)`

A React hook that creates a reactive value within a component.

```tsx
const value = useReactiveValue(initialValue);
```

- `initialValue`: The initial value of the reactive state
- Returns: A function that can both read and update the value

### `reallyReactiveVal<T>(initialValue: T)`

Creates a standalone reactive value that can be used across components. Returns a tuple containing the reactive value function, a Context Provider component, and a custom hook for accessing the value through context.

```tsx
const [value, Provider, useValue] = reallyReactiveVal(initialValue);
```

- `initialValue`: The initial value of the reactive state
- Returns: A tuple containing:
  1. A function that can both read and update the value, with an additional `effect` method
  2. A Context Provider component for wrapping consumers
  3. A custom hook for accessing the value within the Context

### `useReactiveEffect<T>(reactiveValue: FnType<T>, callback: EffectCallback<T>)`

A React hook for managing side effects with reactive values. Best used with `useCallback` to prevent unnecessary effect re-registrations.

```tsx
// Basic usage
useReactiveEffect(
  value,
  useCallback(newValue => {
    console.log(`Value changed to: ${newValue}`);
    return () => {
      // Optional cleanup
    };
  }, [])
); // Empty deps array if not using external values

// With dependencies
const deps = useMemo(() => ({ min: 0, max: 100 }), []);
useReactiveEffect(
  value,
  useCallback(
    newValue => {
      if (newValue > deps.max || newValue < deps.min) {
        console.log('Value out of bounds!');
      }
    },
    [deps]
  )
);
```

- `reactiveValue`: The reactive value to watch
- `callback`: Function to run when the value changes (recommended to wrap with useCallback)
- The callback can optionally return a cleanup function

### Usage with Value Getter/Setter

```tsx
// Get the current value
const currentValue = value();

// Set a new value
value(newValue);

// Update based on previous value
value(prev => computeNewValue(prev));

// Register a side effect
const cleanup = value.effect(newValue => {
  console.log(`Value changed to: ${newValue}`);
  return () => {
    // Optional cleanup
  };
});
```

## TypeScript Support

The library is written in TypeScript and provides full type inference:

```tsx
// Type is inferred from initial value
const count = useReactiveValue(0); // type: number

// Explicit type annotation
const user = useReactiveValue<User | null>(null);

// Type checking for updates
user(prev => ({ ...prev, name: 'John' })); // Type safe!

// With Context
const [userValue, UserProvider, useUser] = reallyReactiveVal<User | null>(null);

// With Effects
userValue.effect(user => {
  console.log(`User updated: ${user?.name}`);
  return () => {
    // Cleanup is properly typed
  };
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Jatin Parate ([@jatin4228](https://github.com/jatin4228))

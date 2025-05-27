# React Reactive Val

A lightweight, type-safe reactive value management library for React applications. This library provides a simple way to manage reactive values in React components with minimal boilerplate.

## Features

- 🎯 **Type-safe**: Built with TypeScript for excellent type inference
- 🪶 **Lightweight**: Tiny footprint with zero dependencies
- ⚡ **Fast**: Built on React's `useSyncExternalStore` for optimal performance
- 🔄 **Reactive**: Values update automatically across components
- 📦 **Tree-shakeable**: Only import what you need
- 🌳 **Multiple formats**: Supports ESM, CommonJS, and UMD

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
      <button onClick={() => count(prev => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Sharing State Between Components

```tsx
import { reallyReactiveVal } from 'react-reactive-val';

// Create a shared reactive value
const sharedCount = reallyReactiveVal(0);

function CounterDisplay() {
  return <div>Count: {sharedCount()}</div>;
}

function CounterButtons() {
  return (
    <div>
      <button onClick={() => sharedCount(prev => prev + 1)}>
        Increment
      </button>
      <button onClick={() => sharedCount(prev => prev - 1)}>
        Decrement
      </button>
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

Creates a standalone reactive value that can be used across components.

```tsx
const value = reallyReactiveVal(initialValue);
```

- `initialValue`: The initial value of the reactive state
- Returns: A function that can both read and update the value

### Usage with Value Getter/Setter

```tsx
// Get the current value
const currentValue = value();

// Set a new value
value(newValue);

// Update based on previous value
value(prev => computeNewValue(prev));
```

## TypeScript Support

The library is written in TypeScript and provides full type inference:

```tsx
// Type is inferred from initial value
const count = useReactiveValue(0); // type: number

// Explicit type annotation
const user = useReactiveValue<User | null>(null);

// Type checking for updates
user(prev => ({ ...prev, name: "John" })); // Type safe!
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Jatin Parate ([@jatin4228](https://github.com/jatin4228)) 
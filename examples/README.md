# React Reactive Val Examples

This directory contains example applications demonstrating how to use React Reactive Val in different scenarios.

## Examples

### 1. Counter Example

A simple example showing both local and shared state management using React Reactive Val. This example demonstrates:

- Using `useReactiveValue` for component-local state
- Using `reallyReactiveVal` for shared state across components
- Basic state updates and reads

To run the counter example:

```bash
cd counter
npm install
npm start
```

### 2. Todo List Example

A more complex example showing how to build a full todo application with React Reactive Val. This example demonstrates:

- Managing complex state with TypeScript
- Sharing state across multiple components
- Filtering and transforming state
- Form handling
- Multiple state updates

To run the todo example:

```bash
cd todo
npm install
npm start
```

## Running the Examples

Each example is a standalone Vite application. To run any example:

1. Navigate to the example directory
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Open your browser to `http://localhost:5173`

## What You'll Learn

These examples demonstrate several key concepts:

- How to use both local and shared state
- TypeScript integration and type safety
- State updates with previous value
- Conditional rendering with reactive values
- Form handling with reactive values
- State filtering and transformation
- Component composition with shared state

## Directory Structure

```
examples/
├── counter/           # Basic counter example
│   ├── src/
│   │   ├── App.tsx
│   │   └── styles.css
│   └── package.json
└── README.md         # This file
```

import React from 'react';
import useReactiveValue, { reallyReactiveVal } from 'react-reactive-val';

// Create a shared counter that can be used across components
const sharedCounter = reallyReactiveVal(0);

function LocalCounter() {
  const count = useReactiveValue(0);

  return (
    <div className="counter">
      <h2>Local Counter</h2>
      <p>This counter's state is local to this component</p>
      <div className="counter-value">Count: {count()}</div>
      <div className="counter-buttons">
        <button onClick={() => count(prev => prev - 1)}>-</button>
        <button onClick={() => count(prev => prev + 1)}>+</button>
      </div>
    </div>
  );
}

function SharedCounter() {
  return (
    <div className="counter">
      <h2>Shared Counter</h2>
      <p>This counter's state is shared between components</p>
      <div className="counter-value">Count: {sharedCounter()}</div>
      <div className="counter-buttons">
        <button onClick={() => sharedCounter(prev => prev - 1)}>-</button>
        <button onClick={() => sharedCounter(prev => prev + 1)}>+</button>
      </div>
    </div>
  );
}

function SharedCounterDisplay() {
  return (
    <div className="counter-display">
      <h3>Shared Counter Display</h3>
      <p>This component only displays the shared counter value</p>
      <div className="counter-value">Count: {sharedCounter()}</div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <h1>React Reactive Val Examples</h1>
      <div className="counters">
        <LocalCounter />
        <div className="shared-section">
          <SharedCounter />
          <SharedCounterDisplay />
        </div>
      </div>
    </div>
  );
}

export default App; 
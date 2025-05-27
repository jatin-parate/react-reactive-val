import React from 'react';
import useReactiveValue, { reallyReactiveVal } from 'react-reactive-val';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Create shared todo list state
const todosStore = reallyReactiveVal<Todo[]>([]);
const filterStore = reallyReactiveVal<'all' | 'active' | 'completed'>('all');

function TodoInput() {
  const inputValue = useReactiveValue('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue()) return;

    todosStore(todos => [
      ...todos,
      {
        id: Date.now(),
        text: inputValue(),
        completed: false
      }
    ]);
    inputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={inputValue()}
        onChange={e => inputValue(e.target.value)}
        placeholder="What needs to be done?"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

function TodoList() {
  const filter = filterStore();
  const todos = todosStore();

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const toggleTodo = (id: number) => {
    todosStore(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    todosStore(todos => todos.filter(todo => todo.id !== id));
  };

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

function TodoFilter() {
  const filter = filterStore();

  return (
    <div className="todo-filter">
      <button
        className={filter === 'all' ? 'active' : ''}
        onClick={() => filterStore('all')}
      >
        All
      </button>
      <button
        className={filter === 'active' ? 'active' : ''}
        onClick={() => filterStore('active')}
      >
        Active
      </button>
      <button
        className={filter === 'completed' ? 'active' : ''}
        onClick={() => filterStore('completed')}
      >
        Completed
      </button>
    </div>
  );
}

function TodoStats() {
  const todos = todosStore();
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-stats">
      <p>Total: {todos.length}</p>
      <p>Active: {activeCount}</p>
      <p>Completed: {completedCount}</p>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <h1>Todo List Example</h1>
      <div className="todo-app">
        <TodoInput />
        <TodoFilter />
        <TodoList />
        <TodoStats />
      </div>
    </div>
  );
}

export default App; 
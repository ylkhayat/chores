import React from "react";
import ChoresList from "./ChoresList";

const _data = [
  { id: 1, content: "Bananas", completed: true },
  { id: 2, content: "Burritos", completed: false },
  { id: 3, content: "Cameron", completed: true },
  { id: 4, content: "Heya", completed: false },
];

function Chores() {
  const onToggleComplete = (currentId) => {};
  const onAddTodo = (content) => {};
  return (
    <div className="App">
      <header className="App-header">
        <ChoresList data={_data} onToggleComplete={onToggleComplete} />
      </header>
    </div>
  );
}

export default Chores;

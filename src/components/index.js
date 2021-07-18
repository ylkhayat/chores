import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { FETCH_CHORES } from "../services";
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
  const { data, loading, fetchMore } = useQuery(FETCH_CHORES, {
    variables: { offset: "", limit: 10 },
  });
  console.log(loading, data);
  return (
    <div className="App">
      <header className="App-header">
        <ChoresList
          data={data?.chores ?? _data}
          onToggleComplete={onToggleComplete}
        />
      </header>
    </div>
  );
}

export default Chores;

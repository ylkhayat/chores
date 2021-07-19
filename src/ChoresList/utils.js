import { useState } from "react";

const useStateChore = (defaultValue) => {
  const [stateChore, setStateChore] = useState(defaultValue);
  const updateStateChore = (newValue) => {
    setStateChore((prevStateChore) => ({ ...prevStateChore, ...newValue }));
  };
  const resetStateChore = () => {
    setStateChore({});
  };
  return [stateChore, updateStateChore, resetStateChore];
};

export { useStateChore };

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import parseISO from "date-fns/parseISO";
import differenceInMinutes from "date-fns/differenceInMinutes";

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

const NOTIFIER_MS = 10000;

const useNotifier = ({ chores }) => {
  const [notifyingChores, setNotifyingChores] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (chores)
        chores.forEach((chore) => {
          const minutesLeft = differenceInMinutes(
            parseISO(chore?.dueDate),
            new Date(),
            {
              includeSeconds: true,
            }
          );
          if (
            !notifyingChores[chore.id] &&
            minutesLeft >= 0 &&
            minutesLeft <= 5
          ) {
            toast.dark(`${chore.title}'s due date is almost here ⏰`, {
              progress: false,
            });
          }
          setNotifyingChores((prevNotifyingChores) => ({
            ...prevNotifyingChores,
            [chore.id]: minutesLeft <= 5,
          }));
        });
    }, NOTIFIER_MS);

    return () => clearInterval(interval);
  }, [chores, notifyingChores]);
};

export { useStateChore, useNotifier };

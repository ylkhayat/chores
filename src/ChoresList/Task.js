import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { Box, IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import WarningIcon from "@material-ui/icons/Warning";

import { useStateChore } from "./utils";
import { differenceInMinutes, formatDistance, parseISO } from "date-fns";

const Task = ({ flipId, chore, ...props }, _) => {
  const [focused, setIsFocused] = useState(false);
  const [stateChore, setStateChore] = useStateChore(chore);

  useEffect(() => {
    setStateChore(chore);
  }, [chore, setStateChore]);

  const onToggleComplete = () => {
    props.onUpdateChore(stateChore.id, {
      ...stateChore,
      completed: !stateChore.stateCompleted,
    });
    setStateChore({ completed: !stateChore.completed });
  };
  const minutesLeft = differenceInMinutes(
    parseISO(chore?.dueDate),
    new Date(),
    {
      includeSeconds: true,
    }
  );
  const minutesLeftString = formatDistance(
    parseISO(chore?.dueDate),
    new Date(),
    {
      includeSeconds: true,
    }
  );

  return (
    <Tooltip
      title={
        minutesLeft < 0
          ? `This chore is past due`
          : `Due within ${minutesLeftString}`
      }
    >
      <Box
        className="task-container"
        onMouseEnter={(e) => {
          setIsFocused(true);
        }}
        onMouseLeave={(e) => {
          setIsFocused(false);
        }}
      >
        <Checkbox
          checked={stateChore.completed}
          onChange={onToggleComplete}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
        <Box className="task-sub-container">
          <Box display="flex" flexDirection="column" width="80%">
            <Typography color="white" width="100%">
              {stateChore.title}
            </Typography>
            <Typography color="secondary" width="100%" variant="caption">
              {stateChore.description}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {minutesLeft <= 5 && <WarningIcon />}
            {focused && (
              <IconButton
                color="primary"
                component="span"
                onClick={() => props.onChoreClick(chore)}
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              color="primary"
              component="span"
              onClick={() => props.onDeleteChore(chore.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(Task));

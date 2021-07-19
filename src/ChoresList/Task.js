import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CssTextField from "../components/CssTextField";
import { useStateChore } from "./utils";

const Task = ({ flipId, chore, ...props }, _) => {
  const [focused, setIsFocused] = useState(false);
  const [isEdit, setIsEditing] = useState(false);
  const [stateChore, setStateChore] = useStateChore(chore);

  const onEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
    setStateChore(chore);
  };
  const onToggleComplete = () => {
    props.onUpdateChore(stateChore.id, {
      ...stateChore,
      completed: !stateChore.stateCompleted,
    });
    setStateChore({ completed: !stateChore.completed });
  };

  const onSave = () => {
    props.onUpdateChore(stateChore.id, stateChore);
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  return (
    <Box>
      {isEdit ? (
        <Box
          className="task-container"
          onMouseEnter={(e) => {
            setIsFocused(true);
          }}
          onMouseLeave={(e) => {
            setIsFocused(false);
          }}
        >
          <Box className="task-sub-container" paddingLeft="14px" width="100%">
            <CssTextField
              color="primary"
              variant="standard"
              multiline
              autoFocus
              onChange={(event) => setStateChore({ title: event.target.value })}
              value={stateChore.title}
              style={{ width: "80%" }}
              inputProps={{
                style: {
                  color: "white",
                },
              }}
            />
            <Box display="flex">
              {focused && (
                <IconButton color="primary" component="span" onClick={onEdit}>
                  <CancelIcon />
                </IconButton>
              )}
              <IconButton color="primary" component="span" onClick={onSave}>
                <SaveIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      ) : (
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
            <Box display="flex">
              {focused && (
                <IconButton color="primary" component="span" onClick={onEdit}>
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
      )}
    </Box>
  );
};

export default React.memo(React.forwardRef(Task));

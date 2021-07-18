import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CssTextField from "../CssTextField";
import { Flipped } from "react-flip-toolkit";

const Task = ({ flipId, id, content, completed, ...props }) => {
  const [focused, setIsFocused] = useState(false);
  const [isEdit, setIsEditing] = useState(false);
  const [stateCompleted, setStateCompleted] = useState(completed);
  const [stateContent, setStateContent] = useState(content);
  const onEdit = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
    setStateCompleted(completed);
    setStateContent(content);
  };
  const onToggleComplete = () => {
    props.onUpdateChore(id, {
      content: stateContent,
      completed: !stateCompleted,
    });
    setStateCompleted((prevIsCompleted) => !prevIsCompleted);
  };

  // const shouldFlip = (prev, current) => {
  //   if (prev.type !== current.type) {
  //     return true;
  //   }
  //   return false;
  // };
  const onSave = () => {
    props.onUpdateChore(id, {
      content: stateContent,
      completed: stateCompleted,
    });
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  return (
    <Flipped flipId={flipId} key={flipId}>
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
              onChange={(event) => setStateContent(event.target.value)}
              value={stateContent}
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
            checked={stateCompleted}
            onChange={onToggleComplete}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
          <Box className="task-sub-container">
            <Typography color="white" width="80%">
              {stateContent}
            </Typography>
            <Box display="flex">
              {focused && (
                <IconButton color="primary" component="span" onClick={onEdit}>
                  <EditIcon />
                </IconButton>
              )}
              <IconButton color="primary" component="span">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Flipped>
  );
};

export default React.memo(Task);

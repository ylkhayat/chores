import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CssTextField from "../CssTextField";
import { Flipped, spring } from "react-flip-toolkit";

const onElementAppear = (el, index) =>
  spring({
    onUpdate: (val) => {
      el.style.opacity = val;
    },
    delay: index * 50,
  });

const onExit = (type) => (el, index, removeElement) => {
  spring({
    config: { overshootClamping: true },
    onUpdate: (val) => {
      el.style.transform = `scale${type === "grid" ? "X" : "Y"}(${1 - val})`;
    },
    delay: index * 50,
    onComplete: removeElement,
  });

  return () => {
    el.style.opacity = "";
    removeElement();
  };
};

const onGridExit = onExit("grid");
const onListExit = onExit("list");

const Task = ({ flipId, id, content, completed, ...props }) => {
  const [focused, setIsFocused] = useState(false);
  const [isEdit, setIsEditing] = useState(false);
  const [stateCompleted, setStateCompleted] = useState(completed);
  const [stateContent, setStateContent] = useState(content);
  const onEdit = () => setIsEditing((prevIsEditing) => !prevIsEditing);
  const onToggleComplete = () => {
    props.onUpdateChore(id, {
      content: stateContent,
      completed: !stateCompleted,
    });
    setStateCompleted((prevIsCompleted) => !prevIsCompleted);
  };

  const shouldFlip = (prev, current) => {
    if (prev.type !== current.type) {
      return true;
    }
    return false;
  };
  const onSave = () => {
    props.onUpdateChore(id, {
      content: stateContent,
      completed: stateCompleted,
    });
    onEdit();
  };

  return (
    <Flipped
      flipId={flipId}
      onAppear={onElementAppear}
      onExit={onListExit}
      key={flipId}
    >
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
          <Box className="task-sub-container" paddingLeft="14px">
            <CssTextField
              color="primary"
              variant="standard"
              autoFocus
              onChange={(event) => setStateContent(event.target.value)}
              value={stateContent}
              inputProps={{ style: { fontFamily: "nunito", color: "white" } }}
            />
            <Box>
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
            <Typography color="white">{stateContent}</Typography>
            <Box>
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

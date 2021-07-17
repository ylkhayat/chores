import React, { useState } from "react";
import { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CssTextField from "../CssTextField";
import { TransitionGroup } from "react-transition-group";

const Task = ({ id, content, completed, ...props }, ref) => {
  const [focused, setIsFocused] = useState(false);
  const [isEdit, setIsEditing] = useState(false);
  const onEdit = () => setIsEditing((prevIsEditing) => !prevIsEditing);
  const onToggleComplete = () => props.onToggleComplete(id);
  return (
    <TransitionGroup
      transitionName="dialog"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}
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
              value={content}
              inputProps={{ style: { fontFamily: "nunito", color: "white" } }}
            />
            <Box>
              {focused && (
                <IconButton color="primary" component="span" onClick={onEdit}>
                  <CancelIcon />
                </IconButton>
              )}
              <IconButton color="primary" component="span">
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
            checked={completed}
            onChange={onToggleComplete}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
          <Box className="task-sub-container">
            <Typography color="white">{content}</Typography>
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
    </TransitionGroup>
  );
};

export default forwardRef(Task);

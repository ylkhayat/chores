import {
  DialogContentText,
  DialogContent,
  Button,
  DialogActions,
  Dialog,
} from "@material-ui/core";
import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
} from "react";

const CustomDialog = (_, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onOk, setOnOk] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});

  const handleOpen = useCallback(
    ({ message, onOk: propsOnOk, onCancel: propsOnCancel }) => {
      setOpen(true);
      setMessage(message);
      setOnOk(() => propsOnOk);
      setOnCancel(() => propsOnCancel);
    },
    []
  );
  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
    }),
    [handleOpen]
  );

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };
  const handleOk = () => {
    setOpen(false);
    onOk?.();
  };
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default forwardRef(CustomDialog);

import { useMutation } from "@apollo/client";
import { Box, Checkbox, IconButton, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CREATE_CHORE, PUBLISH_CHORE } from "../services";
import CssTextField from "../components/CssTextField";
import Section from "../components/Section";
import SendIcon from "@material-ui/icons/Send";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  dueDate: yup.date().required("Due date is required"),
  completed: yup.boolean(),
});

const NewChore = (props, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Content {...props} setOpen={setOpen} />
    </Modal>
  );
};

const Content = forwardRef(
  ({
    fetchMore,
    sortConfig,
    sortConfigIndex,
    perPage,
    setCurrentPage,
    setOpen,
  }) => {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

    const [createChore] = useMutation(CREATE_CHORE);
    const [publishChore] = useMutation(PUBLISH_CHORE);

    const onSubmit = (data) => {
      createChore({
        variables: { data: data },
      }).then((res) => {
        publishChore({ variables: { id: res.data.createChore.id } }).then(
          () => {
            fetchMore({
              variables: {
                orderBy: sortConfig[sortConfigIndex].orderBy,
              },
            }).then(({ data }) => {
              setCurrentPage(
                Math.ceil(data.choresConnection.aggregate.count / perPage)
              );
              setOpen(false);
            });
          }
        );
      });
    };

    return (
      <Section
        containerClassName="modal-content-container"
        className="new-chore-container"
      >
        <Typography color="white" variant="h5">
          New Chore
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box margin="10px">
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CssTextField
                  color="primary"
                  variant="outlined"
                  label="Title"
                  inputProps={{
                    style: { color: "white" },
                  }}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <Typography color="error">{errors.title.message}</Typography>
            )}
          </Box>
          <Box margin="10px">
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CssTextField
                  color="primary"
                  variant="outlined"
                  label="Description"
                  inputProps={{
                    style: { color: "white" },
                  }}
                  {...field}
                />
              )}
            />
            {errors.description && (
              <Typography color="error">
                {errors.description.message}
              </Typography>
            )}
          </Box>
          <Box margin="10px">
            <Controller
              name="dueDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CssTextField
                  color="primary"
                  type="date"
                  variant="outlined"
                  label="Due Date"
                  inputProps={{
                    style: { color: "white" },
                  }}
                  {...field}
                />
              )}
            />
            {errors.dueDate && (
              <Typography color="error">{errors.dueDate.message}</Typography>
            )}
          </Box>
          <Box
            margin="10px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography color="white">Completed</Typography>
            <Controller
              name="completed"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  color="secondary"
                  inputProps={{ "aria-label": "primary checkbox" }}
                  {...field}
                />
              )}
            />
            {errors.completed && (
              <Typography color="error">{errors.completed.message}</Typography>
            )}
          </Box>
          <Box display="flex" alignSelf="flex-end" width="100%" marginY="10px">
            <IconButton color="primary" onClick={handleSubmit(onSubmit)}>
              <SendIcon />
            </IconButton>
          </Box>
        </form>
      </Section>
    );
  }
);

export default forwardRef(NewChore);

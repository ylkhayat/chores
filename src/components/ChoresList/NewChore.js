import { useMutation } from "@apollo/client";
import { Box, Checkbox, IconButton, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import React, { forwardRef, useImperativeHandle } from "react";
import { CREATE_CHORE, PUBLISH_CHORE } from "../../services";
import CssTextField from "../CssTextField";
import Section from "../Section";
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

const NewChore = (
  { fetchMore, sortConfig, sortConfigIndex, perPage, setCurrentPage },
  ref
) => {
  const [open, setOpen] = useState(false);

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    // createChore({
    //   variables: { data: stateChore },
    // }).then((res) => {
    //   resetStateChore();
    //   publishChore({ variables: { id: res.data.createChore.id } }).then(() => {
    //     fetchMore({
    //       variables: {
    //         orderBy: sortConfig[sortConfigIndex].orderBy,
    //       },
    //     }).then(({ data }) => {
    //       setCurrentPage(
    //         Math.ceil(data.choresConnection.aggregate.count / perPage)
    //       );
    //       setOpen(false);
    //     });
    //   });
    // });
    console.log(data);
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));
  const [createChore] = useMutation(CREATE_CHORE);
  const [publishChore] = useMutation(PUBLISH_CHORE);

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
      <Box className="modal-content-container">
        <Section title="New Chore">
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
            </Box>
            <Box margin="10px">
              <Controller
                name="description"
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
                    checked={field.value === "true"}
                    color="secondary"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box
              margin="10px"
              alignItems="flex-end"
              display="flex"
              width="100%"
            >
              <IconButton
                color="primary"
                component="span"
                type="submit"
                onClick={() => {
                  handleSubmit(onSubmit);
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </form>
        </Section>
      </Box>
    </Modal>
  );
};

export default forwardRef(NewChore);

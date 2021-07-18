import Box from "@material-ui/core/Box";
import FlipMove from "react-flip-move";
import Task from "./Task";
import Section from "../Section";
import { IconButton, Typography } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CssTextField from "../CssTextField";
import { useMemo, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CREATE_CHORE,
  FETCH_CHORES,
  PUBLISH_CHORE,
  UPDATE_CHORE,
} from "../../services";

const filterConfig = [
  { name: "All", operator: (chore) => !!chore },
  { name: "Completed", operator: (chore) => chore.completed },
];

const sortConfig = [
  { name: "Content", orderBy: "content_ASC" },
  { name: "Completed", orderBy: "completed_DESC" },
  { name: "Date Modified", orderBy: "createdAt_ASC" },
];

const ChoresList = () => {
  const [sortConfigIndex, setSortConfigIndex] = useState(2);
  const [filterConfigIndex, setFilterConfigIndex] = useState(0);
  const [newChoreContent, setNewChoreContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const { data: apolloData, fetchMore } =
    useQuery(FETCH_CHORES, {
      variables: {
        offset: (currentPage - 1) * perPage,
        limit: parseInt(perPage) || 1,
        orderBy: sortConfig[sortConfigIndex].orderBy,
      },
    }) || {};
  const [updateChore] = useMutation(UPDATE_CHORE);
  const [publishChore] = useMutation(PUBLISH_CHORE);
  const [createChore] = useMutation(CREATE_CHORE);

  const { numPages } = useMemo(() => {
    if (apolloData?.choresConnection) {
      const {
        aggregate: { count },
      } = apolloData?.choresConnection;
      const numPages = Math.ceil(count / perPage);
      return { numPages };
    } else {
      return { numPages: 0 };
    }
  }, [apolloData?.choresConnection, perPage]);

  const onAddTodo = () => {
    createChore({
      variables: { content: newChoreContent, completed: false },
    }).then((res) => {
      setNewChoreContent("");
      publishChore({ variables: { id: res.data.createChore.id } }).then(() => {
        fetchMore({
          variables: {
            orderBy: sortConfig[sortConfigIndex].orderBy,
          },
        }).then(({ data }) => {
          setCurrentPage(
            Math.ceil(data.choresConnection.aggregate.count / perPage)
          );
        });
      });
    });
  };
  const onUpdateChore = (currentId, chore) => {
    updateChore({
      variables: {
        id: currentId,
        completed: chore.completed,
        content: chore.content,
      },
    });
  };

  const onPaginationChange = (_, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMore?.({
      variables: {
        offset: 0,
        limit: parseInt(perPage) || 1,
        orderBy: sortConfig[sortConfigIndex].orderBy,
      },
    });
  }, [sortConfigIndex, filterConfigIndex, perPage, fetchMore]);

  useEffect(() => {
    fetchMore?.({
      variables: {
        offset: (currentPage - 1) * perPage,
        limit: parseInt(perPage) || 1,
        orderBy: sortConfig[sortConfigIndex].orderBy,
      },
    });
  }, [currentPage, fetchMore, perPage, sortConfigIndex]);

  const renderChoresRightComponent = () => (
    <Box display="flex" alignItems="flex-end">
      <CssTextField
        color="primary"
        label="New Chore?"
        variant="standard"
        value={newChoreContent}
        onChange={(event) => setNewChoreContent(event.target.value)}
      />
      <IconButton color="primary" component="span" onClick={onAddTodo}>
        <SendIcon />
      </IconButton>
    </Box>
  );

  const { filteredData } = useMemo(() => {
    if (!apolloData?.chores) return { filteredData: [], paginatedData: [] };
    const filteredData = apolloData?.chores.filter(
      filterConfig[filterConfigIndex].operator
    );
    return { filteredData };
  }, [apolloData, filterConfigIndex]);

  return (
    <Box className="container">
      <Box>
        <Section title="Filter" className="filter-container">
          {filterConfig.map((config, index) => (
            <Typography
              key={config.name}
              className={`filter-text ${
                index === filterConfigIndex ? "selected-criteria" : ""
              }`}
              onClick={() => setFilterConfigIndex(index)}
            >
              {config.name}
            </Typography>
          ))}
        </Section>

        <Section title="Sort" className="filter-container">
          {sortConfig.map((config, index) => (
            <Typography
              key={config.name}
              className={`filter-text ${
                index === sortConfigIndex ? "selected-criteria" : ""
              }`}
              onClick={() => setSortConfigIndex(index)}
            >
              {config.name}
            </Typography>
          ))}
        </Section>
        <Section title="Per Page" className="filter-container">
          <CssTextField
            color="primary"
            variant="outlined"
            value={perPage}
            onChange={(event) => {
              setPerPage(event.target.value);
            }}
            inputProps={{ style: { fontFamily: "nunito", color: "white" } }}
          />
        </Section>
      </Box>
      <Section
        title="Chores"
        className="chores-container"
        renderRightComponent={renderChoresRightComponent}
      >
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          justifyContent="space-between"
        >
          <FlipMove
            className="flip-move-container"
            key={apolloData?.chores?.map(({ id }) => id).join("")}
          >
            {filteredData?.map((chore) => {
              return (
                <Task
                  key={chore.id}
                  flipId={chore.id}
                  {...chore}
                  onUpdateChore={onUpdateChore}
                />
              );
            })}
          </FlipMove>
          <Box alignSelf="center">
            <Pagination
              page={currentPage}
              count={numPages}
              shape="rounded"
              color="secondary"
              onChange={onPaginationChange}
            />
          </Box>
        </Box>
      </Section>
    </Box>
  );
};

export default ChoresList;

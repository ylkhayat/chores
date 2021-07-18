import Box from "@material-ui/core/Box";
import FlipMove from "react-flip-move";
import Task from "./Task";
import Section from "../Section";
import { IconButton, Typography } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CssTextField from "../CssTextField";
import { useMemo, useState } from "react";
import pick from "lodash/pick";
import { Flipper, Flipped } from "react-flip-toolkit";
import Pagination from "@material-ui/core/Pagination";
import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FETCH_CHORES, UPDATE_CHORE } from "../../services";

const filterConfig = [
  { name: "All", operator: (chore) => !!chore },
  { name: "Completed", operator: (chore) => chore.completed },
];

const sortConfig = [
  { name: "Content", orderBy: "content_ASC" },
  { name: "Completed", orderBy: "completed_ASC" },
  { name: "Date Modified", orderBy: "createdAt_ASC" },
];

const data = [
  { id: 1, content: "Bananas", completed: true },
  { id: 2, content: "Burritos", completed: false },
  { id: 3, content: "Cameron", completed: true },
  { id: 4, content: "Heya", completed: false },
];
const ChoresList = () => {
  const [sortConfigIndex, setSortConfigIndex] = useState(0);
  const [filterConfigIndex, setFilterConfigIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(2);

  const { data: apolloData } = useQuery(FETCH_CHORES, {
    variables: {
      offset: (currentPage - 1) * perPage,
      limit: parseInt(perPage) || 1,
      orderBy: sortConfig[sortConfigIndex].orderBy,
    },
  });
  const [updateChore, { data }] = useMutation(UPDATE_CHORE);
  const onAddTodo = (content) => {};
  const onUpdateChore = (currentId, chore) => {
    updateChore({
      variables: {
        id: currentId,
        completed: chore.completed,
        content: chore.content,
      },
    });
  };

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

  const onPaginationChange = (_, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [sortConfigIndex, filterConfigIndex, perPage]);

  useEffect(() => {}, [perPage]);

  const renderChoresRightComponent = () => (
    <Box display="flex" alignItems="flex-end">
      <CssTextField color="primary" label="New Chore?" variant="standard" />
      <IconButton color="primary" component="span">
        <SendIcon />
      </IconButton>
    </Box>
  );

  const { paginatedData } = useMemo(() => {
    if (!apolloData?.chores) return { filteredData: [], paginatedData: [] };
    const filteredData = apolloData?.chores.filter(
      filterConfig[filterConfigIndex].operator
    );

    const paginatedData = filteredData.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );
    return { filteredData, paginatedData };
  }, [apolloData, filterConfigIndex, currentPage, perPage]);

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
          <Flipper
            flipKey={apolloData?.chores?.map(({ id }) => id).join("")}
            spring="noWobble"
            staggerConfig={{
              default: {
                reverse: false,
                speed: 1,
              },
            }}
            className="flip-move-container"
          >
            {/* <FlipMove className="flip-move-container" key={evaledData.join("")}> */}
            {paginatedData?.map((chore) => {
              return (
                <Task
                  flipId={chore.id}
                  {...chore}
                  onUpdateChore={onUpdateChore}
                />
              );
            })}
          </Flipper>
          {/* </FlipMove> */}
          <Box alignSelf="center">
            <Pagination
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

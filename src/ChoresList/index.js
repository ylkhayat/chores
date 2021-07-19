import Box from "@material-ui/core/Box";
import Task from "./Task";
import Section from "../components/Section";
import { IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CssTextField from "../components/CssTextField";
import { useMemo, useRef, useState } from "react";
import Pagination from "@material-ui/core/Pagination";
import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { DELETE_CHORE, FETCH_CHORES, UPDATE_CHORE } from "../services";
import { CircularProgress } from "@material-ui/core";
import ChoreControl from "./ChoreControl";
import omit from "lodash/omit";

const filterConfig = [
  { name: "All", where: {} },
  { name: "Completed", where: { completed: true } },
  { name: "Not Completed", where: { completed: false } },
];

const sortConfig = [
  { name: "Content", orderBy: "content_ASC" },
  { name: "Completed", orderBy: "completed_DESC" },
  { name: "Date Modified", orderBy: "createdAt_ASC" },
];

const ChoresList = () => {
  const [sortConfigIndex, setSortConfigIndex] = useState(2);
  const [filterConfigIndex, setFilterConfigIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [currentChore, setCurrentChore] = useState(null);

  const newChoreModalRef = useRef(null);

  const {
    loading,
    data: apolloData,
    fetchMore,
  } = useQuery(FETCH_CHORES, {
    variables: {
      offset: (currentPage - 1) * perPage,
      limit: parseInt(perPage) || 1,
      orderBy: sortConfig[sortConfigIndex].orderBy,
      where: filterConfig[filterConfigIndex].where,
    },
  }) || {};
  const [deleteChore] = useMutation(DELETE_CHORE);
  const [updateChore] = useMutation(UPDATE_CHORE);

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

  const onUpdateChore = (currentId, chore) =>
    updateChore({
      variables: {
        id: currentId,
        data: omit(chore, ["id", "createdAt", "updatedAt", "__typename"]),
      },
    });

  const onChoreClick = (chore) => {
    setCurrentChore(chore);
    newChoreModalRef.current.open();
  };
  const onDeleteChore = (currentId) => {
    deleteChore({
      variables: {
        id: currentId,
      },
    });
  };
  const onPaginationChange = (_, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMore?.({
      variables: {
        offset: 0,
        limit: parseInt(perPage) || 1,
        orderBy: sortConfig[sortConfigIndex].orderBy,
      },
    }).then(() => {
      setCurrentPage(1);
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
      <IconButton
        color="primary"
        component="span"
        onClick={() => {
          setCurrentChore(null);
          newChoreModalRef.current.open();
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );

  const { filteredData } = useMemo(() => {
    if (!apolloData?.chores) return { filteredData: [], paginatedData: [] };

    return { filteredData: apolloData?.chores };
  }, [apolloData]);

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
          <Box className="flip-move-container">
            {filteredData?.map((chore) => {
              return (
                <Task
                  key={chore.id}
                  flipId={chore.id}
                  chore={chore}
                  onUpdateChore={onUpdateChore}
                  onChoreClick={onChoreClick}
                  onDeleteChore={onDeleteChore}
                />
              );
            })}
          </Box>
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
        {loading && (
          <Box position="relative" bottom={0}>
            <CircularProgress color="secondary" />
          </Box>
        )}
      </Section>
      <ChoreControl
        chore={currentChore}
        ref={newChoreModalRef}
        fetchMore={fetchMore}
        sortConfig={sortConfig}
        sortConfigIndex={sortConfigIndex}
        perPage={perPage}
        setCurrentPage={setCurrentPage}
        onUpdateChore={onUpdateChore}
      />
    </Box>
  );
};

export default ChoresList;

import Box from "@material-ui/core/Box";
import FlipMove from "react-flip-move";
import Task from "./Task";
import Section from "../Section";
import { IconButton, Typography } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CssTextField from "../CssTextField";
import { useMemo, useState } from "react";
import orderBy from "lodash/orderBy";
import { Flipper, Flipped } from "react-flip-toolkit";

const filterConfig = [
  { name: "All", operator: (chore) => !!chore },
  { name: "Completed", operator: (chore) => chore.completed },
];

const sortConfig = [
  { name: "Content", field: "content" },
  { name: "Completed", field: "completed" },
  { name: "Date Modified", field: "created_at" },
];

const ChoresList = ({ data, onToggleComplete }) => {
  const [sortConfigIndex, setSortConfigIndex] = useState(0);
  const [filterConfigIndex, setFilterConfigIndex] = useState(0);

  const renderChoresRightComponent = () => (
    <Box display="flex" alignItems="flex-end">
      <CssTextField color="primary" label="New Chore?" variant="standard" />
      <IconButton color="primary" component="span">
        <SendIcon />
      </IconButton>
    </Box>
  );

  const evaledData = useMemo(() => {
    const filteredData = data.filter(filterConfig[filterConfigIndex].operator);
    const sortedData = orderBy(
      filteredData,
      [sortConfig[sortConfigIndex].field],
      ["desc"]
    );
    return sortedData;
  }, [data, sortConfigIndex, filterConfigIndex]);
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
      </Box>
      <Section
        title="Chores"
        className="chores-container"
        renderRightComponent={renderChoresRightComponent}
      >
        <Flipper
          flipKey={JSON.stringify(evaledData)}
          spring="noWobble"
          staggerConfig={{
            default: {
              reverse: true,
              speed: 1,
            },
          }}
          decisionData={evaledData}
          className="flip-move-container"
        >
          {/* <FlipMove className="flip-move-container" key={evaledData.join("")}> */}
          {evaledData?.map((chore) => {
            console.log(chore);
            return (
              <Flipped flipId={chore.id}>
                <Task
                  key={`${chore.id}`}
                  {...chore}
                  onToggleComplete={onToggleComplete}
                />
              </Flipped>
            );
          })}
        </Flipper>
        {/* </FlipMove> */}
      </Section>
    </Box>
  );
};

export default ChoresList;

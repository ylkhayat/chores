import React from "react";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";

const Section = ({ title, children, className, renderRightComponent }) => {
  return (
    <Box className="section-container">
      <Box display="flex" justifyContent="space-between" width="100%">
        {!!title && (
          <Typography variant="h6" color="white">
            {title}
          </Typography>
        )}
        {renderRightComponent?.()}
      </Box>
      <Box boxShadow={3} className={`common-container ${className}`}>
        {children}
      </Box>
    </Box>
  );
};

export default Section;

import PropTypes from "prop-types";
import React from "react";
import EventDetails from "../EventDetails";

export default function AdminEventDetails(props) {
  console.log(props);
  return (
    <React.Fragment>
      <EventDetails
        {...props}
        extraButtons={[
          {
            color: "secondary",
            onClick: () => {},
            title: () => "admin 1"
          },
          {
            color: "secondary",
            onClick: () => {},
            title: () => "admin 2"
          }
        ]}
      />
    </React.Fragment>
  );
}

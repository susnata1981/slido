import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button, Grid, TextField, FormControl } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import Header from "../Header";

export default function CreateEvent() {
  const { register, errors, handleSubmit } = useForm();

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [passcode, setPasscode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [showStartDateError, setShowStartDateError] = useState(false);

  const history = useHistory();

  const passcodeHandler = e => {
    setPasscode(e.target.value);
  };

  const eventNameHandler = e => {
    setEventName(e.target.value);
  };

  const eventDescriptionHandler = e => {
    setEventDescription(e.target.value);
  };

  const startDateHandler = e => {
    setShowStartDateError(false);
    let nd = new Date(event.target.value);
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    if (nd < now) {
      setShowStartDateError(true);
      return false;
    }
    setStartDate(e.target.value);
  };

  const handleCreateEvent = e => {
    e.preventDefault();

    const data = JSON.stringify({
      event: {
        name: eventName,
        passcode: passcode,
        start: startDate
      }
    });
    const formData = new FormData();
    formData.append("event[name]", eventName);
    formData.append("event[description]", eventDescription);
    formData.append("event[passcode]", passcode);
    formData.append("event[start]", startDate);
    fetch("/v1/events", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        setShowStatus(true);
        setTimeout(() => {
          history.push("/administrator");
        }, 2000);
      });
  };

  let curr = new Date();
  curr.setDate(curr.getDate() + 3);

  return (
    <React.Fragment>
      <Header />
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={4}>
          {showStatus && (
            <Alert variant="filled" color="success">
              Event created
            </Alert>
          )}

          <h3>Create Event</h3>
          <form onSubmit={handleCreateEvent}>
            <TextField
              fullWidth
              required
              label="Event Name"
              name="eventName"
              onChange={eventNameHandler}
            />
            <br />
            <TextField
              fullWidth
              required
              label="Event Description"
              name="eventDescription"
              onChange={eventDescriptionHandler}
            />
            <br />
            <TextField
              fullWidth
              required
              label="Password"
              type="password"
              name="passcode"
              onChange={passcodeHandler}
            />
            <br />
            <br />
            <TextField
              fullWidth
              required
              label="Start Date"
              type="date"
              name="startDate"
              onChange={startDateHandler}
              InputLabelProps={{
                shrink: true
              }}
            />
            {showStartDateError && <p>Start date must be in future</p>}
            <br />
            <br />
            <br />
            <Button fullWidth type="submit" variant="contained" color="primary">
              Create
            </Button>
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

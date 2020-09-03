import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { Button, Grid, TextField, FormControl } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default function Join() {
  const { register, errors, handleSubmit } = useForm();
  const history = useHistory();

  const [eventName, setEventName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  // fetch(
  //   '/v1/guest/isUserLoggedIn',
  //   {
  //     method: 'GET',
  //   }).then(response => response.json())
  //   .then(({guest, event}) => {
  //     if (guest.id && event.id) {
  //       history.push("/event/"+event.id)
  //     }
  //   });

  const handleJoinEvent = e => {
    e.preventDefault();
    setShowStatus(false);

    const formData = new FormData();
    formData.append("join[eventName]", eventName);
    formData.append("join[passcode]", passcode);
    formData.append("join[firstname]", firstname);
    formData.append("join[lastname]", lastname);

    fetch("/v1/events/join", {
      method: "POST",
      body: formData
    })
      .then(response => {
        if (response.status == 401) {
          setShowStatus(true);
        } else {
          return response.json();
        }
      })
      .then(response => {
        console.log(response);

        if (response.data.id) {
          history.push("/event/" + response.data.id);
        }
      });
  };

  const firstnameHandler = e => {
    setFirstname(e.target.value);
  };

  const lastnameHandler = e => {
    setLastname(e.target.value);
  };

  const eventNameHandler = e => {
    setEventName(e.target.value);
  };

  const passcodeHandler = e => {
    setPasscode(e.target.value);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={4}>
          {showStatus && (
            <Alert severity="error">
              Invalid credentials
            </Alert>
          )}
          <div>
            <h3>Join Event</h3>

            <form onSubmit={handleJoinEvent} method="POST">
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
                label="First Name"
                name="firstname"
                onChange={firstnameHandler}
              />
              <br />

              <TextField
                fullWidth
                required
                label="Last Name"
                name="lastname"
                onChange={lastnameHandler}
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
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
              >
                Join
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

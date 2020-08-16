import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

import Header from "../Header";

import CreateEvent from "./CreateEvent";
import EventList from "./EventList";

import {
  Grid,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
} from "@material-ui/core";

export default function Home() {
  const { register, errors, handleSubmit } = useForm();

  const [eventName, setEventName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(2);
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    fetch("/logged_in")
      .then(response => {
        if (response.status == 401) {
          window.location.href = "/admin";
        } else {
          return response.json();
        }
      })
      .then(response => {
        setUser(response.user);
      });
  }, []);

  const loadEvents = () => {
    fetch("/v1/events")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setEvents(data);
        setCurrentEvents(data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
    updateCurrentEvents(newValue);
  };

  const updateCurrentEvents = index => {
    const today = new Date();

    if (index == 0) {
      setCurrentEvents(
        events.filter(e => {
          if (e.start == undefined) {
            return false;
          }
          return Date.parse(e.start) >= today;
        })
      );
    } else if (index == 1) {
      setCurrentEvents(
        events.filter(e => {
          if (e.start == undefined) {
            return false;
          }
          return Date.parse(e.start) < today;
        })
      );
    } else {
      setCurrentEvents(events);
    }
  };

  const updateEvent = (event, callback) => {
    const formData = new FormData();
    formData.append("event[name]", event.name);
    formData.append("event[description]", event.description);
    formData.append("event[passcode]", event.passcode);
    formData.append("event[start]", event.start);

    fetch(`/v1/events/${event.id}`, {
      method: "PATCH",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        loadEvents();
        callback();
      });
  };

  const deleteEvent = event => {
    fetch(`/v1/events/${event.id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(data => {
        loadEvents();
      });
  };

  if (isLoading) {
    return (
      <Grid container style={{ height: "100vh" }}>
        <Grid item>
          <React.Fragment>
            <h2>Loading events...</h2>
          </React.Fragment>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <React.Fragment>
        <Header />
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs={8}>
            <Tabs
              value={tabIndex}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              onChange={handleTabChange}
            >
              <Tab label="Upcoming Events" />
              <Tab label="Past Events" />
              <Tab label="All Events" />
            </Tabs>
            <h2>All Events</h2>
            <EventList
              events={currentEvents}
              updateEvent={updateEvent}
              setCurrentEvents={setCurrentEvents}
              loadEvents={loadEvents}
              deleteEvent={deleteEvent}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}


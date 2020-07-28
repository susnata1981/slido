import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

export default function Admin() {
  const { register, errors, handleSubmit } = useForm();

  const [eventName, setEventName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetch("/logged_in")
      .then(response => {
        if (response.status == 401) {
          console.log("user not logged in");
          window.location.href = "/admin";
        } else {
          return response.json();
        }
      })
      .then(response => {
        console.log(response);
          setIsLoading(true);
          setUser(response.user);
      });
  }, []);

  useEffect(() => {
    fetch("/v1/events")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setEvents(data);
        setIsLoading(false);
      });
  }, []);

  const onSubmit = data => {
    handleCreateEvent(data);
  };

  const handleCreateEvent = d => {
    const data = JSON.stringify({
      event: {
        name: d.eventName,
        passcode: d.passcode,
        start: d.startDate
      }
    });
    const formData = new FormData();
    formData.append("event[name]", d.eventName);
    formData.append("event[passcode]", d.passcode);
    formData.append("event[start]", d.startDate);
    fetch("/v1/events", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => console.log(data));
  };

  if (isLoading) {
    return (
      <React.Fragment>
        <h2>Loading events...</h2>
      </React.Fragment>
    );
  } else {
    console.log(events);
    let curr = new Date();
    curr.setDate(curr.getDate() + 3);

    return (
      <React.Fragment>
        <h2>Events</h2>
        {events.map(e => {
          return (
            <h3 key={e.id}>
              <Link key={e.id} to={`/administrator/event/${e.id}`}>
                {e.name}
              </Link>
            </h3>
          );
        })}

        <h3>Create Event</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            name="eventName"
            placeholder="Event name..."
            ref={register({
              required: "this is a required field"
            })}
          />
          <br />
          {errors.eventName && errors.eventName.message}
          <br />
          <label htmlFor="passcode"></label>
          Passcode:
          <input
            type="text"
            name="passcode"
            placeholder="Passcode..."
            ref={register({
              required: "this is a required field",
              minLength: {
                value: 5,
                message: "Minimum 5 characters"
              }
            })}
          />
          <br />
          {errors.passcode && errors.passcode.message}
          <br />
          <label>
            Start date:
            <input
              type="date"
              name="startDate"
              ref={register({
                required: "this is a required field"
              })}
            />
          </label>
          <br />
          {errors.startDate && errors.startDate.message}
          <br />
          <input type="submit" value="Create" />
        </form>
      </React.Fragment>
    );
  }
}

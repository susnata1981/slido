import React from "react"
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import PropTypes from "prop-types"
import { useForm } from 'react-hook-form'

export default function Join() {
  const { register, errors, handleSubmit } = useForm();
  const history = useHistory();

  const [eventName, setEventName] = useState('')
  const [passcode, setPasscode] = useState('')
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

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
  
  const onSubmit = (d) => {
    const formData = new FormData();
    formData.append('join[eventName]', d.eventName)
    formData.append('join[passcode]', d.passcode)
    formData.append('join[firstname]', d.firstname)
    formData.append('join[lastname]', d.lastname)

    fetch(
      '/v1/events/join',
      {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
      .then(({data}) => {
        console.log(data);
        if (data.id) {
          history.push("/event/"+data.id)
        } 
      });
  }

  return (
    <React.Fragment>
      <div>
        <h3>Join Event</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Event Name</label><br />
          <input
            type="text"
            name="eventName"
            placeholder="Event name..."
            ref={register({ required: 'this is a required field' })}
          />
          <br />
          {errors.eventName && errors.eventName.message}
          <br />

          <label>Firstname</label><br />
          <input
            type="text"
            name="firstname"
            placeholder="Full name..."
            ref={register({ required: 'this is a required field' })}
          />
          <br />
          {errors.firstname && errors.firstname.message}
          <br />

          <label>Lastname</label><br />
          <input
            type="text"
            name="lastname"
            placeholder="Full name..."
            ref={register({ required: 'this is a required field' })}
          />
          <br />
          {errors.lastname && errors.lastname.message}
          <br />

          <label>Passcode</label><br />
          <input
            type="text"
            name="passcode"
            placeholder="Passcode..."
            ref={register({ required: 'this is a required field' })}
          />
          <br />
          {errors.passcode && errors.passcode.message}
          <br />

          <input type="submit" value="Join" />

        </form>
      </div>
    </React.Fragment>
  )
}

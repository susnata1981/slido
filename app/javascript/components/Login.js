import React from "react"
import { useEffect, useState } from 'react';

import PropTypes from "prop-types"
import { useForm } from 'react-hook-form'

export default function Login() {
  const { register, errors, handleSubmit } = useForm();

  <div>
    <form>
      <label>Event Name</label>
      <input
        type="text"
        name="eventName"
        placeholder="Event name..."
        ref={register({ required: 'this is a required field' })}
      />
      {errors.question && errors.question.message}

      <input type="submit" value="Post" />

    </form>
  </div>
}

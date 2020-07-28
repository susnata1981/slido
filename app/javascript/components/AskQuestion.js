import React, { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { Button, TextField, Grid } from '@material-ui/core';

export default function AskQuestion(props) {
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('question[content]', data.content)

    fetch(
      `/v1/events/${props.id}/questions`,
      {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.data.id) {
          props.refreshQuestions(true)
        }
      })
  }
  
  return (
    <React.Fragment>
      <Grid container spacing={2} className="margin-left-24">
        <Grid item xs={6}>
          <h3>Question View</h3>

          {/*<form onClick={handleSubmit(onSubmit)}>
            <TextField
              id="standard-basic"
              name="content"
              label="Question..."
              ref={register({ required: 'this is a required field' })}
              variant="filled"
              style={{width:'100ch'}}
            /><br />
            {errors.content && errors.content.message}

          <input type="submit" />
          </form>*/}

          <form onClick={handleSubmit(onSubmit)}>
            <input name="content" ref={register({ required: true })} />
            <input type="submit"/>
            {errors.content && errors.content.message}
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

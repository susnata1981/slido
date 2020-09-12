import React, { useEffect, useState } from "react";
import { Button, TextField, Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CustomAlert from "../core/CustomAlert";

export default function AskQuestion({ event, refreshQuestions }) {
  const [question, setQuestion] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("question[content]", question);

    fetch(`/v1/events/${event.id}/questions`, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response.data.id) {
          setAlertMessage("Question added for review");
          setAlertStatus("success");
          setAlertVisible(true);
          setTimeout(() => setAlertVisible(false), 3000);

          setQuestion("");
          refreshQuestions(true);
        }
      });
  };

  const questionHandler = e => {
    setQuestion(e.target.value);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <CustomAlert
            status={alertStatus}
            message={alertMessage}
            isVisible={alertVisible}
          />
          <h3>Ask Question</h3>

          <form onSubmit={onSubmit}>
            <TextField
              fullWidth
              required
              label="Question..."
              name="question"
              value={question}
              onChange={questionHandler}
            />
            <br />
            <br />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

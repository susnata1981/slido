import React, { useEffect, useState, useContext } from "react";
import ButtonList from "./ButtonList";

import {
  Box,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";

export default function Question(props) {
  const { id, guest_id } = props.question;

  const postVote = vote_type => {
    const formData = new FormData();
    formData.append("question_id", id);
    formData.append("guest_id", guest_id);
    formData.append("vote_type", vote_type);

    fetch(`/v1/questions/${id}/vote`, {
      method: "POST",
      body: formData
    })
      .then(resp => resp.json())
      .then(resp => {
        if (!resp.error) {
          props.refreshQuestions();
        }
      });
  };

  const update_status = status => {
    const formData = new FormData();
    formData.append("status", status);
    fetch(`/v1/questions/${id}/update_status`, {
      method: "POST",
      body: formData
    })
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
      });
  };

  const getGuest = id => props.guests.find(g => g.id == id);
  const getGuestName = g => g.firstname + " " + g.lastname;
  const upVoteCount = () => {
    return props.question.votes.filter(v => v.vote_type == "up").length;
  };
  const downVoteCount = () => {
    return props.question.votes.filter(v => v.vote_type == "down").length;
  };

  const upButtonTitle = () => {
    return `Up(${upVoteCount()})`;
  };

  const downButtonTitle = () => {
    return `Down(${downVoteCount()})`;
  };

  const upVote = () => {
    postVote("up");
  };
  const downVote = () => {
    postVote("down");
  };

  let buttons = props.buttons;
  if (props.extraButtons) {
    buttons = props.buttons.concat(props.extraButtons);
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box textAlign="left" fontSize="h6.fontSize">
            {props.question.content} &nbsp;
            {props.question.status}
          </Box>
          <Box textAlign="left" fontStyle="italic" fontSize={14}>
            by {getGuestName(getGuest(props.question.guest_id))}&nbsp;&nbsp;
          </Box>
          <ButtonList question={props.question} buttons={buttons} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

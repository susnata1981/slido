import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import AskQuestion from "./consumer/AskQuestion";
import Question from "./core/Question";

import {
  Box,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";

export default function EventDetails(props) {
  const { id } = props.match.params;
  const [event, setEvent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [guests, setGuests] = useState({});
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    fetch(`/v1/events/${id}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(r => {
        const g = r.included
          .filter(e => e.type == "guest")
          .map(e => {
            return {
              id: e.id,
              firstname: e.attributes.firstname,
              lastname: e.attributes.lastname
            };
          });

        setGuests(g);
        setEvent({
          id: id,
          name: r.data.attributes.name,
          passcode: r.data.attributes.passcode,
          start: new Date(r.data.attributes.start)
        });
        setIsLoadingEvent(false);
      });
  }, []);

  const fetchQuestions = () => {
    fetch(`/v1/events/${id}/questions?filter=4`)
      .then(response => response.json())
      .then(result => {
        let questions = extractQuestion(result);
        sortQuestions(questions);
        setIsLoadingQuestions(false);
        setQuestions(questions);
      });
  };

  const extractQuestion = resp => {
    return resp.data.map(e => {
      const votes = resp.included
        .filter(e2 => e2.type == "vote" && e2.attributes.question_id == e.id)
        .map(e3 => e3.attributes);
      return {
        id: e.id,
        content: e.attributes.content,
        status: e.attributes.status,
        guest_id: e.relationships.guest.data.id,
        votes: votes
      };
    });
  };

  const postVote = (question, vote_type) => {
    const formData = new FormData();
    formData.append("vote_type", vote_type);

    fetch(`/v1/questions/${question.id}/vote`, {
      method: "POST",
      body: formData
    })
      .then(resp => resp.json())
      .then(resp => {
        if (!resp.error) {
          fetchQuestions();
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

  const sortQuestions = (questions) => {
    questions.sort((a, b) => {
      if (upVoteCount(a) > upVoteCount(b)) {
        return -1;
      } else {
        return 1;
      }
    });
  };

  const getGuest = id => guests.find(g => g.id == id);

  const getGuestName = g => g.firstname + " " + g.lastname;

  const upVoteCount = question => {
    return question.votes.filter(v => v.vote_type == "up").length;
  };

  const downVoteCount = question => {
    return question.votes.filter(v => v.vote_type == "down").length;
  };

  const upButtonTitle = question => {
    return `Up(${upVoteCount(question)})`;
  };

  const downButtonTitle = question => {
    return `Down(${downVoteCount(question)})`;
  };

  const upVote = question => {
    postVote(question, "up");
  };

  const downVote = question => {
    postVote(question, "down");
  };


  return (
    <React.Fragment>
      {isLoadingEvent && <h4>Loading Event...</h4>}
      {!isLoadingEvent && !isLoadingQuestions && (
        <Grid container spacing={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={6}>
            <div>
              <h2>{event.name} @ Company</h2>
            </div>
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={6}>
            <AskQuestion event={event} refreshQuestions={fetchQuestions} />
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={6}>
            <QuestionContainer
              id={id}
              questions={questions}
              guests={guests}
              setQuestions={setQuestions}
              refreshQuestions={fetchQuestions}
              buttons={[
                {
                  color: "secondary",
                  onClick: upVote,
                  title: upButtonTitle
                },
                {
                  color: "secondary",
                  onClick: downVote,
                  title: downButtonTitle
                }
              ]}
              extraButtons={props.extraButtons}
            />
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

function QuestionContainer(props) {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {props.questions.map((q, i) => {
            return (
              <Question
                key={i}
                event_id={props.id}
                question={q}
                guests={props.guests}
                refreshQuestions={props.refreshQuestions}
                buttons={props.buttons}
                extraButtons={props.extraButtons}
              />
            );
          })}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

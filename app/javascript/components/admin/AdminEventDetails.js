import React, { useEffect, useState, useContext } from "react";

import { useForm } from "react-hook-form";

import Question from '../core/Question';

import {
  Box,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";

export default class AdminEventDetails extends React.Component {
  constructor(props) {
    super(props);
    const { id } = props.match.params;
    this._isMounted = false;
    this.state = {
      id: id,
      event: {},
      isLoadingQuestions: true,
      isLoadingEvent: true,
      questions: [],
      guests: [],
      forceUpdate: false
    };
  }

  fetchQuestions = () => {
    fetch(`/v1/events/${this.state.id}/questions?filter=4`)
      .then(response => response.json())
      .then(result => {
        let questions = this.extractQuestion(result);
        console.log(questions);
        if (this._isMounted) {
          this.setState({
            isLoadingQuestions: false,
            questions: questions
          });
        }
      });
  };

  extractQuestion = resp => {
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

  componentDidMount() {
    this._isMounted = true;

    if (this.state.forceUpdate || this.state.isLoadingQuestions) {
      this.fetchQuestions();
    }

    this.timer = setInterval(() => this.fetchQuestions(), 5000);

    if (this.state.forceUpdate || this.state.isLoadingQuestions) {
      fetch(`/v1/events/${this.state.id}`, {
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
          if (this._isMounted) {
            this.setState({
              event: {
                name: r.data.attributes.name,
                passcode: r.data.attributes.passcode
              },
              guests: g,
              isLoadingEvent: false
            });
          }
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoadingEvent && <h4>Loading Event Data...</h4>}
        {!this.state.isLoadingEvent && (
          <div>
            <ul>
              <li>
                <h2>Name: {this.state.event.name}</h2>
              </li>
              <li>
                <h2>Passcode: {this.state.event.passcode}</h2>
              </li>
            </ul>

            <QuestionContainer
              id={this.state.id}
              questions={this.state.questions}
              guests={this.state.guests}
              setQuestions={this.state.setQuestions}
              refreshQuestions={this.fetchQuestions}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

function QuestionContainer(props) {
  const { questions } = props;
  const [currentQuestions, setCurrentQuestions] = useState(questions);
  const [currentFilter, setCurrentFilter] = useState("all");

  const upVoteCount = question => {
    return question.votes.filter(v => v.vote_type == "up").length;
  };

  questions.sort((a, b) => {
    if (upVoteCount(a) > upVoteCount(b)) {
      return -1;
    } else {
      return 1;
    }
  });

  const onChange = event => {
    setCurrentFilter(event.target.value);
    if (event.target.value != "all") {
      setCurrentQuestions(questions.filter(q => q.status == event.target.value));
    } else {
      setCurrentQuestions(questions);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ marginLeft: "16px" }}>
          <InputLabel id="question-filter-select">Filter Questions</InputLabel>
          <Select
            labelId="question-filter"
            id="question-filter-select"
            value={currentFilter}
            onChange={onChange}
          >
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
          {currentQuestions.map((q, i) => {
            return (
              <Question
                key={i}
                event_id={props.id}
                question={q}
                guests={props.guests}
                refreshQuestions={props.refreshQuestions}
              />
            );
          })}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

{/*function Question(props) {
  const { id, guest_id } = props.question;
  console.log(props);

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
          <Button color="secondary" onClick={() => update_status("approved")}>
            Approve
          </Button>
          &nbsp;
          <Button color="secondary" onClick={() => update_status("rejected")}>
            Reject
          </Button>
          <Button color="secondary" onClick={() => update_status("completed")}>
            Mark as Complete
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
*/}

import React from "react";
import PropTypes from "prop-types";

import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

import HelloWorld from "./HelloWorld";
import Event from "./Event";
import Join from "./Join";
import Question from "./Question";
import EventDetails from "./EventDetails";
import Guest from "./Guest";
import history from "./History";
import Admin from "./admin/Admin";
import AdminEventDetails from "./admin/AdminEventDetails";

import { Grid, Button } from "@material-ui/core";

class App extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      isLoggedIn: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    fetch("/logged_in")
      .then(response => {
        if (response.status == 401) {
          console.log("user not logged in");
          {
            /*window.location.href = "/admin";*/
          }
        } else {
          return response.json();
        }
      })
      .then(response => {
        console.log(response);
        if (this._isMounted) {
          this.setState({
            isLoggedIn: true,
            user: response.user
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    console.log(this.state);
    return (
      <BrowserRouter history={history}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Home isLoggedIn={this.state.isLoggedIn} />}
          />
          <Route exact path="/join" render={() => <Join />} />
          {/*<Route exact path="/list" render={() => <Event />} />*/}
          <Route path="/event/:id" component={EventDetails} />
          <Route path="/guest/:id" component={Guest} />
          <Route exact path="/question" render={() => <Question />} />
          {/*<Route exact path="/administrator" render={() => (
            this.state.isLoggedIn? (<Admin />) : (<Redirect to="/" />)
          )} />*/}
          <Route
            path="/administrator/event/:id"
            component={AdminEventDetails}
          />
          <Route path="/administrator" component={Admin} />
          <Route
            exact
            path="/hello"
            render={() => <HelloWorld greeting="Adi" />}
          />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          <h1>BA Slido Home</h1>

          <Grid item xs={3} style={{ padding: 16 }}>
            <Button
              size="large"
              color="primary"
              variant="contained"
              href="/join"
            >
              Join Events
            </Button>
          </Grid>
          <Grid item xs={3} style={{ padding: 16 }}>
            <Button
              size="large"
              color="primary"
              variant="contained"
              href="/administrator"
            >
              Administrator
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default App;

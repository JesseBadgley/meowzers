import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Meow from '../components/Meow';

class home extends Component {
  // state = {
  //   meows: []
  // };
  state = {
    meows: null
  };

  componentDidMount() {
    axios
      .get('/meows')
      .then((res) => {
        console.log(res.data);
        this.setState({
          meows: res.data
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    // let recentMeowsMarkup = this.state.meows ? (
    // this.state.meows.map((meow, i) => {
    //   console.log(meow);
    //   return <Meow key={i} meowObj={meow} />;
    let recentMeowsMarkup = this.state.meows ? (
      this.state.meows.map((meow) => <Meow key={meow.meowId} meow={meow} />)
    ) : (
      <p>Loading... </p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={6} xs={8}>
          {recentMeowsMarkup}
        </Grid>
        <Grid item sm={3} m={6}>
          <p> Profile... </p>
        </Grid>
      </Grid>
    );
  }
}

export default home;

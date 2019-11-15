import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Profile from './Profile';
import Meow from './Meow';
import { connect } from 'react-redux';
import { getMeows } from '../redux/actions/dataActions';
import propTypes from 'prop-types';

class Home extends Component {
  // state = {
  //   meows: []
  // };
  // state = {
  //   meows: null
  // };

  componentDidMount() {
    // axios
    //   .get('/meows')
    //   .then((res) => {
    //     console.log(res.data);
    //     this.setState({
    //       meows: res.data
    //     });
    //   })
    //   .catch((err) => console.log(err));
    this.props.getMeows();
  }
  render() {
    const { meows, loading } = this.props.data;
    // let recentMeowsMarkup = this.state.meows ? (
    // this.state.meows.map((meow, i) => {
    //   console.log(meow);
    //   return <Meow key={i} meowObj={meow} />;
    let recentMeowsMarkup = !loading ? (
      meows.map((meow) => <Meow key={meow.meowId} meow={meow} />)
    ) : (
      <p>Loading... </p>
    );
    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {recentMeowsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getMeows: propTypes.func.isRequired,
  data: propTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getMeows })(Home);

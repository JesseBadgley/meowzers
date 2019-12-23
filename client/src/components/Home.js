import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
// import axios from 'axios';
import Profile from './Profile';
import Meow from './meow/Meow';
import { connect } from 'react-redux';
import { getMeows } from '../redux/actions/dataActions';
import propTypes from 'prop-types';
import MeowSkeleton from '../util/MeowSkeleton';

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
      <MeowSkeleton />
    );
    return (
      <Grid container spacing={4}>
        <Grid item lg={8} md={8} sm={10} xs={12}>
          {recentMeowsMarkup}
        </Grid>
        <Grid item lg={4} m={2} sm={6} xs={12}>
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

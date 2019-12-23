import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Meow from './meow/Meow';
import StaticProfile from '../components/StaticProfile';
import Grid from '@material-ui/core/Grid';

import MeowSkeleton from '../util/MeowSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: null,
    meowIdParam: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const meowId = this.props.match.params.meowId;

    if (meowId) this.setState({ meowIdParam: meowId });

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        console.log(res);
        this.setState({
          profile: res.data.user
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { meows, loading } = this.props.data;
    const { meowIdParam } = this.state;

    const meowsMarkup = loading ? (
      <MeowSkeleton />
    ) : meows === null ? (
      <p>No meows from this user</p>
    ) : !meowIdParam ? (
      meows.map((meow) => <Meow key={meow.meowId} meow={meow} />)
    ) : (
      meows.map((meow) => {
        if (meow.meowId !== meowIdParam)
          return <Meow key={meow.meowId} meow={meow} />;
        else return <Meow key={meow.meowId} meow={meow} openDialog />;
      })
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {meowsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserData })(user);

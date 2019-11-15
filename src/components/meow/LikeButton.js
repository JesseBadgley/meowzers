import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect } from 'react-redux';
import { likeMeow, unlikeMeow } from '../../redux/actions/dataActions';

export class LikeButton extends Component {
  likedMeow = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find((like) => like.meowId === this.props.meowId)
    )
      return true;
    else return false;
  };
  likeMeow = () => {
    this.props.likeMeow(this.props.meowId);
  };
  unlikeMeow = () => {
    this.props.unlikeMeow(this.props.meowId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to='/login'>
        <MyButton tip='Like'>
          <FavoriteBorder color='primary' />
        </MyButton>
      </Link>
    ) : this.likedMeow() ? (
      <MyButton tip='Undo like' onClick={this.unlikeMeow}>
        <FavoriteIcon color='primary' />
      </MyButton>
    ) : (
      <MyButton tip='Like' onClick={this.likeMeow}>
        <FavoriteBorder color='primary' />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  meowId: PropTypes.string.isRequired,
  likeMeow: PropTypes.func.isRequired,
  unlikeMeow: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  likeMeow,
  unlikeMeow
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);

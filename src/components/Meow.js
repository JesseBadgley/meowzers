import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// import axios from 'axios';
import link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    display: 'flex',
    marginBottom: 25
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 20
  },
  objectFit: 'cover'
};

class Meow extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      meow: {
        body,
        createdAt,
        userImage,
        userHandle
        // meowId,
        // likeCount,
        // commentCount
      }
    } = this.props;
    // const { } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile image'
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant='h5'
            component={link}
            to={`/users/${userHandle}`}
            color='secondary'
          >
            {userHandle}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant='body1'>{body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Meow);

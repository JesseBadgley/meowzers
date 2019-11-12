import React, { Component } from 'react';
import link from 'react-router-dom/Link';

//M-UI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <AppBar>
          <Toolbar className='nav-container'>
            <Button color='inherit' component={link} to='/login'>
              Login
            </Button>
            <Button color='inherit' component={link} to='/'>
              Home
            </Button>
            <Button color='inherit' component={link} to='signup'>
              Signup
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

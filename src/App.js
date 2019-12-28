import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import user from './components/user';

//Util
import AuthRoute from './util/AuthRoute';

axios.defaults.baseURL =
	'https://us-central1-meowzers-4343a.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if (token) {
	const decodedToken = jwtDecode(token);
	if (decodedToken.exp * 1000 < Date.now()) {
		store.dispatch(logoutUser());
		window.location.href = '/login';
	} else {
		store.dispatch({ type: SET_AUTHENTICATED });
		axios.defaults.headers.common['Authorization'] = token;
		store.dispatch(getUserData());
	}
}

// const theme = createMuiTheme(themeObject);

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#8bf6ff',
			main: '#4fc3f7',
			dark: '#0093c4',
			contrastText: '#000'
		},
		secondary: {
			light: '#efefef',
			main: '#bdbdbd',
			dark: '#8d8d8d',
			contrastText: '#000'
		}
	},
	typography: {
		useNextVarients: true
	},
	form: {
		textAlign: 'center'
	},
	image: {
		margin: '20px auto 20px auto'
	},
	pageTitle: {
		margin: '10px auto 10px auto'
	},
	textField: {
		margin: '10px auto 10px auto'
	},
	button: {
		marginTop: '20px',
		position: 'relative'
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: '12px'
	},
	small: {
		marginTop: '10px'
	},
	progress: {
		position: 'absolute'
	}
});

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<Provider store={store}>
					<Router>
						<Navbar />
						<div className='container'>
							<Switch>
								<Route exact path='/' component={Home} />
								<AuthRoute exact path='/login' component={Login} />
								<AuthRoute exact path='/signup' component={Signup} />
								<Route exact path='/users/:handle' component={user} />
								<Route
									exact
									path='/users/:handle/meow/:meowId'
									component={user}
								/>
								>
							</Switch>
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
export default App;

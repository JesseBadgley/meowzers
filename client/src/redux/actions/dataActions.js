import {
  SET_MEOWS,
  LOADING_DATA,
  LIKE_MEOW,
  UNLIKE_MEOW,
  DELETE_MEOW,
  SET_ERRORS,
  POST_MEOW,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_MEOW,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

// Get all meows
export const getMeows = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/meows')
    .then((res) => {
      dispatch({
        type: SET_MEOWS,
        payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_MEOWS,
        payload: []
      });
    });
};
export const getMeow = (meowId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/meow/${meowId}`)
    .then((res) => {
      dispatch({
        type: SET_MEOW,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};
// Post a meow
export const postMeow = (newMeow) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/meow', newMeow)
    .then((res) => {
      dispatch({
        type: POST_MEOW,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
// Like a meow
export const likeMeow = (meowId) => (dispatch) => {
  axios
    .put(`/meow/${meowId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_MEOW,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};
// Unlike a meow
export const unlikeMeow = (meowId) => (dispatch) => {
  axios
    .put(`/meow/${meowId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_MEOW,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};
// Submit a comment
export const submitComment = (meowId, commentData) => (dispatch) => {
  axios
    .post(`/meow/${meowId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const deleteMeow = (meowId) => (dispatch) => {
  axios
    .delete(`/meow/${meowId}`)
    .then(() => {
      dispatch({ type: DELETE_MEOW, payload: meowId });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_MEOWS,
        payload: res.data.meows
      });
    })
    .catch(() => {
      dispatch({
        type: SET_MEOWS,
        payload: null
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

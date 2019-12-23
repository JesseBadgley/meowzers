import {
  SET_MEOWS,
  LIKE_MEOW,
  UNLIKE_MEOW,
  LOADING_DATA,
  DELETE_MEOW,
  POST_MEOW,
  SET_MEOW,
  SUBMIT_COMMENT
} from '../types';

const initialState = {
  meows: [],
  meow: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_MEOWS:
      return {
        ...state,
        meows: action.payload,
        loading: false
      };
    case SET_MEOW:
      return {
        ...state,
        meow: action.payload
      };
    case LIKE_MEOW:
    case UNLIKE_MEOW:
      let index = state.meows.findIndex(
        (meow) => meow.meowId === action.payload.meowId
      );
      state.meows[index] = action.payload;
      if (state.meow.meowId === action.payload.meowId) {
        state.meow = action.payload;
      }
      return {
        ...state
      };
    case DELETE_MEOW:
      index = state.meows.findIndex((meow) => meow.meowId === action.payload);
      state.meows.splice(index, 1);
      return {
        ...state
      };
    case POST_MEOW:
      return {
        ...state,
        meows: [action.payload, ...state.meows]
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        meow: {
          ...state.meow,
          comments: [action.payload, ...state.meow.comments]
        }
      };
    default:
      return state;
  }
}

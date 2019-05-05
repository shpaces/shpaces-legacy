import {
	LEVEL_DATA_REQUEST,
	LEVEL_DATA_RECEIVED
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
		case LEVEL_DATA_RECEIVED:
			return  { ...state, [action.path]: action.payload};
    default:
      return state;
  }
}
import {
	COPY_REQUEST,
	MOVE_REQUEST,
	PASTE_REQUEST,
	PASTE_REQUEST_DONE,
	SAVE_DEST_PATH
} from '../actions/types';

const INITIAL_STATE = {
	status: 'inactive'
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case COPY_REQUEST:
			return  {...state, 'toCopy': action.path, 'toMove': null};
		case MOVE_REQUEST:
			return  {...state, 'toCopy': null, 'toMove': action.path};
		case PASTE_REQUEST:
			return  {...state, 'status': action.status};
		case PASTE_REQUEST_DONE:
			return  {...state, 'status': action.status};
		case SAVE_DEST_PATH:
			return {...state, 'dest': action.dest};
		default:
			return state;
	}
}
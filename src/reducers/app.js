import {
	DAY_INCREASE,
} from '../actions/app';

const defaultState = {
	day_count: 0,
	units: {}
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case DAY_INCREASE:
      return Object.assign({}, state, {
        day_count: state.day_count + 1,
      });
		default:
			return state;
	}
}

import {
	DAY_INCREASE,
	RESET_UNITS,
	UPDATE_UNIT,
	RESTART,
	UPDATE_NUM_PATIENTS,
} from '../actions/app';

const defaultState = {
	restart_id: 0,
	day_count: 0,
	num_current_patients: 0,
	num_new_patients: 0,
	num_untreated_patients: 0,
	units: {}
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case DAY_INCREASE:
			return {
				...state,
				day_count: state.day_count + 1,
			}
		case RESET_UNITS:
			return {
				...state,
				units: action.units,
			}
		case UPDATE_UNIT:
			return {
        ...state,
        units: {
          ...state.units,
          [action.id]: {
						...state.units[action.id],
						...action.unit
					}
        }
      };
		case RESTART:
			return {
				...state,
				day_count: 0,
				num_current_patients: 0,
				num_new_patients: 0,
				num_untreated_patients: 0,
				restart_id: state.restart_id + 1,
			}
		case UPDATE_NUM_PATIENTS:
			return {
				...state,
				num_current_patients: action.num_current_patients,
				num_new_patients: action.num_new_patients,
			}
		default:
			return state;
	}
}

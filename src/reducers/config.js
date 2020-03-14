import {
	TBD,
} from '../actions/config';

const defaultState = {
	quanrentine_days: 14,
	ward_release_days: 20,
	prob_of_staff_infected: 50,
	prc_patients_in_serious_cond: 20,
	staff_encounter_per_patient: 3,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case TBD:
      return Object.assign({}, state, {
        day_count: state.day_count + 1,
      });
		default:
			return state;
	}
}

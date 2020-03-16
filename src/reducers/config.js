import {
	UPDATE_CONFIG,
} from '../actions/config';

const defaultState = {
	ver: 0,
	total_num_units: 10,
	quanrentine_days: 14,
	ward_release_days: 20,
	prob_of_staff_infected: 50,
	prc_patients_in_serious_cond: 20,
	staff_encounter_per_patient: 3,
	init_num_patients: 10,
	num_patients_growth_factor: 1.2,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case UPDATE_CONFIG:
      return Object.assign({}, state, {
				ver: state.ver + 1,
        total_num_units: action.config.total_num_units,
				prob_of_staff_infected: action.config.prob_of_staff_infected,
				prc_patients_in_serious_cond: action.config.prc_patients_in_serious_cond,
				staff_encounter_per_patient: action.config.staff_encounter_per_patient,
				init_num_patients: action.config.init_num_patients,
				num_patients_growth_factor: action.config.num_patients_growth_factor,
      });
		default:
			return state;
	}
}

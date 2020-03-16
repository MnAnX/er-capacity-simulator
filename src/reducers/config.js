import {
	UPDATE_CONFIG,
} from '../actions/config';

const defaultState = {
	ver: 0,
	total_num_units: 10,
	quanrentine_days: 14,
	bed_turnover_days: 20,
	icu_turnover_days: 30,
	prob_of_staff_infected: 50,
	prc_patients_needs_bed: 20,
	prc_patients_needs_icu: 2,
	staff_encounter_per_patient: 3,
	num_patients_growth_basis: 10,
	num_patients_growth_factor: 1.2,
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case UPDATE_CONFIG:
      return Object.assign({}, state, {
				ver: state.ver + 1,
        total_num_units: parseInt(action.config.total_num_units),
				prob_of_staff_infected: parseInt(action.config.prob_of_staff_infected),
				prc_patients_needs_bed: parseInt(action.config.prc_patients_needs_bed),
				prc_patients_needs_icu: parseInt(action.config.prc_patients_needs_icu),
				staff_encounter_per_patient: parseInt(action.config.staff_encounter_per_patient),
				num_patients_growth_basis: parseInt(action.config.num_patients_growth_basis),
				num_patients_growth_factor: Number(action.config.num_patients_growth_factor),
      });
		default:
			return state;
	}
}

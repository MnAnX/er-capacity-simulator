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
	units: {},
	num_units_green: 0,
	num_units_yellow: 0,
	num_units_red: 0,
	num_units_understaffed: 0,
	num_units_no_icu: 0,
	num_units_no_bed: 0,
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
			let units = {
				...state.units,
				[action.id]: {
					...state.units[action.id],
					...action.unit
				}
			}
			let num_units_green = Object.values(units).filter(unit => unit.status === "Normal").length
			let num_units_yellow = Object.values(units).filter(unit => unit.status === "Critical").length
			let num_units_red = Object.values(units).filter(unit => unit.status === "Down").length
			let num_units_understaffed = Object.values(units).filter(unit => unit.status_info.includes("Understaffed") || unit.status_info.includes("No Staff")).length
			let num_units_no_icu = Object.values(units).filter(unit => unit.status_info.includes("No ICU")).length
			let num_units_no_bed = Object.values(units).filter(unit => unit.status_info.includes("Can't Admit")).length
			return {
        ...state,
        units,
				num_units_green,
				num_units_yellow,
				num_units_red,
				num_units_understaffed,
				num_units_no_icu,
				num_units_no_bed,
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

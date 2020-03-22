import _ from 'lodash'

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
	total_num_recovered: 0,
	total_num_death: 0,
	total_available_providers: 0,
	total_available_nurses: 0,
	total_available_beds: 0,
	total_available_icus: 0,
	total_ppe_consumed: 0,
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
			let num_units_understaffed = Object.values(units).filter(unit => unit.status_info.includes("Understaffed") || unit.status_info.includes("No Provider") || unit.status_info.includes("No Nurse")).length
			let num_units_no_icu = Object.values(units).filter(unit => unit.status_info.includes("No ICU")).length
			let num_units_no_bed = Object.values(units).filter(unit => unit.status_info.includes("Can't Admit")).length
			let total_num_recovered = _.sum(Object.values(units).map(unit => unit.num_recovered))
			let total_num_death = _.sum(Object.values(units).map(unit => unit.num_death))
			let total_available_providers = _.sum(Object.values(units).map(unit => unit.available_providers))
			let total_available_nurses = _.sum(Object.values(units).map(unit => unit.available_nurses))
			let total_available_beds = _.sum(Object.values(units).map(unit => unit.available_beds))
			let total_available_icus = _.sum(Object.values(units).map(unit => unit.available_icus))
			let total_ppe_consumed = _.sum(Object.values(units).map(unit => unit.ppe_consumed))
			return {
        ...state,
        units,
				num_units_green,
				num_units_yellow,
				num_units_red,
				num_units_understaffed,
				num_units_no_icu,
				num_units_no_bed,
				total_num_recovered,
				total_num_death,
				total_available_providers,
				total_available_nurses,
				total_available_beds,
				total_available_icus,
				total_ppe_consumed,
      };
		case RESTART:
			return {
				...defaultState,
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

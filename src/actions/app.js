export const DAY_INCREASE = 'DAY_INCREASE';
export const RESET_UNITS = 'RESET_UNITS';
export const UPDATE_UNIT = 'UPDATE_UNIT';
export const RESTART = 'RESTART';
export const UPDATE_NUM_PATIENTS = 'UPDATE_NUM_PATIENTS';


export const increaseDay = () => async dispatch => {
  dispatch({
	  type: DAY_INCREASE,
	});
};

export const resetUnits = (units) => async dispatch => {
  dispatch({
	  type: RESET_UNITS,
    units
	});
};

export const updateUnit = (id, unit) => async dispatch => {
  dispatch({
	  type: UPDATE_UNIT,
    id,
    unit
	});
};

export const restart = () => async dispatch => {
  dispatch({
	  type: RESTART
	})
};

export const updateNumPatients = (num_current_patients, num_new_patients) => async dispatch => {
  dispatch({
	  type: UPDATE_NUM_PATIENTS,
    num_current_patients,
    num_new_patients,
	})
};

export const UPDATE_CONFIG = 'UPDATE_CONFIG';

export const updateConfig = (config) => async dispatch => {
  dispatch({
	  type: UPDATE_CONFIG,
    config,
	});
};

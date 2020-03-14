export const DAY_INCREASE = 'DAY_INCREASE';

export const increaseDay = () => async dispatch => {
  dispatch({
	  type: DAY_INCREASE,
	});
};

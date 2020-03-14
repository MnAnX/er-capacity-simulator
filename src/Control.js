import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import _ from 'lodash'
import Button from '@material-ui/core/Button';

class Control extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (
			<div>
				<Button variant="contained" color="primary" onClick={()=>{
					this.props.increaseDay()
				}}>Next Day</Button>
			</div>
		);
	}
}

function mapStateToProps({app}) {
	return {
		app
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Control);

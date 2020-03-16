import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';


class Summary extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (
			<div>
				<h2>Day {this.props.app.day_count}</h2>
				<h4>New Patients: {this.props.app.num_new_patients}</h4>
			</div>
		);
	}
}

function mapStateToProps({app, config}) {
	return {
		app,
		config
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);

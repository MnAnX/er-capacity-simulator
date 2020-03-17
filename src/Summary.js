import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import Grid from '@material-ui/core/Grid';
import Padding from './components/Padding'


class Summary extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		let num_units_green = this.props.app.day_count > 0 ? this.props.app.num_units_green : this.props.config.total_num_units
		return (
			<Grid container justify="center">
				<h2>Day {this.props.app.day_count}</h2>
				<Grid container justify="center">
					<Grid item>
						<h4>Daily New Patients: {this.props.app.num_new_patients}</h4>
						<h4>Total Patients: {this.props.app.num_current_patients}</h4>
					</Grid>
					<Padding width="10%" />
					<Grid item>
						<h4>Normal: {num_units_green} / {this.props.config.total_num_units}</h4>
						<h4>Critical: {this.props.app.num_units_yellow} / {this.props.config.total_num_units}</h4>
						<h4>Down: {this.props.app.num_units_red} / {this.props.config.total_num_units}</h4>
					</Grid>
					<Padding width="10%" />
					<Grid item>
						<h4>Understaffed: {this.props.app.num_units_understaffed} / {this.props.config.total_num_units}</h4>
						<h4>No ICU: {this.props.app.num_units_no_icu} / {this.props.config.total_num_units}</h4>
						<h4>No Bed: {this.props.app.num_units_no_bed} / {this.props.config.total_num_units}</h4>
					</Grid>
	      </Grid>
			</Grid>
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

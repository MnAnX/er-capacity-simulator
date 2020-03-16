import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import _ from 'lodash'
import Button from '@material-ui/core/Button';

class Control extends Component {
	constructor(props) {
    super(props);

		this.nextDay = this.nextDay.bind(this)
  }

	nextDay() {
		// dispatch new patients
		let num_current_patients = this.props.app.num_current_patients
		if (this.props.app.day_count === 0) {
			// init patinet number
			this.props.updateNumPatients(this.props.config.init_num_patients, 0)
			num_current_patients = this.props.config.init_num_patients
		}

		// calculate number of new patients
		let num_new_patients = Math.floor(num_current_patients * (this.props.config.num_patients_growth_factor - 1))
		// update patient number
		this.props.updateNumPatients(num_current_patients + num_new_patients, num_new_patients)

		// send new patients to units that are still operating
		let available_units = Object.values(this.props.app.units).filter(unit => unit.status !== "Down")
		// dispatch patients
		if (num_new_patients > available_units.length) {
			// Send patients evenly to all the units
			let incr = num_new_patients / available_units.length
			let remainder = num_new_patients % available_units.length
			available_units.forEach((unit, i) => {
				let new_patients = unit.new_patients + incr
				if (remainder > 0) {
					new_patients += 1
					remainder--
				}
				this.props.updateUnit(unit.id, {
					new_patients,
				})
			})
		} else {
			// send patients randomly to units
			available_units.map(unit => unit.new_patients = 0)
			for (let i = 0; i < num_new_patients; i++) {
				let index = Math.floor(Math.random() * Math.floor(available_units.length))
				available_units[index].new_patients++
			}
			available_units.forEach((unit, i) => {
				this.props.updateUnit(unit.id, {
					new_patients: unit.new_patients,
				})
			});
		}

		// move day
		this.props.increaseDay()
	}

	render() {
		return (
			<div>
				<Button variant="outlined" color="secondary" onClick={()=>{
					this.props.restart()
				}}>Restart</Button>
				<Button variant="contained" color="secondary" onClick={()=>{
					this.nextDay()
				}}>Next Day</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Control);

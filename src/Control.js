import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Padding from './components/Padding'
import SkipNextIcon from '@material-ui/icons/SkipNext';

class Control extends Component {
	constructor(props) {
    super(props);

		this.nextDay = this.nextDay.bind(this)
  }

	nextDay() {
		// dispatch new patients
		let num_current_patients = this.props.app.num_current_patients
		if (this.props.app.day_count === 0) {
			// init patient number
			this.props.updateNumPatients(this.props.config.num_patients_growth_basis, 0)
			num_current_patients = this.props.config.num_patients_growth_basis
		}

		// calculate number of incoming patients
		let num_total_patients = num_current_patients * this.props.config.num_patients_growth_factor
		let incoming_patients = Math.floor(num_total_patients * (this.props.config.prc_patients_go_hospital / 100))
		let updated_total_patients = num_total_patients - incoming_patients
		// update patient number
		this.props.updateNumPatients(updated_total_patients, incoming_patients)

		// send new patients to units that are still operating
		let available_units = Object.values(this.props.app.units).filter(unit => unit.status !== "Down")
		// dispatch patients
		if (incoming_patients > available_units.length) {
			// Send patients evenly to all the units
			let incr = Math.floor(incoming_patients / available_units.length)
			let remainder = incoming_patients % available_units.length
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
			for (let i = 0; i < incoming_patients; i++) {
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
			<Grid container justify="center">
				<Button
					size="large"
					variant="outlined"
					color="secondary"
					onClick={()=>{
						this.props.restart()
					}}
				>
					Restart
				</Button>
				<Padding width={40} />
				<Button
					size="large"
					variant="contained"
					color="secondary"
					endIcon={<SkipNextIcon />}
					onClick={()=>{
						this.nextDay()
					}}
				>
					Next Day
				</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Control);

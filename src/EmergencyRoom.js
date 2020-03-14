import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import _ from 'lodash'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


class EmergencyRoom extends Component {
	constructor(props) {
    super(props);
		this.state = {
			id: props.id,
			status: props.init_status,
			status_info: "",
			day_count: this.props.app.day_count,
			name: "Hospital_1",
			num_total_staffs: 10,
			num_total_wards: 5,
			staffs_num_threshold: 4,
			staffs_quanrentined: [],
			wards_occupied: [],
		}

		this.setConfig = this.setConfig.bind(this)
		this.dailyCalc = this.dailyCalc.bind(this)
  }

	componentWillMount() {
    this.setConfig(this.props.config)
  }

	componentWillReceiveProps(nextProps) {
		if(nextProps.app.day_count) {
			this.setState({day_count: nextProps.app.day_count})
			this.dailyCalc(nextProps.app.units[this.state.id])
		}
		if(nextProps.config) {
			this.setConfig(nextProps.config)
		}
  }

	setConfig(config) {
		this.setState({
			quanrentine_days: config.quanrentine_days,
			ward_release_days: config.ward_release_days,
			prob_of_staff_infected: config.prob_of_staff_infected,
			prc_patients_in_serious_cond: config.prc_patients_in_serious_cond,
			staff_encounter_per_patient: config.staff_encounter_per_patient,
		})
	}

	dailyCalc(unitState) {
		//let new_patients = unitState.new_cases
		let new_patients = 10
		// Calculate Staff Status
		let staffs_quanrentined = this.state.staffs_quanrentined
		// Check if any staff is out of quanrentine
		staffs_quanrentined = staffs_quanrentined
														.map(days_in_quanrentine => days_in_quanrentine - 1)
														.filter(days_in_quanrentine => days_in_quanrentine > 0)
		// Calculate how many staffs may get infected due to the new incoming cases
		let staffs_in_duty = this.state.num_total_staffs - staffs_quanrentined.length
		let encounters = Math.min(new_patients * this.state.staff_encounter_per_patient, staffs_in_duty)
		let newly_infected_staffs = 0
		for (let i = 0; i < encounters; i++) {
		  let roll_dice = Math.floor(Math.random() * Math.floor(100))
			if (roll_dice < this.state.prob_of_staff_infected) {
				newly_infected_staffs += 1
			}
		}
		// Each infected staff needs to start self-quanrentine
		for (let i = 0; i < newly_infected_staffs; i++) {
			staffs_quanrentined.push(this.state.quanrentine_days)
		}

		// Calculate Ward Status
		let wards_occupied = this.state.wards_occupied
		// Check if any ward is released
		wards_occupied = wards_occupied
											.map(days_occupied => days_occupied - 1)
											.filter(days_occupied => days_occupied > 0)
		// New patients that need wards
		let new_patients_need_ward = Math.floor(new_patients * this.state.prc_patients_in_serious_cond / 100)
		let num_available_wards = this.state.num_total_wards - wards_occupied.length
		// Put patients into wards
		let assign_wards = Math.min(num_available_wards, new_patients_need_ward)
		for (let i = 0; i < assign_wards; i++) {
			wards_occupied.push(this.state.ward_release_days)
		}
		// TODO: when new_patients_need_ward > num_available_wards, need to transfer patients to other hospitals

		// Calculate status of this ER unit
		let available_staffs = this.state.num_total_staffs - staffs_quanrentined.length
		let available_wards = this.state.num_total_wards - wards_occupied.length
		let status = this.state.status
		let status_info = this.state.status_info
		if (available_staffs < this.state.staffs_num_threshold) {
			status = "Down"
			status_info = "Understaffed"
		}
		if (available_wards < 1) {
			status = "Down"
			status_info = "No Ward Available"
		}

		// Update State
		this.setState({
			staffs_quanrentined,
			wards_occupied,
			status,
			status_info,
		})
	}

	render() {
		return (
			<Card>
				<CardContent>
					<Typography variant="body2" component="p">
	          {this.state.day_count}
						<br />
						{this.state.status}
						<br />
						{this.state.status_info}
						<br />
						{this.state.num_total_staffs - this.state.staffs_quanrentined.length}
						<br />
						{this.state.num_total_wards - this.state.wards_occupied.length}
	        </Typography>
				</CardContent>
			</Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyRoom);

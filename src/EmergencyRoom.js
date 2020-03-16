import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

import Padding from './components/Padding'

class EmergencyRoom extends Component {
	constructor(props) {
    super(props);
		this.state = {
			restart_id: this.props.app.restart_id,
			id: props.id,
			status: props.init_status,
			status_info: [],
			status_color: "green",
			day_count: this.props.app.day_count,
			name: "Hospital_" + props.id,
			num_total_providers: 10,
			num_total_nurses: 30,
			num_total_beds: 500,
			num_total_icus: 30,
			providers_quanrentined: [],
			nurses_quanrentined: [],
			beds_occupied: [],
			icus_occupied: [],
		}

		this.dailyCalc = this.dailyCalc.bind(this)
		this.clearState = this.clearState.bind(this)
  }

	componentWillReceiveProps(nextProps) {
		if(nextProps.app.day_count != this.state.day_count) {
			this.setState({day_count: nextProps.app.day_count})
			this.dailyCalc(nextProps.app.units[this.state.id])
		}
		if(nextProps.app.restart_id != this.state.restart_id) {
			this.setState({restart_id: nextProps.app.restart_id})
			this.clearState()
		}
  }

	clearState() {
		this.setState({
			status: "Normal",
			status_info: "",
			status_color: "green",
			providers_quanrentined: [],
			beds_occupied: [],
		})
	}

	dailyCalc(unitState) {
		let new_patients = unitState.new_patients

		// Calculate Providers Status
		let providers_quanrentined = this.state.providers_quanrentined
		// Check if any staff is out of quanrentine
		providers_quanrentined = providers_quanrentined
														.map(days_in_quanrentine => days_in_quanrentine - 1)
														.filter(days_in_quanrentine => days_in_quanrentine > 0)
		// Calculate how many staffs may get infected due to the new incoming cases
		let providers_in_duty = this.state.num_total_providers - providers_quanrentined.length
		let encounters = Math.min(new_patients * this.props.config.staff_encounter_per_patient, providers_in_duty)
		let newly_infected_providers = 0
		for (let i = 0; i < encounters; i++) {
		  let roll_dice = Math.floor(Math.random() * Math.floor(100))
			if (roll_dice < this.props.config.prob_of_staff_infected) {
				newly_infected_providers++
			}
		}
		// Each infected staff needs to start self-quanrentine
		for (let i = 0; i < newly_infected_providers; i++) {
			providers_quanrentined.push(this.props.config.quanrentine_days)
		}

		// Calculate Nurses Status
		let nurses_quanrentined = this.state.nurses_quanrentined
		// Check if any staff is out of quanrentine
		nurses_quanrentined = nurses_quanrentined
														.map(days_in_quanrentine => days_in_quanrentine - 1)
														.filter(days_in_quanrentine => days_in_quanrentine > 0)
		// Calculate how many staffs may get infected due to the new incoming cases
		let nurses_in_duty = this.state.num_total_nurses - nurses_quanrentined.length
		let nurse_encounters = Math.min(new_patients * this.props.config.staff_encounter_per_patient, nurses_in_duty)
		let newly_infected_nurses = 0
		for (let i = 0; i < nurse_encounters; i++) {
		  let roll_dice = Math.floor(Math.random() * Math.floor(100))
			if (roll_dice < this.props.config.prob_of_staff_infected) {
				newly_infected_nurses++
			}
		}
		// Each infected staff needs to start self-quanrentine
		for (let i = 0; i < newly_infected_nurses; i++) {
			nurses_quanrentined.push(this.props.config.quanrentine_days)
		}

		// Calculate Beds Status
		let beds_occupied = this.state.beds_occupied
		// Check if any bed is released
		beds_occupied = beds_occupied
											.map(days_occupied => days_occupied - 1)
											.filter(days_occupied => days_occupied > 0)
		// New patients that need bed
		let new_patients_need_bed = 0
		for (let i = 0; i < new_patients; i++) {
			let roll_dice = Math.floor(Math.random() * Math.floor(100))
			if (roll_dice < this.props.config.prc_patients_needs_bed) {
				new_patients_need_bed++
			}
		}
		let num_available_beds = this.state.num_total_beds - beds_occupied.length
		// Put patients into bed
		let assign_beds = Math.min(num_available_beds, new_patients_need_bed)
		for (let i = 0; i < assign_beds; i++) {
			beds_occupied.push(this.props.config.bed_turnover_days)
		}
		// TODO: when new_patients_need_bed > num_available_beds, need to transfer patients to other hospitals

		// Calculate ICUs Status
		let icus_occupied = this.state.icus_occupied
		// Check if any bed is released
		icus_occupied = icus_occupied
											.map(days_occupied => days_occupied - 1)
											.filter(days_occupied => days_occupied > 0)
		// New patients that need ICU
		let new_patients_need_icu = 0
		for (let i = 0; i < new_patients; i++) {
			let roll_dice = Math.floor(Math.random() * Math.floor(100))
			if (roll_dice < this.props.config.prc_patients_needs_icu) {
				new_patients_need_icu++
			}
		}
		let num_available_icus = this.state.num_total_icus - icus_occupied.length
		// Put patients into ICU
		let assign_icus = Math.min(num_available_icus, new_patients_need_icu)
		for (let i = 0; i < assign_icus; i++) {
			icus_occupied.push(this.props.config.icu_turnover_days)
		}
		// TODO: when new_patients_need_icu > num_available_icus, need to transfer patients to other hospitals

		// Calculate status of this ER unit
		let available_providers = this.state.num_total_providers - providers_quanrentined.length
		let available_nurses = this.state.num_total_nurses - nurses_quanrentined.length
		let available_beds = this.state.num_total_beds - beds_occupied.length
		let available_icus = this.state.num_total_icus - icus_occupied.length
		let status = "Normal"
		let status_info = []
		if (available_providers < (this.state.num_total_providers / 2) || available_nurses < (this.state.num_total_nurses / 2)) {
			status = "Critical"
			status_info.push("Understaffed")
		}
		if (available_icus < 1) {
			status = "Critical"
			status_info.push("No ICU")
		}
		if (available_providers < 1) {
			status = "Down"
			status_info = ["No Provider"]
		}
		if (available_nurses < 1) {
			status = "Down"
			status_info = ["No Nurse"]
		}
		if (available_beds < 1 && available_icus < 1) {
			status = "Down"
			status_info = ["Can't Admit"]
		}

		let status_color = this.state.status_color
		switch (status) {
			case "Normal":
				status_color = "green"; break;
			case "Critical":
				status_color = "orange"; break;
			case "Down":
				status_color = "red"; break;
		}

		// Update State
		this.setState({
			providers_quanrentined,
			nurses_quanrentined,
			beds_occupied,
			status,
			status_info,
			status_color,
		})

		// Update the centralized unit status
		this.props.updateUnit(this.state.id, {
			status,
			status_info,
		})
	}

	render() {
		return (
			<Card style={{ backgroundColor: this.state.status_color }}>
				<CardContent>
						<TextField id="name"
							variant="outlined"
							value={this.state.name}
							onChange={(event)=>this.setState({name: event.target.value})} />
						<Padding height={10}/>
						<TextField id="total-providers"
							variant="outlined"
							label="Providers"
							value={this.state.num_total_providers}
							onChange={(event)=>this.setState({num_total_providers: parseInt(event.target.value, 10)})} />
						<Padding height={10}/>
						<TextField id="total-nurses"
							variant="outlined"
							label="Nurses"
							value={this.state.num_total_nurses}
							onChange={(event)=>this.setState({num_total_nurses: parseInt(event.target.value, 10)})} />
						<Padding height={10}/>
						<TextField id="total-beds"
							variant="outlined"
							label="Beds"
							value={this.state.num_total_beds}
							onChange={(event)=>this.setState({num_total_beds: parseInt(event.target.value, 10)})} />
						<Padding height={10}/>
						<TextField id="total-icus"
							variant="outlined"
							label="ICUs"
							value={this.state.num_total_icus}
							onChange={(event)=>this.setState({num_total_icus: parseInt(event.target.value, 10)})} />
						<Padding height={10}/>
						{this.state.status_info.length > 0 &&
							<div>
								{this.state.status_info.map(info =>
									<Chip label={info} color="primary" />
								)}
								<br />
							</div>
						}
						{"Providers In Duty: " + (this.state.num_total_providers - this.state.providers_quanrentined.length)}
						<br />
						{"Nurses In Duty: " + (this.state.num_total_nurses - this.state.nurses_quanrentined.length)}
						<br />
						{"Beds Available: " + (this.state.num_total_beds - this.state.beds_occupied.length)}
						<br />
						{"ICUs Available: " + (this.state.num_total_icus - this.state.icus_occupied.length)}
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

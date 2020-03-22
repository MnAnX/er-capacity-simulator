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
			num_total_beds: 100,
			num_total_icus: 10,
			providers_quanrentined: [],
			nurses_quanrentined: [],
			beds_occupied: [],
			icus_occupied: [],
			num_recovered: 0,
			num_death: 0,
			ppe_consumed: 0,
		}

		this.dailyCalc = this.dailyCalc.bind(this)
		this.clearState = this.clearState.bind(this)
		this.rollDice = this.rollDice.bind(this)
		this.probLoop = this.probLoop.bind(this)
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
			nurses_quanrentined: [],
			beds_occupied: [],
			icus_occupied: [],
			num_recovered: 0,
			num_death: 0,
			ppe_consumed: 0,
		})
	}

	rollDice(quantile) {
		let roll_dice = Math.floor(Math.random() * Math.floor(100))
		if (roll_dice < quantile) {
			return true
		}
		return false
	}

	probLoop(total, prob) {
		let counter = 0
		for (let i = 0; i < total; i++) {
			if (this.rollDice(prob)) {
				counter++
			}
		}
		return counter
	}

	dailyCalc(unitState) {
		let new_patients = unitState.new_patients

		// Calculate PPE consume
		let num_ppe_consumed_first_encounter = new_patients * this.props.config.ppe_per_patient_first_encounter
		let num_ppe_consumed_admitted = (this.state.beds_occupied.length + this.state.icus_occupied.length) * this.props.config.ppe_per_patient_admitted_daily
		let ppe_consumed = this.state.ppe_consumed + num_ppe_consumed_first_encounter + num_ppe_consumed_admitted

		// Calculate Providers Status
		let providers_quanrentined = this.state.providers_quanrentined
		// Check if any staff is out of quanrentine
		providers_quanrentined = providers_quanrentined
														.map(days_in_quanrentine => days_in_quanrentine - 1)
														.filter(days_in_quanrentine => days_in_quanrentine > 0)
		// Calculate how many staffs may get infected due to the new incoming cases
		let providers_in_duty = this.state.num_total_providers - providers_quanrentined.length
		let provider_encounters = Math.min(new_patients, providers_in_duty)
		let newly_infected_providers = this.probLoop(provider_encounters, this.props.config.prob_of_staff_infected)
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
		let newly_infected_nurses = this.probLoop(nurse_encounters, this.props.config.prob_of_staff_infected)
		// Each infected staff needs to start self-quanrentine
		for (let i = 0; i < newly_infected_nurses; i++) {
			nurses_quanrentined.push(this.props.config.quanrentine_days)
		}

		// Calculate bed/ICU Status
		// Check if any bed is released
		let beds_occupied = this.state.beds_occupied
		let icus_occupied = this.state.icus_occupied
		let total_occupied = beds_occupied.length + icus_occupied.length
		beds_occupied = beds_occupied
											.map(days_occupied => days_occupied - 1)
											.filter(days_occupied => days_occupied > 0)
		icus_occupied = icus_occupied
											.map(days_occupied => days_occupied - 1)
											.filter(days_occupied => days_occupied > 0)
		// Calculate number of recovery and death
		let patients_out = total_occupied - beds_occupied.length - icus_occupied.length
		let newly_num_death = this.probLoop(patients_out, this.props.config.mortality_rate)
		let newly_num_recovered = patients_out - newly_num_death
		let num_death = this.state.num_death + newly_num_death
		let num_recovered = this.state.num_recovered + newly_num_recovered
		// New patients that need bed
		let new_patients_need_bed = 0
		let new_patients_need_icu = 0
		for (let i = 0; i < new_patients; i++) {
			let roll_dice = Math.floor(Math.random() * Math.floor(100))
			if (roll_dice < this.props.config.prc_patients_needs_icu) {
				new_patients_need_icu++
			}
			else if (roll_dice < (this.props.config.prc_patients_needs_bed + this.props.config.prc_patients_needs_icu)) {
				new_patients_need_bed++
			}
		}
		// Put patients into bed
		let num_available_beds = this.state.num_total_beds - beds_occupied.length
		let assign_beds = Math.min(num_available_beds, new_patients_need_bed)
		for (let i = 0; i < assign_beds; i++) {
			beds_occupied.push(this.props.config.bed_turnover_days)
		}
		// Put patients into ICU
		let num_available_icus = this.state.num_total_icus - icus_occupied.length
		let assign_icus = Math.min(num_available_icus, new_patients_need_icu)
		for (let i = 0; i < assign_icus; i++) {
			icus_occupied.push(this.props.config.icu_turnover_days)
		}
		// TODO: when having more patients than available beds/ICUs, need to transfer patients to the other units

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
		if (available_beds < 1) {
			status = "Critical"
			status_info.push("No Bed")
		}
		if (available_providers < 1) {
			status = "Down"
			status_info.push("No Provider")
		}
		if (available_nurses < 1) {
			status = "Down"
			status_info.push("No Nurse")
		}
		if (available_beds < 1 && available_icus < 1) {
			status = "Down"
			status_info.push("Can't Admit")
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
			icus_occupied,
			status,
			status_info,
			status_color,
			num_recovered,
			num_death,
			ppe_consumed,
		})

		// Update the centralized unit status
		this.props.updateUnit(this.state.id, {
			status,
			status_info,
			num_recovered,
			num_death,
			available_providers,
			available_nurses,
			available_beds,
			available_icus,
			ppe_consumed,
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
						<br />
						{"PPEs Consumed: " + this.state.ppe_consumed}
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

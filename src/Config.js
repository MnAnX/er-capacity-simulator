import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/config';

import _ from 'lodash'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Padding from './components/Padding'


class Config extends Component {
	constructor(props) {
    super(props);

		this.state = {
			ver: this.props.config.ver,
			total_num_units: this.props.config.total_num_units,
			prob_of_staff_infected: this.props.config.prob_of_staff_infected,
			prc_patients_needs_bed: this.props.config.prc_patients_needs_bed,
			prc_patients_needs_icu: this.props.config.prc_patients_needs_icu,
			staff_encounter_per_patient: this.props.config.staff_encounter_per_patient,
			num_patients_growth_basis: this.props.config.num_patients_growth_basis,
			num_patients_growth_factor: this.props.config.num_patients_growth_factor,
			bed_turnover_days: this.props.config.bed_turnover_days,
			icu_turnover_days: this.props.config.icu_turnover_days,
			quanrentine_days: this.props.config.quanrentine_days,
			ppe_per_patient_first_encounter: this.props.config.ppe_per_patient_first_encounter,
			ppe_per_patient_admitted_daily: this.props.config.ppe_per_patient_admitted_daily,
			mortality_rate: this.props.config.mortality_rate,
		}
  }

	render() {
		return (
			<Container>
				<Container>
					<TextField id="total_num_units"
						type='number'
						variant="outlined"
						label="Number of Hospital/ERs"
						helperText="How many hospitals/ERs in this area"
						value={this.state.total_num_units}
						onChange={(event)=>this.setState({total_num_units: event.target.value})} />
					<p>(You can change each hospital's configuration, such as number of providers, nurses, beds and ICUs, in the Run Simulation section by editing each block.)</p>
					<div>
						<p>
			        <h4>Patients Incoming Rate:</h4>
							(This describes how many new patients per day do you expect in the area.
							We assume it grows exponentially based on the initial value and the growth factor.
							For example, if you set the basis of 100 and factor to 1.2, the number of daily new patients will be:
							20, 24, 28, 34, 42...)
			      </p>
						<div style={{display: 'flex', flexDirection: 'row'}}>
							<TextField id="patients-growth-basis"
								type='number'
								variant="outlined"
								label="Patients Growth Basis"
								value={this.state.num_patients_growth_basis}
								onChange={(event)=>this.setState({num_patients_growth_basis: event.target.value})} />
							<Padding width={20}/>
							<TextField id="patients-growth-factor"
								type='number'
								variant="outlined"
								label="Patients Growth Factor"
								value={this.state.num_patients_growth_factor}
								onChange={(event)=>this.setState({num_patients_growth_factor: event.target.value})} />
						</div>
					</div>
					<Padding height={30}/>
					<div style={{display: 'flex', flexDirection: 'row'}}>
						<TextField id="bed-turnover"
							type='number'
							variant="outlined"
							label="Average Days to Discharge (Admitted)"
							value={this.state.bed_turnover_days}
							onChange={(event)=>this.setState({bed_turnover_days: event.target.value})} />
						<Padding width={20}/>
						<TextField id="icu-turnover"
							type='number'
							variant="outlined"
							label="Average Days to Discharge (ICU)"
							value={this.state.icu_turnover_days}
							onChange={(event)=>this.setState({icu_turnover_days: event.target.value})} />
						<Padding width={20}/>
						<TextField id="icu-turnover"
							type='number'
							variant="outlined"
							label="Quanrentine Days"
							value={this.state.quanrentine_days}
							onChange={(event)=>this.setState({quanrentine_days: event.target.value})} />
					</div>
					<div>
						<h4> On average, how many healthcare workers will each patient encounter? </h4>
						<Slider
							onChange={(event, value)=>this.setState({staff_encounter_per_patient: value})}
			        defaultValue={this.props.config.staff_encounter_per_patient}
			        valueLabelDisplay="auto"
			        step={1}
							min={1}
	        		max={50}
			      />
					</div>
					<div>
						<h4> Healthcare Worker Protection (Chance of health workers get infected when encounter a positive patient) </h4>
						<Slider
							onChange={(event, value)=>this.setState({prob_of_staff_infected: value})}
			        defaultValue={this.props.config.prob_of_staff_infected}
			        step={1}
							aria-labelledby="discrete-slider"
			        valueLabelDisplay="auto"
							min={0}
	        		max={80}
			        marks={[
											{
										    value: 50,
										    label: 'No Protection (50%)',
										  },
										  {
										    value: 20,
										    label: 'Basic Protection - Surgical Mask (20%)',
										  },
										  {
										    value: 3,
										    label: 'Full Protection (< 5%)',
										  },
										]}
			      />
					</div>
					<Padding height={10}/>
					<div>
						<h4> Percentage of patients needs to be admitted (How many patients out of 100 will need a bed?) </h4>
						<Slider
							onChange={(event, value)=>this.setState({prc_patients_needs_bed: value})}
			        defaultValue={this.props.config.prc_patients_needs_bed}
							getAriaValueText={(val)=>`${val}%`}
			        aria-labelledby="discrete-slider"
			        valueLabelDisplay="auto"
			        step={1}
			      />
					</div>
					<div>
						<h4> Percentage of patients needs ICU (How many patients out of 100 will need intensive care?) </h4>
						<Slider
							onChange={(event, value)=>this.setState({prc_patients_needs_icu: value})}
			        defaultValue={this.props.config.prc_patients_needs_icu}
							getAriaValueText={(val)=>`${val}%`}
			        aria-labelledby="discrete-slider"
			        valueLabelDisplay="auto"
			        step={1}
			      />
					</div>
					<div>
						<h4> Mortality Rate </h4>
						<Slider
							onChange={(event, value)=>this.setState({mortality_rate: value})}
			        defaultValue={this.props.config.mortality_rate}
			        valueLabelDisplay="auto"
			        step={0.1}
							min={1}
	        		max={20}
			      />
					</div>
					<div>
						<h4> How many PPEs are required for the first encounter of a patient? </h4>
						<Slider
							onChange={(event, value)=>this.setState({ppe_per_patient_first_encounter: value})}
			        defaultValue={this.props.config.ppe_per_patient_first_encounter}
			        valueLabelDisplay="auto"
			        step={1}
							min={1}
	        		max={100}
			      />
					</div>
					<div>
						<h4> How many PPEs are required daily for caring an admitted (or ICU) patient? </h4>
						<Slider
							onChange={(event, value)=>this.setState({ppe_per_patient_admitted_daily: value})}
			        defaultValue={this.props.config.ppe_per_patient_admitted_daily}
			        valueLabelDisplay="auto"
			        step={1}
							min={1}
	        		max={100}
			      />
					</div>
				</Container>
				<Padding height={20}/>
				<Button size="large" variant="contained" color="primary" onClick={()=>{
					this.props.updateConfig({
						total_num_units: this.state.total_num_units,
						prob_of_staff_infected: this.state.prob_of_staff_infected,
						prc_patients_needs_bed: this.state.prc_patients_needs_bed,
						prc_patients_needs_icu: this.state.prc_patients_needs_icu,
						staff_encounter_per_patient: this.state.staff_encounter_per_patient,
						num_patients_growth_basis: this.state.num_patients_growth_basis,
						num_patients_growth_factor: this.state.num_patients_growth_factor,
						bed_turnover_days: this.state.bed_turnover_days,
						icu_turnover_days: this.state.icu_turnover_days,
						quanrentine_days: this.state.quanrentine_days,
						ppe_per_patient_first_encounter: this.state.ppe_per_patient_first_encounter,
						ppe_per_patient_admitted_daily: this.state.ppe_per_patient_admitted_daily,
						mortality_rate: this.state.mortality_rate,
					})
				}}>Update Configuration</Button>
				<Padding height={20}/>
			</Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Config);

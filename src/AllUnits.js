import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions/app';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import EmergencyRoom from './EmergencyRoom'


class AllUnits extends Component {
	constructor(props) {
    super(props);

		this.state = {
			restart_id: this.props.app.restart_id,
			total_num_units: this.props.config.total_num_units,
			cols_per_row: 5,
		}

		this.initUnits = this.initUnits.bind(this)
  }

	componentWillMount() {
		this.initUnits(this.state.total_num_units)
  }

	componentDidMount() {
		if (window.innerWidth < 500) {
			this.setState({ cols_per_row: 1 });
		}
  }

	componentWillReceiveProps(nextProps) {
		if(nextProps.config.total_num_units != this.state.total_num_units) {
			this.initUnits(nextProps.config.total_num_units)
		}
		if(nextProps.app.restart_id != this.state.restart_id) {
			this.setState({restart_id: nextProps.app.restart_id})
			this.initUnits(nextProps.config.total_num_units)
		}
  }

	initUnits(total_num_units) {
		let units = {}
		for (let i = 0; i < total_num_units; i++) {
			let unit = {
				id: i,
				new_patients: 0,
				status: "Normal",
				status_info: []
			}
			units[i] = unit
		}
		this.setState({
			total_num_units,
		})
		this.props.resetUnits(units)
	}

	render() {
		return (
			<GridList cellHeight={520} spacing={20} cols={this.state.cols_per_row}>
        {Object.values(this.props.app.units).map(unit => (
					<GridListTile key={unit.id} cols={1}>
						<EmergencyRoom
							id={unit.id}
							init_status="Normal"
						/>
			    </GridListTile>
        ))}
      </GridList>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllUnits);

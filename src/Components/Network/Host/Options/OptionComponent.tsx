import { h, Component } from 'preact';
import linkState from 'linkstate';

export default class OptionComponent extends Component<{ Update: (g: any) => void; Data: any }, any> {
	constructor() {
		super();
	}

	componentWillMount() {
		this.setState(this.props.Data);
	}

	private Update(): void {
		this.props.Update(this.state);
	}

	render() {
		return (
			<div class="whiteText">
				<div class="custom-control custom-switch btn-group-space ">
					<input
						type="checkbox"
						class="custom-control-input"
						id="Angel"
						value={this.state.Angel ? 1 : 0}
						onChange={linkState(this, 'Angel')}
					/>
					<label class="custom-control-label" for="Angel">
						Angel
					</label>
				</div>
				<div class="custom-control custom-switch btn-group-space ">
					<input
						type="checkbox"
						class="custom-control-input"
						id="Witch"
						value={this.state.Witch ? 1 : 0}
						onChange={linkState(this, 'Witch')}
					/>
					<label class="custom-control-label" for="Witch">
						Witch
					</label>
				</div>
				<div class="custom-control custom-switch btn-group-space ">
					<input
						type="checkbox"
						class="custom-control-input"
						id="Seer"
						value={this.state.Seer ? 1 : 0}
						onChange={linkState(this, 'Seer')}
					/>
					<label class="custom-control-label" for="Seer">
						Seer
					</label>
				</div>
				<div class="input-group mb-3">
					<select
						id="daytime"
						class="custom-select"
						value={this.state.DaytimeDuration}
						onChange={linkState(this, 'DaytimeDuration')}
					>
						<option selected value="10">
							10 seconds
						</option>
						<option selected value="30">
							30 seconds
						</option>
						<option value="60">1 minute</option>
						<option value="90">1 minute 30 seconds</option>
						<option value="120">2 minutes</option>
					</select>
					<div class="input-group-append">
						<label class="input-group-text" for="inputGroupSelect02">
							Day time duration
						</label>
					</div>
				</div>
				<div class="input-group mb-3">
					<select
						id="daytime"
						class="custom-select"
						value={this.state.RedNightDuration}
						onChange={linkState(this, 'RedNightDuration')}
					>
						<option selected value="10">
							10 seconds
						</option>
						<option selected value="30">
							30 seconds
						</option>
						<option value="60">1 minute</option>
						<option value="90">1 minute 30 seconds</option>
						<option value="120">2 minutes</option>
					</select>
					<div class="input-group-append">
						<label class="input-group-text" for="inputGroupSelect02">
							Red night duration
						</label>
					</div>
				</div>
				<div class="input-group mb-3">
					<select
						id="daytime"
						class="custom-select"
						value={this.state.PurpleNightDuration}
						onChange={linkState(this, 'PurpleNightDuration')}
					>
						<option selected value="10">
							10 seconds
						</option>
						<option selected value="30">
							30 seconds
						</option>
						<option value="60">1 minute</option>
						<option value="90">1 minute 30 seconds</option>
						<option value="120">2 minutes</option>
					</select>
					<div class="input-group-append">
						<label class="input-group-text" for="inputGroupSelect02">
							Purple night duration
						</label>
					</div>
				</div>
				<button type="button" class="btn btn-primary btn-sm btn-danger" onClick={() => this.Update()}>
					BACK
				</button>
			</div>
		);
	}
}

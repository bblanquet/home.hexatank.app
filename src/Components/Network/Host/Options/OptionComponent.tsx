import { h, Component } from 'preact';
import linkState from 'linkstate';
import BlackButtonComponent from '../../../Common/Button/Stylish/BlackButtonComponent';

export default class OptionComponent extends Component<{ Update: (g: number) => void }, { IaNumber: number }> {
	private _isFirstRender = true;
	constructor() {
		super();
		this.setState({
			IaNumber: 0
		});
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillMount() {}

	private Update(e: number): void {
		this.setState({
			IaNumber: e
		});
		this.props.Update(e);
	}

	render() {
		return (
			<div class="whiteText">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
							IA
						</span>
					</div>
					<select
						id="daytime"
						class="custom-select"
						value={this.state.IaNumber}
						onChange={linkState(this, 'IaNumber')}
					>
						<option selected value="0">
							0
						</option>
						<option value="1">1</option>
						<option value="2">2</option>
					</select>
				</div>
				<BlackButtonComponent
					icon={'fas fa-undo-alt'}
					title={'Back'}
					isFirstRender={this._isFirstRender}
					callBack={() => this.Update(this.state.IaNumber)}
				/>
			</div>
		);
	}
}

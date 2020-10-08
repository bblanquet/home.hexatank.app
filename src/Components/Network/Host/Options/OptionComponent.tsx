import { h, Component } from 'preact';
import ButtonComponent from '../../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../../Common/Button/Stylish/ColorKind';
import Icon from '../../../Common/Icon/IconComponent';

export default class OptionComponent extends Component<{ Update: (g: number) => void }, { IaNumber: number }> {
	constructor() {
		super();
		this.setState({
			IaNumber: 0
		});
	}

	componentDidMount() {}

	componentWillMount() {}

	private Update(e: number): void {
		this.setState({
			IaNumber: e
		});
		this.props.Update(e);
	}

	render() {
		return (
			<div class="optionContainer absolute-center-middle-menu">
				<div class="title-container">Settings</div>
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
							onInput={(e: any) => {
								this.setState({ IaNumber: e.target.value });
							}}
						>
							<option selected value="0">
								0
							</option>
							<option value="1">1</option>
							<option value="2">2</option>
						</select>
					</div>
					<ButtonComponent color={ColorKind.Black} callBack={() => this.Update(this.state.IaNumber)}>
						<Icon Value="fas fa-undo-alt" /> Black
					</ButtonComponent>
				</div>
			</div>
		);
	}
}

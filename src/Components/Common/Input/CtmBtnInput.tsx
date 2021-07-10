import { h, Component } from 'preact';
import Icon from '../Icon/IconComponent';

export default class CtmBtnInput extends Component<
	{
		type: string;
		label: string;
		value: string;
		max: number;
		onInput: (e: any) => void;
		onClick: () => void;
		icon: string;
	},
	{}
> {
	render() {
		return (
			<div class="input-group mb-3" style="max-width:300px">
				<div class="input-group-prepend">
					<span class="input-group-text black-primary custom-btn-layout-1">{this.props.label}</span>
				</div>
				<input
					maxLength={this.props.max}
					type={this.props.type}
					value={this.props.value}
					onInput={(e: any) => this.props.onInput(e)}
					disabled={false}
					class="form-control"
					aria-label="Default"
				/>
				<div class="input-group-prepend" onClick={() => this.props.onClick()}>
					<span class="input-group-text" style="background-color:rgba(50, 155, 233, 1);color:white;">
						<Icon Value={this.props.icon} />
					</span>
				</div>
			</div>
		);
	}
}

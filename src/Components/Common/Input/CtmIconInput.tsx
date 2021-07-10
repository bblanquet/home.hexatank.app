import { h, Component } from 'preact';
import Icon from '../Icon/IconComponent';

export default class CtmIconInput extends Component<
	{ type: string; icon: string; value: any; isEditable: boolean; onInput: (e: any) => void },
	{}
> {
	render() {
		return (
			<div class="input-group mb-3" style="max-width:300px">
				<div class="input-group-prepend">
					<span class="input-group-text black-primary custom-btn-layout-1" id="inputGroup-sizing-default">
						<Icon Value={this.props.icon} />
					</span>
				</div>
				<input
					type={this.props.type}
					value={this.props.value}
					onInput={(e: any) => this.props.onInput(e)}
					disabled={!this.props.isEditable}
					class="form-control"
					aria-label="Default"
				/>
			</div>
		);
	}
}

import { h, Component } from 'preact';
import Icon from '../../Common/Icon/IconComponent';

export default class IconTextComponent extends Component<
	{ icon: string; value: string; isEditable: boolean; onInput: (e: any) => void },
	{}
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text black-primary custom-btn-layout-1" id="inputGroup-sizing-default">
						<Icon Value={this.props.icon} />
					</span>
				</div>
				<input
					type="text"
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

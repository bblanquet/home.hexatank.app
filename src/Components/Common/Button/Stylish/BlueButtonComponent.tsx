import { h, Component } from 'preact';
import Icon from '../../Icon/IconComponent';

export default class BlueButtonComponent extends Component<{ callBack: () => void; title: string; icon: string }, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="custom-border-layout-3 fit-content btn-space">
				<div class="custom-border-layout-2 fit-content">
					<div class="custom-blue-border fit-content">
						<div class="custom-blue-btn fit-content" onClick={() => this.props.callBack()}>
							<Icon Value={this.props.icon} />
							{this.props.title}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

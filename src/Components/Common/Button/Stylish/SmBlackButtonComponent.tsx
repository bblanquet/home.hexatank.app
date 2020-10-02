import { h, Component } from 'preact';

export default class SmBlackButtonComponent extends Component<{ callBack: () => void }, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="custom-sm-border-layout fit-content">
				<div class="custom-sm-black-border fit-content">
					<div class="custom-black-btn fit-content" onClick={this.props.callBack}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

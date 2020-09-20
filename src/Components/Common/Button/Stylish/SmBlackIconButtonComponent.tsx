import { h, Component } from 'preact';

export default class SmBlackIconButtonComponent extends Component<{ callBack: () => void; style: string }, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="custom-sm-border-layout fit-content very-small-left-margin">
				<div class="custom-sm-black-border fit-content">
					<div class="custom-black-btn fit-content " onClick={this.props.callBack}>
						<div class={`${this.props.style} max-width icon-space`} />
					</div>
				</div>
			</div>
		);
	}
}

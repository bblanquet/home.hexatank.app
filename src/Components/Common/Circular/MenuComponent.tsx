import { h, Component } from 'preact';
export default class MenuComponent extends Component<{ OnCancel: () => void }, {}> {
	constructor() {
		super();
	}

	componentWillUnmount() {}

	private CancelLogo() {
		return (
			<div class="max-space container-center">
				<div class="fill-cancel max-width standard-space" />
			</div>
		);
	}

	render() {
		return (
			<div class="circular-menu">
				<div
					onClick={() => this.props.OnCancel()}
					class="btn btn-dark btn-circular above-circular bouncing-up-animation"
				>
					{this.CancelLogo()}
				</div>
				{this.props.children}
			</div>
		);
	}
}

import { h, Component } from 'preact';

export default class PanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="logo-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-logo" />
				</div>
				{this.props.children}
			</div>
		);
	}
}

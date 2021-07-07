import { h, Component } from 'preact';

export default class Navbar extends Component<any, any> {
	render() {
		return (
			<div class="navbar nav-inner">
				<div
					class="d-flex justify-content-start"
					style="flex-direction:row;align-content:space-between;flex-direction:row;align-items:center;"
				>
					<div class="x-sm-logo-container">
						<div class="fill-logo-back-container">
							<div class="x-sm-fill-logo-back spin-fade" />
						</div>
						<div class="fill-tank-logo slow-bounce" />
						<div class="fill-logo" />
					</div>
				</div>
				<div class="d-flex justify-content-start" style="flex-direction: row; align-items: center;">
					{this.props.children}
				</div>
			</div>
		);
	}
}

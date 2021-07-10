import { h, Component } from 'preact';
import Line from './Line';

export default class Navbar extends Component<any, any> {
	render() {
		return (
			<div class="navbar nav-inner">
				<Line>
					<div class="x-sm-logo-container">
						<div class="fill-logo-back-container">
							<div class="x-sm-fill-logo-back spin-fade" />
						</div>
						<div class="fill-tank-logo slow-bounce" />
						<div class="fill-logo" />
					</div>
				</Line>
				<div class="d-flex justify-content-start" style="flex-direction: row; align-items: center;">
					{this.props.children}
				</div>
			</div>
		);
	}
}

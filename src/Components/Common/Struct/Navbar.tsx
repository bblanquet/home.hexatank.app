import { h, Component } from 'preact';
import Line from './Line';

export default class Navbar extends Component<any, any> {
	render() {
		return (
			<div class="navbar nav-inner one-edge-shadow">
				<div class="x-sm-logo-container">
					<div class="fill-logo-back-container">
						<div class="x-sm-fill-logo-back spin-fade" />
					</div>
					<div class="fill-tank-logo slow-bounce" />
					<div class="fill-logo" />
				</div>
				<Line>{this.props.children}</Line>
			</div>
		);
	}
}

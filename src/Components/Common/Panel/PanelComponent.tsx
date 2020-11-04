import { h, Component } from 'preact';
import NavbarComponent from '../Navbar/NavbarComponent';

export default class PanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<NavbarComponent>
				<div class="generalContainer absolute-center-middle">
					<div class="logo-container">
						<div class="fill-logo-back-container">
							<div class="fill-logo-back spin-fade" />
						</div>
						<div class="fill-logo" />
					</div>
					{this.props.children}
				</div>
			</NavbarComponent>
		);
	}
}

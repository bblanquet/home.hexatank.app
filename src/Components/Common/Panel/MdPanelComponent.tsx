import { h, Component } from 'preact';
import NavbarComponent from '../Navbar/NavbarComponent';

export default class MdPanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<NavbarComponent>
				<div class="container-column-center-horizontal">
					<div class="logo-container">
						<div class="fill-logo-back-container">
							<div class="fill-logo-back spin-fade" />
						</div>
						<div class="fill-logo" />
					</div>
					<div style="margin-top:-20px">{this.props.children}</div>
				</div>
			</NavbarComponent>
		);
	}
}

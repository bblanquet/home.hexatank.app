import { h, Component } from 'preact';
import Analyze from '../../Analyze/AnalyzeComponent';
import NavbarComponent from '../Navbar/NavbarComponent';

export default class MdPanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<Analyze>
				<NavbarComponent>
					<div class="container-column-center-horizontal">
						<div class="logo-container">
							<div class="fill-logo-back-container">
								<div class="fill-logo-back spin-fade" />
							</div>
							<div class="fill-tank-logo slow-bounce" />
							<div class="fill-logo" />
						</div>
						<div>{this.props.children}</div>
					</div>
				</NavbarComponent>
			</Analyze>
		);
	}
}

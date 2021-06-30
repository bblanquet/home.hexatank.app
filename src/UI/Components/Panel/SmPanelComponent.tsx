import { h, Component } from 'preact';
import PageAnalyser from '../PageAnalyser';
import NavbarComponent from '../NavbarComponent';

export default class SmPanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<NavbarComponent>
					<div class="container-column-center-horizontal">
						<div class="sm-logo-container">
							<div class="fill-logo-back-container">
								<div class="sm-fill-logo-back spin-fade" />
							</div>
							<div class="fill-tank-logo slow-bounce" />
							<div class="fill-logo" />
						</div>
						{this.props.children}
					</div>
				</NavbarComponent>
			</PageAnalyser>
		);
	}
}

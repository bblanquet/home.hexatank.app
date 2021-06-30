import { h, Component } from 'preact';
import PageAnalyser from '../../Components/PageAnalyser';
import NavbarComponent from '../NavbarComponent';

export default class PanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<NavbarComponent>
					<div class="generalContainer absolute-center-middle">
						<div class="logo-container">
							<div class="fill-logo-back-container">
								<div class="fill-logo-back spin-fade" />
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

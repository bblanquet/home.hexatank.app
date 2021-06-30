import { h, Component } from 'preact';
import PageAnalyser from '../../Components/PageAnalyser';
import NavbarComponent from '../NavbarComponent';

export default class MdPanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
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
			</PageAnalyser>
		);
	}
}

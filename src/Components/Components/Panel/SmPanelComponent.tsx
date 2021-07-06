import { h, Component } from 'preact';
import PageAnalyser from '../PageAnalyser';
import StatBar from '../StatBar';
import Background from '../Background';

export default class SmPanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<Background>
					<StatBar />
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
				</Background>
			</PageAnalyser>
		);
	}
}

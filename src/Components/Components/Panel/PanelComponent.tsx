import { h, Component } from 'preact';
import PageAnalyser from '../PageAnalyser';
import Background from '../Background';
import StatBar from '../StatBar';

export default class PanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<Background>
					<StatBar />
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
				</Background>
			</PageAnalyser>
		);
	}
}

import { h, Component } from 'preact';
import PageAnalyser from '../PageAnalyser';
import StatBar from '../StatBar';
import Background from '../Background';

export default class MdPanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<PageAnalyser>
				<Background>
					<StatBar />
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
				</Background>
			</PageAnalyser>
		);
	}
}

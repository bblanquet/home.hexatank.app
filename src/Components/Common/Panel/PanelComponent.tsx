import { h, Component } from 'preact';

export default class PanelComponent extends Component<any, any> {
	constructor() {
		super();
	}

	render() {
		return (
			<div>
				<nav class="navbar navbar-dark dark">
					<div class="d-flex justify-content-start">
						<div class="icon-badge" style="margin-right:5px" />
						<div class="progress" style="width:50px;height:25px; border: 4px solid rgb(198, 198, 198)">
							<div
								class="progress-bar bg-danger"
								role="progressbar"
								style={'width:' + 30 + '%'}
								aria-valuenow={30}
								aria-valuemin="0"
								aria-valuemax="100"
							/>
						</div>
						<div class="icon-badge" style="margin-right:5px;margin-left:5px" />
						<div class="progress" style="width:50px;height:25px; border: 4px solid rgb(198, 198, 198)">
							<div
								class="progress-bar bg-dark"
								role="progressbar"
								style={'width:' + 70 + '%'}
								aria-valuenow={30}
								aria-valuemin="0"
								aria-valuemax="100"
							/>
						</div>
					</div>
				</nav>
				<div class="generalContainer absolute-center-middle">
					<div class="logo-container">
						<div class="fill-logo-back-container">
							<div class="fill-logo-back spin-fade" />
						</div>
						<div class="fill-logo" />
					</div>
					{this.props.children}
				</div>
			</div>
		);
	}
}

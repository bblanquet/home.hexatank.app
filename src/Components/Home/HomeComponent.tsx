import { h, Component } from 'preact';
import { route } from 'preact-router';
import { IconProvider } from '../IconProvider';

export default class HomeComponent extends Component<any, any> {
	constructor() {
		super();
	}
	private _isFirstRender = true;

	private ToSinglePlayer(e: any): void {
		route('/SinglePlayer', true);
	}

	private ToCampaign(e: any): void {
		route('/Campaign', true);
	}

	private ToHost(e: any): void {
		route('/OffHost', true);
	}

	private ToJoin(e: any): void {
		route('/OffJoin', true);
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillUnmount() {}

	render() {
		return (
			<div class="generalContainer absolute-center-middle">
				<div class="containerStyle ">
					<div class="fill-content-camouflage fill-border">
						<div class="title-container fit-content">Program 6</div>
						<div class="black-line long" />
						<div class="text-center">
							<div class="fill-body-tank">
								<div class="fill-top-tank spin " />
							</div>

							<div class="btn-group-vertical ">
								<button
									type="button"
									class="btn btn-simple-black rounded-pill"
									onClick={this.ToCampaign}
								>
									{IconProvider.GetIcon(this._isFirstRender, 'fas fa-dungeon')} Campaign
								</button>
								<button
									type="button"
									class="btn btn-simple-black rounded-pill"
									onClick={this.ToSinglePlayer}
								>
									{IconProvider.GetIcon(this._isFirstRender, 'fas fa-gamepad')} Single player
								</button>
								<div class="btn-group" role="group">
									<button
										id="btnGroupDrop1"
										type="button"
										class="btn btn-simple-black rounded-pill dropdown-toggle"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false"
									>
										{IconProvider.GetIcon(this._isFirstRender, 'fas fa-network-wired')} Multiplayers
									</button>
									<div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
										<a class="dropdown-item" onClick={this.ToHost}>
											Host
										</a>
										<a class="dropdown-item" onClick={this.ToJoin}>
											Join
										</a>
									</div>
								</div>
								<button type="button" class="btn btn-simple-black rounded-pill">
									{IconProvider.GetIcon(this._isFirstRender, 'fas fa-phone-square')} Contact
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

import { h, Component } from 'preact';
import { route } from 'preact-router';
import { ComponentsHelper } from '../ComponentsHelper';

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
				<div class="logo-container">
					<div class="fill-logo-back-container">
						<div class="fill-logo-back spin-fade" />
					</div>
					<div class="fill-logo" />
				</div>
				<div class="container-center">
					{ComponentsHelper.GetRedButton(this._isFirstRender, 'fas fa-dungeon', 'Campaign', this.ToCampaign)}
					{ComponentsHelper.GetRedButton(this._isFirstRender, 'fas fa-gamepad', 'Play', this.ToSinglePlayer)}
					{ComponentsHelper.GetRedButton(
						this._isFirstRender,
						'fas fa-network-wired',
						'Multiplayers',
						this.ToHost
					)}
					{ComponentsHelper.GetRedButton(
						this._isFirstRender,
						'fas fa-phone-square',
						'Contact',
						this.ToCampaign
					)}
				</div>
			</div>
		);
	}
}

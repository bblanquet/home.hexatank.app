import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import DropDownButtonComponent from '../Common/Button/Stylish/DropDownButtonComponent';
import { ButtonOption } from '../Common/Button/ButtonOption';

export default class HomeComponent extends Component<any, any> {
	constructor() {
		super();
	}
	private _isFirstRender = true;

	private ToSinglePlayer(): void {
		route('/SinglePlayer', true);
	}

	private ToCampaign(): void {
		route('/Campaign', true);
	}

	private ToHost(): void {
		route('/CreatingHost', true);
	}

	private ToGuest(): void {
		route('/OffJoin', true);
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillUnmount() {}

	render() {
		return (
			<PanelComponent>
				<div class="container-center">
					<RedButtonComponent
						icon={'fas fa-dungeon'}
						title={'Campaign'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.ToCampaign()}
					/>
					<RedButtonComponent
						icon={'fas fa-gamepad'}
						title={'Play'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.ToSinglePlayer()}
					/>
					<DropDownButtonComponent
						icon={'fas fa-network-wired'}
						title={'Multiplayers'}
						isFirstRender={this._isFirstRender}
						items={[
							new ButtonOption('Guest', () => this.ToGuest()),
							new ButtonOption('Host', () => this.ToHost())
						]}
					/>
					<RedButtonComponent
						icon={'fas fa-phone-square'}
						title={'Contact'}
						isFirstRender={this._isFirstRender}
						callBack={() => this.ToCampaign()}
					/>
				</div>
			</PanelComponent>
		);
	}
}

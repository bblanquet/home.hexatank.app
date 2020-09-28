import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import BlueButtonComponent from '../Common/Button/Stylish/BlueButtonComponent';
import DropDownButtonComponent from '../Common/Button/Stylish/DropDownButtonComponent';
import { ButtonOption } from '../Common/Button/ButtonOption';

export default class HomeComponent extends Component<any, any> {
	constructor() {
		super();
	}

	private ToSinglePlayer(): void {
		route('/SinglePlayer', true);
	}

	private ToCampaign(): void {
		route('/Campaign', true);
	}

	private ToHost(): void {
		route('/CreatingHost', true);
	}

	private ToRecord(): void {
		route('/Playback', true);
	}

	private ToGuest(): void {
		route('/OffJoin', true);
	}

	componentDidMount() {}

	componentWillUnmount() {}

	render() {
		return (
			<PanelComponent>
				<div class="container-center">
					<RedButtonComponent icon={'fas fa-dungeon'} title={'Campaign'} callBack={() => this.ToCampaign()} />
					<RedButtonComponent icon={'fas fa-gamepad'} title={'Play'} callBack={() => this.ToSinglePlayer()} />
					<DropDownButtonComponent
						icon={'fas fa-network-wired'}
						title={'Multiplayers'}
						items={[
							new ButtonOption('Guest', () => this.ToGuest()),
							new ButtonOption('Host', () => this.ToHost())
						]}
					/>
					<BlueButtonComponent icon={'fas fa-video'} title={'Record'} callBack={() => this.ToRecord()} />
					<BlackButtonComponent
						icon={'fas fa-phone-square'}
						title={'Contact'}
						callBack={() => this.ToCampaign()}
					/>
				</div>
			</PanelComponent>
		);
	}
}

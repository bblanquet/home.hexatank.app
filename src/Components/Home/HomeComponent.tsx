import { h, Component } from 'preact';
import { route } from 'preact-router';
import PanelComponent from '../Common/Panel/PanelComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import DropDownButtonComponent from '../Common/Button/Stylish/DropDownButtonComponent';
import Redirect from '../Redirect/RedirectComponent';
import { ButtonOption } from '../Common/Button/ButtonOption';
import Icon from '../Common/Icon/IconComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';

export default class HomeComponent extends Component<any, any> {
	constructor() {
		super();
	}

	private ToSinglePlayer(): void {
		route('/SinglePlayer', true);
	}

	private ToCampaign(): void {
		route('/Training', true);
	}

	private ToHost(): void {
		route('/CreatingHost', true);
	}

	private ToRecord(): void {
		route('/Record', true);
	}

	private ToGuest(): void {
		route('/OffJoin', true);
	}

	private ToBadge(): void {
		route('/Badge', true);
	}

	componentDidMount() {}

	componentWillUnmount() {}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<div class="container-center">
						<ButtonComponent color={ColorKind.Red} callBack={() => this.ToCampaign()}>
							<Icon Value="fas fa-dungeon" /> Campaign
						</ButtonComponent>
						<ButtonComponent color={ColorKind.Red} callBack={() => this.ToSinglePlayer()}>
							<Icon Value="fas fa-gamepad" /> Play
						</ButtonComponent>
						<DropDownButtonComponent
							icon={'fas fa-network-wired'}
							title={'Multiplayers'}
							items={[
								new ButtonOption('Guest', () => this.ToGuest()),
								new ButtonOption('Host', () => this.ToHost())
							]}
						/>
						<ButtonComponent color={ColorKind.Blue} callBack={() => this.ToRecord()}>
							<Icon Value="fas fa-video" /> Record
						</ButtonComponent>
						<ButtonComponent color={ColorKind.Black} callBack={() => this.ToBadge()}>
							<Icon Value="fas fa-award" /> Badge
						</ButtonComponent>
					</div>
				</PanelComponent>
			</Redirect>
		);
	}
}

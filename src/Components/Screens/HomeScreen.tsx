import { h, Component } from 'preact';
import { route } from 'preact-router';
import MdPanelComponent from '../Components/Panel/MdPanelComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import DropDownButtonComponent from '../Common/Button/Stylish/DropDownButtonComponent';
import { ButtonOption } from '../Common/Button/ButtonOption';
import Icon from '../Common/Icon/IconComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Redirect from '../Components/Redirect';

export default class HomeScreen extends Component<any, any> {
	constructor() {
		super();
	}

	private ToSinglePlayer(): void {
		route('{{sub_path}}SinglePlayer', true);
	}

	private ToCampaign(): void {
		route('{{sub_path}}Training', true);
	}

	private ToHost(): void {
		route('{{sub_path}}CreatingHost', true);
	}

	private ToRecord(): void {
		route('{{sub_path}}Profil', true);
	}

	private ToGuest(): void {
		route('{{sub_path}}OffJoin', true);
	}

	private ToBadge(): void {
		route('{{sub_path}}Badge', true);
	}

	private ToMonitoring(): void {
		route('{{sub_path}}Customer', true);
	}
	render() {
		return (
			<Redirect>
				<MdPanelComponent>
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
						<ButtonComponent color={ColorKind.Black} callBack={() => this.ToRecord()}>
							<Icon Value="fas fa-user-circle" /> Profil
						</ButtonComponent>
						<ButtonComponent color={ColorKind.Black} callBack={() => this.ToBadge()}>
							<Icon Value="fas fa-award" /> Badge
						</ButtonComponent>
						<ButtonComponent color={ColorKind.Blue} callBack={() => this.ToMonitoring()}>
							<Icon Value="fab fa-watchman-monitoring" /> Monitoring
						</ButtonComponent>
					</div>
				</MdPanelComponent>
			</Redirect>
		);
	}
}

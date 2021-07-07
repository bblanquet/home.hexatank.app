import { h, Component } from 'preact';
import { route } from 'preact-router';
import MdPanel from '../Components/Panel/MdPanel';
import Btn from '../Common/Button/Stylish/Btn';
import DropDownBtn from '../Common/Button/Stylish/DropDownBtn';
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
				<MdPanel>
					<div class="container-center">
						<Btn color={ColorKind.Red} callBack={() => this.ToCampaign()}>
							<Icon Value="fas fa-dungeon" /> Campaign
						</Btn>
						<Btn color={ColorKind.Red} callBack={() => this.ToSinglePlayer()}>
							<Icon Value="fas fa-gamepad" /> Play
						</Btn>
						<DropDownBtn
							icon={'fas fa-network-wired'}
							title={'Multiplayers'}
							items={[
								new ButtonOption('Guest', () => this.ToGuest()),
								new ButtonOption('Host', () => this.ToHost())
							]}
						/>
						<Btn color={ColorKind.Black} callBack={() => this.ToRecord()}>
							<Icon Value="fas fa-user-circle" /> Profil
						</Btn>
						{/* <ButtonComponent color={ColorKind.Black} callBack={() => this.ToBadge()}>
							<Icon Value="fas fa-award" /> Badge
						</ButtonComponent> */}
						<Btn color={ColorKind.Blue} callBack={() => this.ToMonitoring()}>
							<Icon Value="fab fa-watchman-monitoring" /> Monitoring
						</Btn>
					</div>
				</MdPanel>
			</Redirect>
		);
	}
}

import { h, Component } from 'preact';
import { route } from 'preact-router';
import Btn from '../Common/Button/Stylish/Btn';
import DropDownBtn from '../Common/Button/Stylish/DropDownBtn';
import { ButtonOption } from '../Common/Button/ButtonOption';
import Icon from '../Common/Icon/IconComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Visible from '../Common/Struct/Visible';
import { Env } from '../../Utils/Env';
import Panel from '../Components/Panel/Panel';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { Singletons, SingletonKey } from '../../Singletons';
import Switch from '../Common/Struct/Switch';
import Grid from '../Common/Grid/GridComponent';
import Notification from '../Components/Notification';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import { IVersionService } from '../../Services/Version/IVersionService';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { NotificationState } from '../Model/NotificationState';
import { Home } from '../Model/Dialogues';
import { LogKind } from '../../Utils/Logger/LogKind';
export default class HomeScreen extends Component<
	any,
	{ IsMenu: boolean; Notification: LiteEvent<NotificationState> }
> {
	private _playerProfile: IPlayerProfileService;
	private _audio: IAudioService;
	private _version: IVersionService;
	constructor() {
		super();
		this._playerProfile = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._audio = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._version = Singletons.Load<IVersionService>(SingletonKey.Version);
	}

	componentDidMount() {
		this._audio.SetMute(this._playerProfile.GetProfil().IsMute);
		this._audio.PlayLoungeMusic();
		this.setState({
			IsMenu: true,
			Notification: new LiteEvent<NotificationState>()
		});
		if (this._playerProfile.GetPoints() < 30) {
			setTimeout(() => {
				this.state.Notification.Invoke(this, new NotificationState(LogKind.message, Home));
			}, 300);
		}
	}

	render() {
		return (
			<Panel
				content={
					<Switch
						isLeft={this.state.IsMenu}
						left={
							<div class="container-center">
								<Btn Color={ColorKind.Red} OnClick={() => route('{{sub_path}}Green', true)}>
									<Icon Value="fas fa-dungeon" /> Campaign
								</Btn>
								<Btn Color={ColorKind.Red} OnClick={() => route('{{sub_path}}SinglePlayer', true)}>
									<Icon Value="fas fa-gamepad" /> Play
								</Btn>
								<DropDownBtn
									icon={'fas fa-network-wired'}
									title={'Multiplayers'}
									items={[
										new ButtonOption('Guest', () => route('{{sub_path}}Guest', true)),
										new ButtonOption('Host', () => route('{{sub_path}}Host', true))
									]}
								/>
								<Btn Color={ColorKind.Black} OnClick={() => route('{{sub_path}}Profil', true)}>
									<Icon Value="fas fa-user-circle" /> Profile
								</Btn>
								<Visible isVisible={!Env.IsPrd()}>
									<Btn Color={ColorKind.Blue} OnClick={() => route('{{sub_path}}Customer', true)}>
										<Icon Value="fab fa-watchman-monitoring" /> Monitoring
									</Btn>
								</Visible>
								<Notification OnNotification={this.state.Notification} />
							</div>
						}
						right={
							<Grid
								left={
									<thead>
										<tr class="d-flex">
											<th>Versions</th>
										</tr>
									</thead>
								}
								right={
									<tbody>
										<tr class="d-flex flex-column ">
											{this._version.GetVersions().map((version) => (
												<td>
													<span style="font-weight:bold">
														<Icon Value="fas fa-truck" /> {version.Name}
													</span>
													{version.Features.map((feature) => <div>&#183; {feature}</div>)}
													<div style="font-weight:bold">Bug hunters</div>
													{version.Hunters.map((feature) => <div>&#183; {feature}</div>)}
												</td>
											))}
										</tr>
									</tbody>
								}
							/>
						}
					/>
				}
				footer={
					<div class="navbar nav-inner" style="font-weight:bold;">
						<div>v {this._version.GetVersionNumber()}</div>
						<SmActiveBtn
							left={<Icon Value="fas fa-bug" />}
							right={<Icon Value="fas fa-bug" />}
							isActive={this.state.IsMenu}
							leftColor={ColorKind.Red}
							rightColor={ColorKind.Black}
							OnClick={() => {
								this.setState({ IsMenu: !this.state.IsMenu });
							}}
						/>
					</div>
				}
			/>
		);
	}
}

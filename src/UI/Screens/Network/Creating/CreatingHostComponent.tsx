import { Component, h } from 'preact';
import { route } from 'preact-router';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';
import { NetworkObserver } from '../../../../Core/Utils/Events/NetworkObserver';
import { LogKind } from '../../../../Core/Utils/Logger/LogKind';
import { NetworkMessage } from '../../../../Network/Message/NetworkMessage';
import { PacketKind } from '../../../../Network/Message/PacketKind';
import { IServerSocket } from '../../../../Network/Socket/Server/IServerSocket';
import { IOnlineService } from '../../../../Services/Online/IOnlineService';
import { IPlayerProfilService } from '../../../../Services/PlayerProfil/IPlayerProfilService';
import { ISocketService } from '../../../../Services/Socket/ISocketService';
import { Singletons, SingletonKey } from '../../../../Singletons';
import ButtonComponent from '../../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../../Common/Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../../../Common/Button/Stylish/SmActiveButtonComponent';
import SmButtonComponent from '../../../Common/Button/Stylish/SmButtonComponent';
import Icon from '../../../Common/Icon/IconComponent';
import MdPanelComponent from '../../../Components/Panel/MdPanelComponent';
import Redirect from '../../../Components/RedirectComponent';
import Visible from '../../../Components/VisibleComponent';
import { Usernames } from '../Names';
import { CreatingHostState } from './CreatingHostState';
import { NotificationItem } from '../../../Components/Notification/NotificationItem';
import Notification from '../../../Components/Notification/NotificationComponent';
import InputComponent from '../../../Common/Text/TextComponent';

export default class CreatingHostComponent extends Component<any, CreatingHostState> {
	private _profilService: IPlayerProfilService;
	private _socket: IServerSocket;
	private _obs: NetworkObserver[];
	private _onNotification: LiteEvent<NotificationItem> = new LiteEvent<NotificationItem>();

	constructor() {
		super();
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this._socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this.setState({
			RoomName: `${this._profilService.GetProfil().LastPlayerName}'s room`,
			PlayerName: this._profilService.GetProfil().LastPlayerName,
			Password: '',
			HasPassword: false
		});
		this._obs = [
			new NetworkObserver(PacketKind.Exist, this.OnExist.bind(this)),
			new NetworkObserver(PacketKind.connect_error, this.OnError.bind(this))
		];

		this._socket.On(this._obs);
	}

	private OnExist(message: NetworkMessage<{ Exist: boolean; RoomName: string }>): void {
		if (!message.Content.Exist) {
			Singletons.Load<IOnlineService>(SingletonKey.Online).Register(
				this.state.PlayerName,
				this.state.RoomName,
				this.state.Password === undefined ? '' : this.state.Password,
				this.state.HasPassword === undefined ? false : this.state.HasPassword,
				true
			);
			route('{{sub_path}}Lobby', true);
		} else {
			this._onNotification.Invoke(
				this,
				new NotificationItem(LogKind.warning, `${message.Content.RoomName} is already used.`)
			);
		}
	}

	private OnError(message: NetworkMessage<any>): void {
		this._onNotification.Invoke(
			this,
			new NotificationItem(LogKind.error, `OOPS Server doesn't seem to be running.`)
		);
	}

	componentWillUnmount(): void {
		this._socket.Off(this._obs);
	}

	render() {
		return (
			<Redirect>
				<Notification OnNotification={this._onNotification}>
					<MdPanelComponent>
						<div class="container-center-horizontal" style="margin-bottom:10px">
							<SmButtonComponent
								callBack={() => {
									const username = Usernames[Math.round(Math.random() * Usernames.length - 1)];
									this.setState({
										PlayerName: username,
										RoomName: `${username}'s room`
									});
								}}
								color={ColorKind.Blue}
							>
								<Icon Value="fas fa-random" />
							</SmButtonComponent>
							<div class="space-out" />
							<SmActiveButtonComponent
								left={
									<span>
										<Icon Value="fas fa-lock-open" />
									</span>
								}
								right={
									<span>
										<Icon Value="fas fa-lock" />
									</span>
								}
								leftColor={ColorKind.Black}
								rightColor={ColorKind.Yellow}
								isActive={this.state.HasPassword}
								callBack={() => {
									this.setState({
										HasPassword: !this.state.HasPassword
									});
								}}
							/>
						</div>

						<InputComponent
							max={15}
							value={this.state.PlayerName}
							label={'Name'}
							type={'text'}
							isEditable={true}
							onInput={(e: any) => {
								this.setState({ PlayerName: (e.target.value as string).substring(0, 15) });
							}}
						/>
						<InputComponent
							max={15}
							type={'text'}
							value={this.state.RoomName}
							label={'Room name'}
							isEditable={true}
							onInput={(e: any) => {
								this.setState({ RoomName: (e.target.value as string).substring(0, 15) });
							}}
						/>
						<div class="container-center-horizontal">
							<Visible isVisible={this.state.HasPassword}>
								<InputComponent
									max={15}
									type={'text'}
									value={this.state.Password}
									label={'Password'}
									isEditable={true}
									onInput={(e: any) => {
										this.setState({ Password: (e.target.value as string).substring(0, 15) });
									}}
								/>
							</Visible>
						</div>
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this.Back();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
							<ButtonComponent
								callBack={() => {
									this.Start();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="far fa-play-circle" /> Start
							</ButtonComponent>
						</div>
					</MdPanelComponent>
				</Notification>
			</Redirect>
		);
	}

	private Start(): void {
		this._socket.Emit(NetworkMessage.New(PacketKind.Exist, { RoomName: this.state.RoomName }));
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}
}

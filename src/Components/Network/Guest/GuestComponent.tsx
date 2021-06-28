import { h, Component } from 'preact';
import { route } from 'preact-router';
import Notification from '../../Common/Notification/NotificationComponent';
import { PacketKind } from '../../../Network/Message/PacketKind';
import InputComponent from '../../Common/Text/TextComponent';
import IconInputComponent from '../../Common/Text/IconTextComponent';
import SmPanelComponent from '../../Common/Panel/SmPanelComponent';
import GridComponent from '../../Common/Grid/GridComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IOnlineService } from '../../../Services/Online/IOnlineService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import { Usernames } from '../Names';
import { RoomInfo } from './RoomInfo';
import Visible from '../../Common/Visible/VisibleComponent';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { ISocketService } from '../../../Services/Socket/ISocketService';
import { NetworkObserver } from '../../../Core/Utils/Events/NetworkObserver';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { IServerSocket } from '../../../Network/Socket/Server/IServerSocket';
import { LogKind } from '../../../Core/Utils/Logger/LogKind';
import { NotificationItem } from '../../Common/Notification/NotificationItem';
import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';

export default class GuestComponent extends Component<
	any,
	{
		Rooms: RoomInfo[];
		DisplayableRooms: RoomInfo[];
		PlayerName: string;
		filter: string;
		Password: string;
	}
> {
	private _socket: IServerSocket;
	private _profilService: IPlayerProfilService;
	private _obs: NetworkObserver[];
	private _onNotification: LiteEvent<NotificationItem> = new LiteEvent<NotificationItem>();

	constructor() {
		super();
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);

		this.setState({
			Rooms: new Array<RoomInfo>(),
			DisplayableRooms: new Array<RoomInfo>(),
			PlayerName: this._profilService.GetProfil().LastPlayerName,
			filter: '',
			Password: ''
		});

		this._obs = [
			new NetworkObserver(PacketKind.Available, this.OnAvailable.bind(this)),
			new NetworkObserver(PacketKind.Rooms, this.OnRoom.bind(this)),
			new NetworkObserver(PacketKind.connect, this.OnConnect.bind(this)),
			new NetworkObserver(PacketKind.Password, this.OnPassword.bind(this)),
			new NetworkObserver(PacketKind.connect_error, this.OnConnectError.bind(this))
		];
		this._socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._socket.On(this._obs);
	}

	componentDidUpdate() {
		if (this.state.filter && 0 < this.state.filter.length) {
			const newDisplayed = this.state.Rooms.filter((e) =>
				e.Name.toLowerCase().includes(this.state.filter.toLowerCase())
			);
			if (newDisplayed.length !== this.state.DisplayableRooms.length) {
				this.setState({
					DisplayableRooms: newDisplayed
				});
			}
		} else if (this.state.DisplayableRooms !== this.state.Rooms && this.state.filter.length === 0) {
			this.setState({
				DisplayableRooms: this.state.Rooms
			});
		}
	}

	componentWillUnmount(): void {
		this._socket.Off(this._obs);
	}

	render() {
		return (
			<Redirect>
				<Notification OnNotification={this._onNotification}>
					<SmPanelComponent>
						<div class="container-center-horizontal">
							<InputComponent
								max={15}
								type={'text'}
								value={this.state.PlayerName}
								label={'Name'}
								isEditable={true}
								onInput={(e: any) => {
									if (e.target.value) {
										this.setState({ PlayerName: (e.target.value as string).substring(0, 15) });
									} else {
										this.setState({ PlayerName: '' });
									}
								}}
							/>
							<div class="space-out" />
							<SmButtonComponent
								callBack={() => {
									this.setState({
										PlayerName: Usernames[Math.round(Math.random() * Usernames.length - 1)]
									});
								}}
								color={ColorKind.Blue}
							>
								<Icon Value="fas fa-random" />
							</SmButtonComponent>
						</div>
						<IconInputComponent
							type={'text'}
							value={this.state.filter}
							icon={'fas fa-filter'}
							isEditable={true}
							onInput={(e: any) => {
								if (e.target.value) {
									this.setState({
										filter: e.target.value
									});
								} else {
									this.setState({
										filter: ''
									});
								}
							}}
						/>
						<IconInputComponent
							type={'text'}
							value={this.state.Password}
							icon={'fas fa-lock'}
							isEditable={true}
							onInput={(e: any) => {
								if (e.target.value) {
									this.setState({
										Password: e.target.value
									});
								} else {
									this.setState({
										Password: ''
									});
								}
							}}
						/>
						<GridComponent
							left={''}
							right={this.state.Rooms.length === 0 ? this.EmptyGridContent() : this.GridContent()}
						/>
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
									this.Refresh();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-sync-alt" /> Refresh
							</ButtonComponent>
						</div>
					</SmPanelComponent>
				</Notification>
			</Redirect>
		);
	}

	private EmptyGridContent() {
		return (
			<tbody>
				<tr class="d-flex">
					<td class="align-self-center">No room available...</td>
				</tr>
			</tbody>
		);
	}

	private GridContent() {
		return (
			<tbody>
				{this.state.DisplayableRooms.map((roomInfo) => {
					return (
						<tr class="d-flex">
							<td class="align-self-center">
								<SmButtonComponent callBack={() => this.Join(roomInfo.Name)} color={ColorKind.Black}>
									{'Join'}
								</SmButtonComponent>
							</td>
							<td class="align-self-center">
								<Visible isVisible={roomInfo.HasPassword}>
									<Icon Value="fas fa-lock" />
								</Visible>
								{` ${roomInfo.Name}`}
							</td>
							<td class="align-self-center">
								{roomInfo.PlayerCount}/{roomInfo.Count}
							</td>
						</tr>
					);
				})}
			</tbody>
		);
	}

	private Join(roomName: string): void {
		this._socket.Emit(
			NetworkMessage.New<any>(PacketKind.Password, { Password: this.state.Password, RoomName: roomName })
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}

	private Refresh() {
		this._socket.Emit(NetworkMessage.New(PacketKind.Rooms, {}));
	}

	public OnAvailable(message: NetworkMessage<{ IsAvailable: boolean; RoomName: string }>): void {
		if (message.Content.IsAvailable) {
			Singletons.Load<IOnlineService>(SingletonKey.Online).Register(
				this.state.PlayerName,
				message.Content.RoomName,
				this.state.Password,
				this.state.Password !== null && this.state.Password !== '',
				false
			);
			route('{{sub_path}}Lobby', true);
		} else {
			this._onNotification.Invoke(
				this,
				new NotificationItem(
					LogKind.warning,
					`${this.state.PlayerName} is already used in ${message.Content.RoomName}`
				)
			);
		}
	}

	private OnRoom(message: NetworkMessage<RoomInfo[]>): void {
		this.setState({
			Rooms: message.Content
		});
	}

	private OnConnect(m: NetworkMessage<any>): void {
		this._socket.Emit(NetworkMessage.New<any>(PacketKind.Rooms, {}));
	}

	private OnPassword(m: NetworkMessage<{ Password: boolean; RoomName: string }>): void {
		if (m.Content.Password) {
			this._socket.Emit(
				NetworkMessage.New<any>(PacketKind.Available, {
					RoomName: m.Content.RoomName,
					PlayerName: this.state.PlayerName
				})
			);
		} else {
			this._onNotification.Invoke(
				this,
				new NotificationItem(
					LogKind.warning,
					`${this.state.Password} doesn't match ${m.Content.RoomName}'s password`
				)
			);
		}
	}

	private OnConnectError(m: any): void {
		this._onNotification.Invoke(this, new NotificationItem(LogKind.error, `Server doesn't seem to be running.`));
	}
}

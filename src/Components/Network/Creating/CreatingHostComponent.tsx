import { Component, h } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import { CreatingHostState } from './CreatingHostState';
import { PacketKind } from '../../../Network/Message/PacketKind';
import MdPanelComponent from '../../Common/Panel/MdPanelComponent';
import TextComponent from '../../Common/Text/TextComponent';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IOnlineService } from '../../../Services/Online/IOnlineService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import { Usernames } from '../Names';
import SmActiveButtonComponent from '../../Common/Button/Stylish/SmActiveButtonComponent';
import Visible from '../../Common/Visible/VisibleComponent';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';
import { ISocketService } from '../../../Services/Socket/ISocketService';
import { NetworkObserver } from '../../../Core/Utils/Events/NetworkObserver';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { IServerSocket } from '../../../Network/Socket/Server/IServerSocket';

export default class CreatingHostComponent extends Component<any, CreatingHostState> {
	private _profilService: IPlayerProfilService;
	private _socket: IServerSocket;
	private _obs: NetworkObserver[];

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
			route('/Lobby', true);
		} else {
			toastr['warning'](`${message.Content.RoomName} is already used.`, 'WARNING', {
				iconClass: 'toast-red'
			});
		}
	}

	private OnError(message: NetworkMessage<any>): void {
		toastr['warning'](`Server doesn't seem to be running.`, 'WARNING', { iconClass: 'toast-red' });
	}

	componentWillUnmount(): void {
		this._socket.Off(this._obs);
	}

	render() {
		return (
			<Redirect>
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

					<TextComponent
						max={15}
						value={this.state.PlayerName}
						label={'Name'}
						isEditable={true}
						onInput={(e: any) => {
							this.setState({ PlayerName: (e.target.value as string).substring(0, 15) });
						}}
					/>
					<TextComponent
						max={15}
						value={this.state.RoomName}
						label={'Room name'}
						isEditable={true}
						onInput={(e: any) => {
							this.setState({ RoomName: (e.target.value as string).substring(0, 15) });
						}}
					/>
					<div class="container-center-horizontal">
						<Visible isVisible={this.state.HasPassword}>
							<TextComponent
								max={15}
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
			</Redirect>
		);
	}

	private Start(): void {
		this._socket.Emit(NetworkMessage.Create(PacketKind.Exist, { RoomName: this.state.RoomName }));
	}

	private Back() {
		route('/Home', true);
	}
}

import { Component, h } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import * as io from 'socket.io-client';
import { CreatingHostState } from './CreatingHostState';
import { PacketKind } from '../../../Network/Message/PacketKind';
import MdPanelComponent from '../../Common/Panel/MdPanelComponent';
import TextComponent from '../../Common/Text/TextComponent';
import { Factory, FactoryKey } from '../../../Factory';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import { Usernames } from '../Names';
import SmActiveButtonComponent from '../../Common/Button/Stylish/SmActiveButtonComponent';
import Visible from '../../Common/Visible/VisibleComponent';
import { IPlayerProfilService } from '../../../Services/PlayerProfil/IPlayerProfilService';

export default class CreatingHostComponent extends Component<any, CreatingHostState> {
	private _socket: SocketIOClient.Socket;
	private _profilService: IPlayerProfilService;

	constructor() {
		super();
		this._profilService = Factory.Load<IPlayerProfilService>(FactoryKey.PlayerProfil);
		this.setState({
			RoomName: `${this._profilService.GetProfil().LastPlayerName}'s room`,
			PlayerName: this._profilService.GetProfil().LastPlayerName
		});
		this._socket = io('{{p2pserver}}', { path: '{{p2psubfolder}}' });
		this.Listen();
	}

	componentWillUnmount() {
		if (this._socket) {
			this._socket.close();
		}
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

	private Listen(): void {
		this._socket.on('connect', () => {
			this._socket.on(PacketKind[PacketKind.Exist], (data: { Exist: boolean; RoomName: string }) => {
				if (!data.Exist) {
					Factory.Load<IHostingService>(FactoryKey.Hosting).Register(
						this.state.PlayerName,
						this.state.RoomName,
						this.state.Password,
						this.state.HasPassword,
						true
					);
					route('/Hosting', true);
				} else {
					toastr['warning'](`${data.RoomName} is already used.`, 'WARNING', { iconClass: 'toast-red' });
				}
			});
		});
		this._socket.on('connect_error', (error: string) => {
			toastr['warning'](`Server doesn't seem to be running.`, 'WARNING', { iconClass: 'toast-red' });
		});
	}

	private Start(): void {
		this._socket.emit(PacketKind[PacketKind.Exist], { RoomName: this.state.RoomName });
	}

	private Back() {
		route('/Home', true);
	}
}

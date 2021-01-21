import { Component, h } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import * as io from 'socket.io-client';
import { CreatingHostState } from './CreatingHostState';
import { PacketKind } from '../../../Network/Message/PacketKind';
import PanelComponent from '../../Common/Panel/PanelComponent';
import TextComponent from '../../Common/Text/TextComponent';
import { Factory, FactoryKey } from '../../../Factory';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';

export default class CreatingHostComponent extends Component<any, CreatingHostState> {
	private _socket: SocketIOClient.Socket;

	constructor() {
		super();
		this.setState({
			RoomName: "John's room",
			PlayerName: 'John'
		});
		this._socket = io('https://kimchistudio.tech:5000');
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
				<PanelComponent>
					<TextComponent
						value={this.state.RoomName}
						label={'Room name'}
						isEditable={true}
						onInput={(e: any) => {
							this.setState({ RoomName: e.target.value });
						}}
					/>
					<TextComponent
						value={this.state.PlayerName}
						label={'Playername'}
						isEditable={true}
						onInput={(e: any) => {
							this.setState({ PlayerName: e.target.value });
						}}
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
								this.Start();
							}}
							color={ColorKind.Red}
						>
							<Icon Value="far fa-play-circle" /> Start
						</ButtonComponent>
					</div>
				</PanelComponent>
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

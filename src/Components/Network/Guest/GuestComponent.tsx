import { h, Component } from 'preact';
import { route } from 'preact-router';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import TextComponent from '../../Common/Text/TextComponent';
import PanelComponent from '../../Common/Panel/PanelComponent';
import GridComponent from '../../Common/Grid/GridComponent';
import SmButtonComponent from '../../Common/Button/Stylish/SmButtonComponent';
import { Factory, FactoryKey } from '../../../Factory';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import Redirect from '../../Redirect/RedirectComponent';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import { Usernames } from '../Names';
import { RoomInfo } from './RoomInfo';
import * as io from 'socket.io-client';

export default class GuestComponent extends Component<any, { Rooms: RoomInfo[]; PlayerName: string }> {
	private _socket: SocketIOClient.Socket;
	constructor() {
		super();
		this.setState({
			Rooms: new Array<RoomInfo>(),
			PlayerName: 'Alice'
		});
		this._socket = io('{{p2pserver}}', { path: '{{p2psubfolder}}' });
		this._socket.connect();
		this.Listen();
	}

	componentDidMount() {}

	componentWillUnmount() {
		if (this._socket) {
			this._socket.close();
		}
	}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<div class="container-center-horizontal">
						<TextComponent
							value={this.state.PlayerName}
							label={'Playername'}
							isEditable={true}
							onInput={(e: any) => {
								this.setState({ PlayerName: e.target.value });
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
					<div class="container-center-horizontal">
						<TextComponent value={''} label={'Filter'} isEditable={true} onInput={(e: any) => {}} />
						<div class="space-out" />
						<SmButtonComponent callBack={() => {}} color={ColorKind.Black}>
							<Icon Value="fas fa-filter" />
						</SmButtonComponent>
					</div>
					<GridComponent
						left={this.Header()}
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
				</PanelComponent>
			</Redirect>
		);
	}

	private Header() {
		return (
			<thead>
				<tr class="d-flex">
					<th scope="col">Name</th>
					<th scope="col">Players</th>
					<th scope="col" />
				</tr>
			</thead>
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
				{this.state.Rooms.map((roomInfo) => {
					return (
						<tr class="d-flex">
							<td class="align-self-center">
								<SmButtonComponent callBack={() => this.Join(roomInfo.Name)} color={ColorKind.Black}>
									{'Join'}
								</SmButtonComponent>
							</td>
							<td class="align-self-center">{roomInfo.Name}</td>
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
		this._socket.emit(PacketKind[PacketKind.Available], {
			RoomName: roomName,
			PlayerName: this.state.PlayerName
		});
	}

	private Back() {
		route('/Home', true);
	}

	private Refresh() {
		this._socket.emit(PacketKind[PacketKind.Rooms]);
	}

	private Listen(): void {
		this._socket.on('connect', () => {
			this._socket.emit(PacketKind[PacketKind.Rooms]);
			this._socket.on(PacketKind[PacketKind.Rooms], (packet: { Content: RoomInfo[] }) => {
				// for (let index = 0; index < 100; index++) {
				// 	packet.Content.push(
				// 		new RoomInfo(
				// 			Usernames[Math.round(Math.random() * Usernames.length - 1)],
				// 			Math.round(Math.random() * 3),
				// 			4
				// 		)
				// 	);
				// }
				this.setState({
					Rooms: packet.Content
				});
			});
			this._socket.on(PacketKind[PacketKind.Available], (data: { IsAvailable: boolean; RoomName: string }) => {
				if (data.IsAvailable) {
					Factory.Load<IHostingService>(FactoryKey.Hosting).Register(
						this.state.PlayerName,
						data.RoomName,
						false
					);
					route('/Hosting', true);
				} else {
					toastr['warning'](`${this.state.PlayerName} is already used in ${data.RoomName}`, 'WARNING', {
						iconClass: 'toast-red'
					});
				}
			});
		});
		this._socket.on('connect_error', (error: string) => {
			toastr['warning'](`Server doesn't seem to be running.`, 'WARNING', { iconClass: 'toast-red' });
		});
	}
}
